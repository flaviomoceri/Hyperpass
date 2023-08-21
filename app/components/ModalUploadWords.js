import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import AlertWords from "./AlertWords";

const ModalUploadWords = ({
  modalVisible,
  setModalVisible,
  setWordsUpload,
  setStateWordsUpload,
}) => {
  const [words, setWords] = useState([]);
  const [requiredMessageVisible, setRequiredMessageVisible] = useState(false);
  const [alertWords, setAlertWords] = useState(false);

  const handleWordChange = (index, value) => {
    // Remove any spaces from the entered text
    const sanitizedValue = value.replace(/\s/g, "").toLowerCase();
    setWords((prevWords) => {
      const updatedWords = [...prevWords];
      updatedWords[index] = sanitizedValue;
      return updatedWords;
    });
  };

  const closeModal = () => {
    setModalVisible(!modalVisible);
    setRequiredMessageVisible(false);
  };

  const handleOpenAlert = () => {
    if (words.length === 12 && words.every((word) => word.trim().length > 0)) {
      setAlertWords(true);
      setRequiredMessageVisible(false);
    } else {
      setRequiredMessageVisible(true);
    }
  };

  const handleDeleteConfirmation = () => {
    const wordsString = words.join(" ");
    setWordsUpload(wordsString);
    setWords([]);
    setModalVisible(false);
    setAlertWords(false);
    setStateWordsUpload(true);
  };

  const handleDeleteCancel = () => {
    setAlertWords(false);
  };

  const generateWordInputs = () => {
    const wordInputs = [];
    for (let i = 0; i < 12; i += 2) {
      wordInputs.push(
        <View key={i} style={styles.containerTextInput}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputModal}
              placeholder={`Word ${i + 1}`}
              value={words[i] || ""}
              onChangeText={(text) => handleWordChange(i, text)}
              required
            />
            {requiredMessageVisible && !words[i] && (
              <Text style={styles.requiredText}>* Required</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputModal}
              placeholder={`Word ${i + 2}`}
              value={words[i + 1] || ""}
              onChangeText={(text) => handleWordChange(i + 1, text)}
              required
            />
            {requiredMessageVisible && !words[i + 1] && (
              <Text style={styles.requiredText}>* Required</Text>
            )}
          </View>
        </View>
      );
    }
    return wordInputs;
  };

  const wordInputs = generateWordInputs();

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
        <ScrollView
          style={styles.modalView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.buttonCloseModal}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={closeModal}
            >
              <Image
                source={require("../assets/icons/left-arrow.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.closeLabel}>
            <Text style={styles.closeLabelText}>Import your words</Text>
          </View>
          <View style={[styles.cardModal]}>{wordInputs}</View>
          <View style={styles.containerSaveRandom}>
            <TouchableOpacity
              style={[styles.buttonModal]}
              onPress={handleOpenAlert}
            >
              <Text style={styles.buttonTextModal}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }}></View>
        </ScrollView>
      </View>
      <AlertWords
        alertWords={alertWords}
        setAlertWords={setAlertWords}
        handleDeleteConfirmation={handleDeleteConfirmation}
        handleDeleteCancel={handleDeleteCancel}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    padding: 25,
    flexGrow: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 15,
  },
  closeLabel: {
    position: "absolute",
    top: 8,
    left: 60,
  },
  closeLabelText: {
    fontSize: 20,
    fontWeight: 600,
  },
  icon: {
    width: 22,
    height: 22,
  },
  containerTextInput: {
    flexDirection: "row",
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
    top: 0,
    left: 0,
    zIndex: 1,
  },
  cardModal: {
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    padding: 20,
    width: "100%",
    marginTop: 100,
  },
  sectionModal: {
    marginBottom: 20,
  },
  inputModal: {
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    padding: 20,
    paddingBottom: 15,
    width: "95%",
    color: "black",
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
    alignSelf: "flex-start",
    marginLeft: 5,
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

export default ModalUploadWords;
