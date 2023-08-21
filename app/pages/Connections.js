import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

const Connections = ({
  handlePeer,
  peerInput,
  setPeerInput,
  showModalPeer,
  setShowModalPeer,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.peerBar}>
        <TextInput
          style={styles.input}
          placeholder="Insert public key..."
          value={peerInput}
          onChangeText={setPeerInput}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePeer}>
        <View style={styles.addWrapper}>
          <Text style={styles.addText}>+</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.chartContainer}>
        <View style={styles.nodeContainer}>
          <View style={[styles.node, { backgroundColor: "gray" }]}>
            <Text style={styles.nodeText}>Me</Text>
          </View>
          <View style={styles.link} />
          <View style={[styles.node, { backgroundColor: "#8386f5" }]}>
            <Text style={styles.nodeText}>Hyperpass</Text>
          </View>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={showModalPeer}
        onRequestClose={() => setShowModalPeer(false)}
      >
        <View style={styles.overlayStyle}>
          <TouchableWithoutFeedback onPress={() => setShowModalPeer(false)}>
            <Image
              source={require("../assets/icons/close.png")}
              resizeMode="contain"
              style={styles.closeIcon}
            />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Image
                style={styles.image}
                source={require("../assets/icons/launch.gif")}
              />
              <Text style={styles.mainModalText}>Public key added</Text>
              <Text style={styles.modalText}>
                This feature will be implemented soon
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  closeIcon: {
    position: "absolute",
    top: 70,
    right: 35,
    width: 20,
    zIndex: 2,
  },
  nodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  link: {
    width: 60,
    height: 2,
    backgroundColor: "gray",
  },
  nodeText: {
    color: "white",
    fontSize: 12,
  },
  chartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginLeft: 25,
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#8386f5",
    position: "absolute",
    top: 60,
    right: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addWrapper: {
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: -30,
    backgroundColor: "#8386f5",
  },
  addText: {
    color: "#FFF",
    fontSize: 35,
  },
  peerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f0eff4",
    borderRadius: 20,
    width: "82%",
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  buttonSearchBar: {
    position: "absolute",
    right: 20,
  },
  overlayStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
  mainModalText: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 22,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});

export default Connections;
