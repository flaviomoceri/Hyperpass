import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";

const AlertWords = ({
  alertWords,
  setAlertWords,
  handleDeleteConfirmation,
  handleDeleteCancel,
}) => {
  return (
    <Modal
      transparent={true}
      visible={alertWords}
      onRequestClose={() => setAlertWords(false)}
    >
      <View style={styles.overlayStyle}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to change your words?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonModalCancel}
                onPress={handleDeleteCancel}
              >
                <Text style={styles.buttonTextModalCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={handleDeleteConfirmation}
              >
                <Text style={styles.buttonTextModal}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  buttonModalCancel: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    width: 100,
    alignItems: "center",
  },
  buttonTextModalCancel: {
    color: "gray",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextModal: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonModal: {
    backgroundColor: "#8386f5",
    borderRadius: 10,
    padding: 12,
    width: 100,
    alignItems: "center",
  },
});

export default AlertWords;
