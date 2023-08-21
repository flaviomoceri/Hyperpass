import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Linking,
} from "react-native";

const generateRandomPassword = () => {
  const length = Math.floor(Math.random() * 6) + 10; // Random length between 10 and 15 characters
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&$?!";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};

const ModalPass = ({
  modalVisible,
  setModalVisible,
  showPassword,
  togglePasswordVisibility,
  handleImageUpload,
  selectedImage,
  title,
  setTitle,
  username,
  setUsername,
  password,
  setPassword,
  note,
  setNote,
  link,
  setLink,
  handleCopyUsername,
  copyUsername,
  handleCopyPassword,
  copyPassword,
  handleCopyNote,
  copyNote,
  handleAddPassword,
}) => {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [textRequired, setTextRequired] = useState(false);
  const [userNameRequired, setUsernameRequired] = useState(false);

  const handleGeneratePassword = () => {
    const generatedPwd = generateRandomPassword();
    setPassword(generatedPwd);
    setGeneratedPassword(generatedPwd);
  };

  const handlePress = () => {
    const validExtensions = [".com", ".it", ".ch", ".to", ".io", ".ai"];
    const hasValidExtension = validExtensions.some((ext) => link.endsWith(ext));
    if (!hasValidExtension) {
      link = `https://www.google.com/search?q=${encodeURIComponent(link)}`;
    } else if (!link.startsWith("http://") && !link.startsWith("https://")) {
      //If it starts with neither, add "https://" to the link
      link = "https://" + link;
    }

    // Opens the browser with the specified URL when the user presses the card
    Linking.openURL(link);
  };

  useEffect(() => {
    if (title.trim() !== "") {
      setTextRequired(false); // If the field is not empty, it hides the writing "*Required"
    }
    if (username.trim() !== "") {
      setUsernameRequired(false);
    }
  }, [title, username]);

  const handleSavePassword = () => {
    // Check if both the "Site/App Name" and "Email or Username" fields are empty
    if (title.trim() === "" && username.trim() === "") {
      setTextRequired(true);
      setUsernameRequired(true);
      return;
    }

    if (title.trim() === "") {
      setTextRequired(true);
      return;
    }
    setTextRequired(false);

    if (username.trim() === "") {
      setUsernameRequired(true);
      return;
    }
    setUsernameRequired(false);

    // If both fields are filled in correctly, execute the handleAddPassword function
    handleAddPassword();
  };

  const ShowModalVisible = () => {
    setUsernameRequired(false);
    setTextRequired(false);
    setModalVisible(!modalVisible);
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
        <ScrollView
          style={styles.modalView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.buttonCloseModal}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={ShowModalVisible}
            >
              <Image
                source={require("../assets/icons/left-arrow.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.closeLabel}>
            <Text style={styles.closeLabelText}>Manage password</Text>
          </View>
          {selectedImage ? (
            <TouchableWithoutFeedback>
              <Image style={styles.image} source={{ uri: selectedImage }} />
            </TouchableWithoutFeedback>
          ) : (
            ""
          )}
          <View
            style={[
              title ? "" : styles.cardModalTitle,
              selectedImage ? { marginTop: 10 } : { marginTop: 80 },
            ]}
          >
            <TextInput
              style={[
                title ? styles.inputTitleModal : styles.inputTitleModalDefault,
              ]}
              placeholder={title ? "" : "Site/App Name"}
              value={title}
              onChangeText={setTitle}
            />
            {textRequired && (
              <Text style={styles.requiredText}>* Required</Text>
            )}
          </View>
          <View style={styles.cardModalLink}>
            <TextInput
              style={styles.inputTitleModalDefault}
              placeholder="Link"
              value={link}
              onChangeText={(textLink) =>
                setLink(textLink.replace(/\s/g, "").toLowerCase())
              }
            />
            <TouchableOpacity
              onPress={handlePress}
              style={styles.linkIconContainer}
            >
              <Image
                source={require("../assets/icons/link.png")}
                style={styles.linkIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardModal}>
            <View style={styles.sectionModal}>
              <TextInput
                style={styles.inputModal}
                placeholder="Email or username"
                keyboardType="email-address"
                value={username}
                onChangeText={(textUsername) => setUsername(textUsername)}
              />
              {userNameRequired && (
                <Text style={styles.requiredText}>* Required</Text>
              )}
              <TouchableOpacity
                onPress={handleCopyUsername}
                style={styles.copyIconContainer}
              >
                {!copyUsername ? (
                  <Image
                    source={require("../assets/icons/copy-color.png")}
                    style={styles.copyIcon}
                  />
                ) : (
                  <Image
                    source={require("../assets/icons/confirm.png")}
                    style={styles.copyIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.sectionModal}>
              <TextInput
                style={styles.inputModal}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(textPassword) => setPassword(textPassword)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
              >
                <Image
                  source={
                    showPassword
                      ? require("../assets/icons/eye-close.png")
                      : require("../assets/icons/eye.png")
                  }
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.copyIconContainer}
                onPress={handleCopyPassword}
              >
                {!copyPassword ? (
                  <Image
                    source={require("../assets/icons/copy-color.png")}
                    style={styles.copyIcon}
                  />
                ) : (
                  <Image
                    source={require("../assets/icons/confirm.png")}
                    style={styles.copyIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.sectionModal}>
              <TextInput
                style={styles.inputModal}
                placeholder="Note"
                multiline
                value={note}
                onChangeText={(textNote) => setNote(textNote)}
              />
              <TouchableOpacity
                style={styles.copyIconContainer}
                onPress={handleCopyNote}
              >
                {!copyNote ? (
                  <Image
                    source={require("../assets/icons/copy-color.png")}
                    style={styles.copyIcon}
                  />
                ) : (
                  <Image
                    source={require("../assets/icons/confirm.png")}
                    style={styles.copyIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.containerSaveRandom}>
            <TouchableOpacity
              onPress={handleGeneratePassword}
              style={[styles.buttonModalGenerate, { marginRight: 15 }]}
            >
              <Text style={styles.buttonTextModalGenerate}>
                Generate password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSavePassword}
              style={[styles.buttonModal, { marginLeft: 15 }]}
            >
              <Text style={styles.buttonTextModal}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={selectedImage ? { height: 250 } : ""}></View>
        </ScrollView>
      </View>
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
    padding: 25,
    height: 1000,
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
  button: {
    borderRadius: 20,
    elevation: 2,
    backgroundColor: "#8386f5",
  },
  buttonClose: {
    padding: 10,
  },
  iconCamera: {
    width: 25,
    height: 25,
  },
  icon: {
    width: 22,
    height: 22,
  },
  buttonCloseModal: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  image: {
    backgroundColor: "transparent",
    borderRadius: 20,
    width: "35%",
    height: "15%",
    marginTop: 65,
    marginBottom: 10,
  },
  cardModal: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  cardModalTitle: {
    marginTop: 70,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
  },
  cardModalTitleWithImage: {
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
  },
  cardModalLink: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
  },
  sectionModal: {
    marginBottom: 20,
  },
  closeLabel: {
    position: "absolute",
    top: 6,
    left: 60,
  },
  closeLabelText: {
    fontSize: 20,
    fontWeight: 700,
  },
  inputModal: {
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    padding: 10,
    width: 300,
  },
  inputTitleModalDefault: {
    borderRadius: 5,
    padding: 10,
    width: 300,
  },
  inputTitleModal: {
    padding: 10,
    width: 300,
    textAlign: "center",
    fontSize: 28,
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
  linkIconContainer: {
    position: "absolute",
    top: 20,
    right: 30,
  },
  linkIcon: {
    width: 20,
    height: 20,
  },
  copyIcon: {
    width: 22,
    height: 22,
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
    marginTop: 90,
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 100,
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
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default ModalPass;
