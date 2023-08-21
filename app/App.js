import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Modal,
  Text,
  BackHandler,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./pages/HomeScreen";
import Settings from "./pages/Settings";
import { generateMnemonic } from "react-native-bip39";
import * as Keychain from "react-native-keychain";
import DHT from "@hyperswarm/dht-relay";
import Hyperswarm from "hyperswarm";
import Stream from "@hyperswarm/dht-relay/ws";
import RNFS from "react-native-fs";
import b4a from "b4a";
import CryptoJS from "crypto-js";

import { Buffer } from "buffer";
import Connections from "./pages/Connections";

const Tab = createBottomTabNavigator();

export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [wordsUpload, setWordsUpload] = useState("");
  const [stateWordsUpload, setStateWordsUpload] = useState(false);
  const [passwordItems, setPasswordItems] = useState({});
  const [pubkey, setPubkey] = useState("");
  const [peerId, setPeerId] = useState([
    "ca060a9e047c55c61f3906594e7adbec021af85a214b0412753125ca82ed60d6",
  ]);
  const [peerInput, setPeerInput] = useState("");
  const [showModalPeer, setShowModalPeer] = useState(false);
  const [connection, setConnection] = useState(null);
  const [nameConnection, setNameConnection] = useState("");
  const [passwordsChanged, setPasswordsChanged] = useState(false);
  const [stateSwarm, setStateSwarm] = useState(null);
  const [stateDHT, setStateDHT] = useState(null);
  const [stateTopic, setStateTopic] = useState("");
  const [messageChangedWords, setMessageChangedWords] = useState(false);

  const updatedDataString = useRef("");

  const loadServer = async () => {
    try {
      const relay = new WebSocket("ws://52.29.163.205:49443");
      const stream = new Stream(true, relay);
      stream.off = stream.on; // This is a hack to fix a bug in the dht-relay library

      console.log("Load server with mnemonic: " + mnemonic);

      const keyPair = DHT.keyPair(Buffer.alloc(32).fill(mnemonic));
      const pubkey = b4a.toString(keyPair.publicKey, "hex");
      setPubkey(pubkey);
      console.log("pubkey:", pubkey);

      const dht = new DHT(stream);

      const swarm = new Hyperswarm({
        dht: dht,
        keyPair: keyPair,
      });

      setStateSwarm(swarm);
      setStateDHT(dht);

      const connTopic = Buffer.alloc(32, "topicofhyperpass");
      setStateTopic(connTopic);

      const discovery = swarm.join(connTopic, { server: true, client: true });

      const conns = [];

      swarm.on("connection", (conn) => {
        setConnection(conn);
        const name = b4a.toString(conn.remotePublicKey, "hex");
        setNameConnection(name);
        console.log("* got a connection from:", name, "*");
        if (peerId.includes(name)) {
          conns.push(conn);
          conn.once("close", () => conns.splice(conns.indexOf(conn), 1));
          conn.on("data", async (data) => {
            try {
              const parsed = String.fromCharCode(...data);
              const parsedData = JSON.parse(parsed);
              const pubkey = parsedData._id;
              const encrypted = parsedData.passwords.encryption;
              const timestamp = parsedData.timestamp;
              const options = {
                mode: CryptoJS.mode.CFB, // Encryption mode (you can choose the appropriate one)
                iv: CryptoJS.lib.WordArray.random(16), // Random initialization vector
              };
              const bytes = CryptoJS.AES.decrypt(encrypted, mnemonic, options);
              const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
              const decrypted = JSON.parse(decryptedString);
              console.log("decrypted", decrypted);
              const encryptedNewData = {
                _id: pubkey,
                passwords: Object.keys(decrypted).map((key) => ({
                  _id: key,
                  ...decrypted[key],
                })),
                timestamp: timestamp,
              };
              let transformedData = {};
              if (updatedDataString.current) {
                const parsedUpdatedDataString = JSON.parse(
                  updatedDataString.current
                );
                if (
                  encryptedNewData.timestamp >=
                  parsedUpdatedDataString.timestamp
                ) {
                  encryptedNewData.passwords.forEach((password, index) => {
                    transformedData[index + 1] = {
                      title: password.title,
                      username: password.username,
                      password: password.password,
                      note: password.note,
                      link: password.link,
                      image: password.image,
                    };
                  });
                  if (Object.keys(transformedData).length > 0) {
                    setPasswordItems(transformedData);
                    const newData = {
                      transformedData,
                      timestamp: timestamp,
                    };
                    updatedDataString.current = newData;
                    savePasswordsToStorage();
                  } else {
                    setPasswordItems({});
                    const newData = {
                      transformedData,
                      timestamp: timestamp,
                    };
                    updatedDataString.current = newData;
                    savePasswordsToStorage();
                  }
                } else {
                  for (const key in parsedUpdatedDataString.passwords) {
                    transformedData[key] =
                      parsedUpdatedDataString.passwords[key];
                  }
                  if (Object.keys(transformedData).length > 0) {
                    setPasswordItems(transformedData);
                    setPasswordsChanged(true);
                  } else {
                    setPasswordItems({});
                    setPasswordsChanged(true);
                  }
                }
              } else {
                encryptedNewData.passwords.forEach((password, index) => {
                  transformedData[index + 1] = {
                    title: password.title,
                    username: password.username,
                    password: password.password,
                    note: password.note,
                    link: password.link,
                    image: password.image,
                  };
                });
                if (Object.keys(transformedData).length > 0) {
                  setPasswordItems(transformedData);
                  const newData = {
                    transformedData,
                    timestamp: timestamp,
                  };
                  updatedDataString.current = newData;
                  savePasswordsToStorage();
                } else {
                  setPasswordItems({});
                  const newData = {
                    transformedData,
                    timestamp: timestamp,
                  };
                  updatedDataString.current = newData;
                  savePasswordsToStorage();
                }
              }
            } catch (err) {
              console.log("Errore di parsing JSON:", err.message);
            }
          });
        } else {
          console.log("ban:", name);
        }
      });
    } catch (err) {
      console.log("Errore:", err.message);
    }
  };

  useEffect(() => {
    if (passwordsChanged) {
      const timestamp = new Date().toLocaleString("it-IT", {
        timeZone: "Europe/Rome",
      });
      const updatedData = {
        passwords: passwordItems,
        timestamp: timestamp,
      };
      updatedDataString.current = JSON.stringify(updatedData, null, 2);
      setPasswordsChanged(false);
      savePasswordsToStorage();
    }
  }, [passwordsChanged]);

  const sendPasswordsToDB = () => {
    if (peerId.includes(nameConnection)) {
      try {
        if (updatedDataString.current) {
          const parsedData = JSON.parse(updatedDataString.current);
          const passwordsData = parsedData.passwords;
          const passwordsJson = JSON.stringify(passwordsData);
          const data = CryptoJS.enc.Utf8.parse(passwordsJson);
          const options = {
            mode: CryptoJS.mode.CFB, // Encryption mode (you can choose the appropriate one)
            iv: CryptoJS.lib.WordArray.random(16), // Random initialization vector
          };
          const encryptedPasswords = CryptoJS.AES.encrypt(
            data,
            mnemonic,
            options
          );
          const encryptedData = {
            passwords: {
              encryption: encryptedPasswords.toString(),
            },
            timestamp: parsedData.timestamp,
          };
          const encryptedDataJson = JSON.stringify(encryptedData);
          connection.write(encryptedDataJson);
        }
      } catch (err) {
        console.log("Err1", err);
      }
    }
  };

  useEffect(() => {
    sendPasswordsToDB();
  }, [passwordsChanged]);

  useEffect(() => {
    sendPasswordsToDB();
  }, []);

  const savePasswordsToStorage = () => {
    RNFS.writeFile(
      RNFS.DocumentDirectoryPath + "/storage",
      JSON.stringify(updatedDataString.current),
      "utf8"
    )
      .then((success) => {
        console.log("FILE WRITTEN!");
      })
      .catch((err) => {
        console.log("Err2", err.message);
      });
  };

  const clearPasswordsFromStorage = () => {
    const filePath = RNFS.DocumentDirectoryPath + "/storage";

    RNFS.writeFile(filePath, "", "utf8")
      .then(() => {
        console.log("Local data cleared!");
      })
      .catch((err) => {
        console.log("clear", err.message);
      });
  };

  const handleWordsUpload = async () => {
    if (stateWordsUpload) {
      console.log("Words changed");
      clearPasswordsFromStorage();
      setStateWordsUpload(false);
      setPasswordItems({});
      setMessageChangedWords(true);
      setTimeout(() => {
        setMessageChangedWords(false);
        BackHandler.exitApp();
      }, 60 * 1000);
      await stateDHT.close();
      //await connection.destroy();
      await stateSwarm.leave(stateTopic);
    }
  };

  useEffect(() => {
    handleWordsUpload();
  }, [stateWordsUpload]);

  const loadPasswordsFromStorage = () => {
    const filePath = RNFS.DocumentDirectoryPath + "/storage";

    RNFS.exists(filePath)
      .then((exists) => {
        if (!exists) {
          // If the file does not exist, create an empty file
          return RNFS.writeFile(filePath, "", "utf8");
        }
      })
      .then(() => {
        return RNFS.readFile(filePath, "utf8");
      })
      .then((contents) => {
        try {
          if (contents) {
            const load = JSON.parse(contents);
            console.log("load", load);
            updatedDataString.current = load;
            if (load.timestamp !== undefined && load.timestamp != "") {
              const transformedData = load.transformedData;
              setPasswordItems(transformedData);
            } else {
              const loadedPasswords = JSON.parse(load);
              const transformedPasswords = {};

              for (const key in loadedPasswords.passwords) {
                const passwordData = loadedPasswords.passwords[key];
                const transformedData = {
                  image: passwordData.image,
                  link: passwordData.link,
                  note: passwordData.note,
                  password: passwordData.password,
                  title: passwordData.title,
                  username: passwordData.username,
                };
                transformedPasswords[key] = transformedData;
              }
              setPasswordItems(transformedPasswords);
            }
          }
        } catch (err) {
          console.log("Missing file", err.message);
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
      });
  };

  useEffect(() => {
    if (mnemonic !== "") {
      loadPasswordsFromStorage();
    }
  }, [mnemonic]);

  useEffect(() => {
    // Update the mnemonic whenever wordsUpload changes
    if (wordsUpload !== "") {
      setMnemonic(wordsUpload);
      saveMnemonicToKeychain();
    }
  }, [wordsUpload]);

  useEffect(() => {
    // Save the mnemonic whenever it changes
    saveMnemonicToKeychain();
  }, [mnemonic]);

  const loadSeed = async () => {
    try {
      const mnemonicFromKeychain = await Keychain.getGenericPassword({
        service: "our-p2p-password-key",
        accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
        accessControl:
          Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        authenticationType:
          Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
      });

      if (mnemonicFromKeychain && mnemonicFromKeychain.password) {
        // If mnemonic is already stored in Keychain, use it
        setMnemonic(mnemonicFromKeychain.password);
      } else {
        // If mnemonic is not stored in Keychain or incomplete, generate new one
        const generatedMnemonic = await generateSeedPhrase();
        if (generatedMnemonic) {
          setMnemonic(generatedMnemonic);
          // Save the generated mnemonic in Keychain with the specified access control
          await Keychain.setGenericPassword("mnemonic", generatedMnemonic, {
            service: "our-p2p-password-key",
            accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            accessControl:
              Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
            authenticationType:
              Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
          });
        } else {
          // Handle the case when mnemonic generation fails
          console.error("Mnemonic generation failed.");
        }
      }
    } catch (error) {
      setMessageError(true);
    }
  };

  const generateSeedPhrase = async () => {
    try {
      const mnemonic = await generateMnemonic();
      return mnemonic;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const saveMnemonicToKeychain = async () => {
    try {
      // Save the updated mnemonic in Keychain only if it is not empty
      if (mnemonic !== "") {
        await Keychain.setGenericPassword("mnemonic", mnemonic, {
          service: "our-p2p-password-key",
          accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
          securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
          accessControl:
            Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
          authenticationType:
            Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        });
      }
    } catch (error) {
      console.log("Err3", error);
      setMessageError(true);
    }
  };

  const handlePeer = () => {
    if (peerInput.trim() !== "") {
      setPeerId((prevPeerId) => [...prevPeerId, peerInput]);
      setPeerInput("");
    }
    setShowModalPeer(true);
  };

  {
    /**
  const saveWhitelistToStorage = () => {
    RNFS.writeFile(
      RNFS.DocumentDirectoryPath + "/whitelist",
      JSON.stringify(peerId),
      "utf8"
    )
      .then((success) => {
        console.log("WHITE LIST WRITTEN!");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const loadWhitelistFromStorage = () => {
    RNFS.readFile(RNFS.DocumentDirectoryPath + "/whitelist", "utf8")
      .then((contents) => {
        console.log("white list", contents);
      })
      .catch((err) => {
        console.log("Error reading file:", err.message);
      });
  };

  useEffect(() => {
    //loadWhitelistFromStorage();
  }, []);

  useEffect(() => {
    //saveWhitelistToStorage();
    //console.log(peerId);
  }, [peerId]);
  */
  }

  useEffect(() => {
    loadSeed();
    if (mnemonic !== "") {
      loadServer();
    }
  }, [mnemonic]);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#8386f5",
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Image
                style={styles.icon}
                source={
                  focused
                    ? require("../app/assets/icons/home-color.png")
                    : require("../app/assets/icons/home.png")
                }
                resizeMode="contain"
              />
            ),
            headerShown: false,
          }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              mnemonic={mnemonic}
              passwordItems={passwordItems}
              setPasswordItems={setPasswordItems}
              setPasswordsChanged={setPasswordsChanged}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Connections"
          options={{
            title: "Connections",
            tabBarIcon: ({ focused }) => (
              <Image
                style={styles.icon}
                source={
                  focused
                    ? require("../app/assets/icons/connections-color.png")
                    : require("../app/assets/icons/connections.png")
                }
                resizeMode="contain"
              />
            ),
            headerShown: false,
          }}
        >
          {(props) => (
            <Connections
              {...props}
              peerInput={peerInput}
              setPeerInput={setPeerInput}
              handlePeer={handlePeer}
              showModalPeer={showModalPeer}
              setShowModalPeer={setShowModalPeer}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused }) => (
              <Image
                style={styles.icon}
                source={
                  focused
                    ? require("../app/assets/icons/settings-color.png")
                    : require("../app/assets/icons/settings.png")
                }
                resizeMode="contain"
              />
            ),
            headerShown: false,
          }}
        >
          {(props) => (
            <Settings
              {...props}
              mnemonic={mnemonic}
              wordsUpload={wordsUpload}
              setWordsUpload={setWordsUpload}
              pubkey={pubkey}
              setStateWordsUpload={setStateWordsUpload}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {messageError && (
        <Modal visible={true} transparent={true} onRequestClose={() => {}}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Image
                source={require("../app/assets/error.png")}
                style={styles.errorImage}
              />
              <Text style={styles.errorMessage}>Unable to login</Text>
              <Text style={styles.retryMessage}>
                Please close the app and try again in 1 minute
              </Text>
            </View>
          </View>
        </Modal>
      )}
      {messageChangedWords && (
        <Modal visible={true} transparent={true} onRequestClose={() => {}}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Image
                source={require("../app/assets/loading.gif")}
                style={styles.loadingImage}
              />
              <Text style={styles.errorMessage}>
                We are loading your passwords...
              </Text>
              <Text style={styles.retryMessage}>
                The app will close in 60 seconds
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  retryMessage: {
    fontSize: 16,
    textAlign: "center",
  },
});
