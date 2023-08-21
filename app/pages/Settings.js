import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import ModalViewWords from "../components/ModalViewWords";
import ModalUploadWords from "../components/ModalUploadWords";
import ModalLanguage from "../components/ModalLanguage";
import * as Clipboard from "expo-clipboard";

const Settings = ({
  mnemonic,
  wordsUpload,
  setWordsUpload,
  pubkey,
  setStateWordsUpload,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [ModalUploadVisible, setModalUploadVisible] = useState(false);
  const [modalLanguage, setModalLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [copyPubKey, setCopyPubKey] = useState(false);

  const shortenedPubkey = pubkey.substring(0, 12) + "...";

  const handleCopyPubKey = async () => {
    await Clipboard.setStringAsync(pubkey);
    setCopyPubKey(!copyPubKey);
    setTimeout(() => {
      setCopyPubKey(false);
    }, 1000);
  };

  useEffect(() => {
    console.log("Selected language:", selectedLanguage);
  }, [selectedLanguage]);

  const handlePress = () => {
    Linking.openURL("https://app.mash.com/e/hyperpass");
  };
  return (
    <View style={styles.container}>
      <View style={styles.passwordsWrapper}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require("../assets/icons/book.png")}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Visualize your words</Text>
          <Image
            source={require("../assets/icons/right-arrow.png")}
            resizeMode="contain"
            style={styles.iconRight}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setModalUploadVisible(true)}
        >
          <Image
            source={require("../assets/icons/upload.png")}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Import your words</Text>
          <Image
            source={require("../assets/icons/right-arrow.png")}
            resizeMode="contain"
            style={styles.iconRight}
          />
        </TouchableOpacity>

        {/**
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalLanguage(true)}>
        <Image
         source={require("../assets/icons/language.png")} 
         resizeMode="contain"
         style={styles.icon}
        />
          <Text style={styles.buttonText}>Change language</Text>
          <Text style={{ color: 'gray', marginRight: 10 }}>{selectedLanguage}</Text><Image
         source={require("../assets/icons/right-arrow.png")} 
         resizeMode="contain"
         style={styles.iconRight}
        />
        </TouchableOpacity>
*/}
        {/* Section "PubKey" */}
        <TouchableOpacity
          onPress={handleCopyPubKey}
          style={styles.buttonContainer}
        >
          <Image
            source={require("../assets/icons/key.png")}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Public key: {shortenedPubkey}</Text>
          {!copyPubKey ? (
            <Image
              source={require("../assets/icons/copy.png")}
              resizeMode="contain"
              style={styles.iconCopy}
            />
          ) : (
            <Image
              source={require("../assets/icons/confirm.png")}
              resizeMode="contain"
              style={styles.iconCopy}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
          <Image
            source={require("../assets/icons/donation.png")}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Make a donation</Text>
          <Image
            source={require("../assets/icons/link.png")}
            resizeMode="contain"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>
      <ModalViewWords
        mnemonic={mnemonic}
        modalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
      <ModalUploadWords
        setStateWordsUpload={setStateWordsUpload}
        wordsUpload={wordsUpload}
        setWordsUpload={setWordsUpload}
        modalVisible={ModalUploadVisible}
        setModalVisible={setModalUploadVisible}
      />
      <ModalLanguage
        modalVisible={modalLanguage}
        setModalVisible={setModalLanguage}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconRight: {
    width: 18,
    height: 18,
  },
  iconCopy: {
    width: 22,
    height: 22,
  },
  passwordsWrapper: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "gray",
    fontWeight: "500",
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
});

export default Settings;
