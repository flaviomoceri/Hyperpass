import Hyperswarm from "hyperswarm";
import DHT from "hyperdht";
import gracefulGoodbye from "graceful-goodbye";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017/hyperpass', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function initializeSwarm() {
  const seedPhrase = process.env.SEED_PHRASE;
  const keyPair = DHT.keyPair(Buffer.alloc(32).fill(seedPhrase));
  console.log("Public key:", keyPair.publicKey.toString("hex"));

  const swarm = new Hyperswarm({
    keyPair: keyPair,
  });

  gracefulGoodbye(() => swarm.destroy());

  return swarm;
}

async function sendExistingItems(conn, pubkey, collection) {
  try {
    const existingItem = await collection.findOne({ _id: pubkey }).lean();
    if (existingItem) {
      console.log("Data found:", JSON.stringify(existingItem));
      conn.write(JSON.stringify(existingItem));
    } else {
      console.log("Item not found in the database.");
    }
  } catch (error) {
    console.error("Error sending existing items:", error);
  }
}

async function receiveAndSaveData(data, conn, peerInfo, collection) {
  try {
    const jsonData = JSON.parse(data.toString());
    const pubkey = peerInfo.publicKey.toString("hex");

    const existingData = await collection.findOne({ _id: pubkey });

    if (existingData) {
      const existingTimestamp = existingData.timestamp;
      const newTimestamp = jsonData.timestamp;

      if (newTimestamp > existingTimestamp) {
        await collection.deleteOne({ _id: pubkey });

        const doc = new collection({
          _id: pubkey,
          passwords: jsonData.passwords,
          timestamp: jsonData.timestamp,
        });
        await doc.save();
        console.log("Data updated successfully:", doc);
        sendExistingItems(conn, pubkey, collection);
      } else {
        console.log("Data in the database is more recent or equal. No action needed.");
      }
    } else {
      const doc = new collection({
        _id: pubkey,
        passwords: jsonData.passwords,
        timestamp: jsonData.timestamp,
      });
      await doc.save();
      console.log("Data successfully saved:", doc);
      sendExistingItems(conn, pubkey, collection);
    }
  } catch (error) {
    console.error("Error receiving and saving data:", error);
  }
}

async function startApp() {
  await connectToMongoDB();

  const swarm = await initializeSwarm();

  const collection = mongoose.model("passwords", new mongoose.Schema({
    _id: String,
    passwords: mongoose.Schema.Types.Mixed,
    timestamp: String,
  }, { versionKey: false }));

  const conns = [];
  const topic = Buffer.alloc(32).fill("topicofhyperpass");

  function joinTopicAndFlush() {
    const discovery = swarm.join(topic, { server: true });
    discovery.flushed().then(() => {
      console.log("joined topic:", topic.toString("hex"));
    });
  }

  swarm.on("connection", (conn, peerInfo) => {
    const name = conn.remotePublicKey.toString("hex");
    console.log("* got a connection from:", name, "*");
    conns.push(conn);
    conn.once("close", () => conns.splice(conns.indexOf(conn), 1));
    conn.on("data", (data) => receiveAndSaveData(data, conn, peerInfo, collection));
    conn.on("error", (error) => console.error("Error:", error));
    sendExistingItems(conn, name, collection);
  });

  swarm.on("error", (error) => {
    console.error("Error:", error);
  });

  // Join the topic initially
  joinTopicAndFlush();

  // Periodically refresh the topic to maintain discovery
  setInterval(joinTopicAndFlush, 60 * 1000); // Refresh every 60 seconds
}

startApp().catch((error) => {
  console.error("An unhandled error occurred:", error);
});