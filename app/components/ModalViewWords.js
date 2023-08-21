import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";

const ModalViewWords = ({ modalVisible, setModalVisible, mnemonic }) => {
  const [words, setWords] = useState([]);
  const [revealWords, setRevealWords] = useState(false);

  useEffect(() => {
    if (mnemonic) {
      const mnemonicWords = mnemonic.trim().split(" ");
      const formattedWords = mnemonicWords.map((word, index) => ({
        id: `${index + 1}`,
        word,
      }));
      setWords(formattedWords);
    }
  }, [mnemonic]);

  const handleWordChange = (wordId, value) => {
    setWords((prevWords) =>
      prevWords.map((word) =>
        word.id === wordId ? { ...word, word: value } : word
      )
    );
  };

  const toggleRevealWords = () => {
    setRevealWords((prevReveal) => !prevReveal);
  };

  const wordsGroups = Array.from(
    { length: Math.ceil(words.length / 2) },
    (_, i) => words.slice(i * 2, i * 2 + 2)
  );

  const handleButtonPress = () => {
    setModalVisible(!modalVisible);
    setRevealWords(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.buttonCloseModal}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleButtonPress}
            >
              <Image
                source={require("../assets/icons/left-arrow.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.closeLabel}>
            <Text style={styles.closeLabelText}>Visualize your words</Text>
          </View>
          <View style={styles.cardModal}>
            {wordsGroups.map((group, rowIndex) => (
              <View key={rowIndex} style={styles.containerTextInput}>
                {group.map((word) => (
                  <TextInput
                    key={word.id}
                    style={styles.inputModal}
                    placeholder={word.id}
                    editable={false}
                    secureTextEntry={!revealWords}
                    value={word.id + "." + " " + word.word}
                    onChangeText={(text) => handleWordChange(word.id, text)}
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={styles.containerSaveRandom}>
            <TouchableOpacity
              style={[styles.buttonModal]}
              onPress={toggleRevealWords}
            >
              <Text style={styles.buttonTextModal}>
                {revealWords ? "Hide" : "Reveal"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 22,
    height: 22,
  },
  containerTextInput: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 20,
    elevation: 2,
    backgroundColor: "#8386f5",
  },
  buttonClose: {
    padding: 10,
  },
  buttonCloseModal: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  image: {
    backgroundColor: "transparent",
    borderRadius: 20,
    width: "34%",
    height: "15%",
    marginTop: 45,
  },
  cardModal: {
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    padding: 20,
    width: "100%",
  },
  sectionModal: {
    marginBottom: 20,
  },
  inputModal: {
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    marginBottom: 15,
    padding: 20,
    paddingBottom: 15,
    width: "48%",
    color: "black",
  },
  closeLabel: {
    position: "absolute",
    top: 28,
    left: 80,
  },
  closeLabelText: {
    fontSize: 20,
    fontWeight: 600,
  },
  inputTitleModalDefault: {
    padding: 10,
    marginTop: 20,
    width: 300,
    textAlign: "center",
  },
  inputTitleModal: {
    padding: 10,
    marginTop: 20,
    width: 300,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  eyeIcon: {
    position: "absolute",
    top: 10,
    right: 45,
  },
  copyIconContainer: {
    position: "absolute",
    top: 12,
    right: 10,
  },
  buttonModal: {
    backgroundColor: "#8386f5",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    width: 158,
    alignItems: "center",
  },
  buttonModalGenerate: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    width: 158,
    alignItems: "center",
  },
  buttonTextModal: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextModalGenerate: {
    color: "gray",
    fontWeight: "bold",
    textAlign: "center",
  },
  uploadImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 90,
    borderColor: "lightgray",
    padding: 20,
    borderRadius: 80,
  },

  uploadImageText: {
    marginLeft: 10,
  },
  containerSaveRandom: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  requiredText: {
    color: "red",
    fontSize: 12,
    alignSelf: "center",
  },
});

export default ModalViewWords;
