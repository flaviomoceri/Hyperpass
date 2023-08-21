import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Modal } from "react-native";

const ModalLanguage = ({
  modalVisible,
  setModalVisible,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const [isITSelected, setIsITSelected] = useState(selectedLanguage === "IT");
  const [isENSelected, setIsENSelected] = useState(selectedLanguage === "EN");

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setModalVisible(false);
  };

  useEffect(() => {
    setIsITSelected(selectedLanguage === "IT");
    setIsENSelected(selectedLanguage === "EN");
  }, [selectedLanguage]);

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.buttonContainer}>
            {/* Button to select the language "IT" */}
            <TouchableOpacity
              style={[
                styles.buttonModal,
                isITSelected ? styles.selectedButton : null,
              ]}
              onPress={() => handleLanguageChange("IT")}
            >
              <Text
                style={[
                  styles.buttonTextModal,
                  isITSelected ? styles.selectedTextButton : null,
                ]}
              >
                IT
              </Text>
            </TouchableOpacity>

            {/* Button to select the language "EN" */}
            <TouchableOpacity
              style={[
                styles.buttonModal,
                isENSelected ? styles.selectedButton : null,
              ]}
              onPress={() => handleLanguageChange("EN")}
            >
              <Text
                style={[
                  styles.buttonTextModal,
                  isENSelected ? styles.selectedTextButton : null,
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  initialLetter: {
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: 500,
  },
  buttonModal: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 10,
    width: 100,
    alignItems: "center",
  },
  selectedTextButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextModal: {
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedButton: {
    backgroundColor: "#8386f5",
  },
});

export default ModalLanguage;
