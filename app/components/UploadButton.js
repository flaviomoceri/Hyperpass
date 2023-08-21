import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
} from "react-native";

const UploadButton = ({ onPress }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.writePasswordWrapper}
    >
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={styles.addWrapper}>
          <Text style={styles.addText}>+</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    elevation: 2,
    backgroundColor: "#8386f5",
  },
  addWrapper: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: "center",
    position: "absolute",
    right: 30,
    bottom: -30,
    backgroundColor: "#8386f5",
  },
  addText: {
    color: "#FFF",
    fontSize: 35,
    marginTop: 4,
  },
  writePasswordWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default UploadButton;
