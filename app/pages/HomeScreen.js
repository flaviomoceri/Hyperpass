import React, { useState, useEffect } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import SearchBar from "../components/SearchBar";
import ImagePicker from "react-native-image-crop-picker";
import * as Clipboard from "expo-clipboard";
import ModalPass from "../components/ModalPass";
import UploadButton from "../components/UploadButton";
import ShowPasswords from "../components/ShowPasswords";
import AdCard from "../components/AdCard";

const HomeScreen = ({
  passwordItems,
  setPasswordItems,
  setPasswordsChanged,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isNewPassword, setIsNewPassword] = useState(true);
  const [copyUsername, setCopyUsername] = useState(false);
  const [copyPassword, setCopyPassword] = useState(false);
  const [copyNote, setCopyNote] = useState(false);
  const [searchText, setSearchText] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
  };

  const handleCopyUsername = async () => {
    await Clipboard.setStringAsync(username);
    setCopyUsername(!copyUsername);
    setTimeout(() => {
      setCopyUsername(false);
    }, 500);
  };
  const handleCopyPassword = async () => {
    await Clipboard.setStringAsync(password);
    setCopyPassword(!copyPassword);
    setTimeout(() => {
      setCopyPassword(false);
    }, 500);
  };
  const handleCopyNote = async () => {
    await Clipboard.setStringAsync(note);
    setCopyNote(!copyNote);
    setTimeout(() => {
      setCopyNote(false);
    }, 500);
  };

  const handleAddPassword = () => {
    Keyboard.dismiss();
    if (isNewPassword) {
      // Creating a new item
      setPasswordsChanged(true);
      const newId = Object.keys(passwordItems).length + 1;
      const newPasswordItem = {
        title: title,
        username: username,
        password: password,
        note: note,
        link: link,
        image: selectedImage,
      };

      setPasswordItems((prevPasswordItems) => ({
        ...prevPasswordItems,
        [newId]: newPasswordItem,
      }));
    } else {
      // Editing an existing item
      setPasswordItems((prevPasswordItems) => {
        const updatedPasswords = { ...prevPasswordItems };
        setPasswordsChanged(true);
        updatedPasswords[selectedItemIndex] = {
          title: title,
          username: username,
          password: password,
          note: note,
          link: link,
          image: selectedImage,
        };
        return updatedPasswords;
      });
    }

    setPassword("");
    setTitle("");
    setUsername("");
    setNote("");
    setLink("");
    setSelectedImage(null);
    setModalVisible(false);
    setIsNewPassword(true);
  };

  const handleAddNewPassword = () => {
    setIsNewPassword(true);
    setTitle("");
    setUsername("");
    setPassword("");
    setNote("");
    setLink("");
    setSelectedImage(null);
    setModalVisible(true);
  };

  const handleEditPassword = (index) => {
    setSelectedItemIndex(index);
    setTitle(passwordItems[index].title);
    setUsername(passwordItems[index].username);
    setPassword(passwordItems[index].password);
    setNote(passwordItems[index].note);
    setLink(passwordItems[index].link);
    setSelectedImage(passwordItems[index].image);
    setModalVisible(true);
    setIsNewPassword(false);
  };

  const completePassword = (index) => {
    const updatedPasswordItems = { ...passwordItems };
    delete updatedPasswordItems[index];

    // Recompute the indices of the remaining elements
    const updatedPasswordItemsWithUpdatedIndices = {};
    let newIndex = 1;
    for (const key in updatedPasswordItems) {
      updatedPasswordItemsWithUpdatedIndices[newIndex] =
        updatedPasswordItems[key];
      newIndex++;
    }
    setPasswordItems(updatedPasswordItemsWithUpdatedIndices);
  };

  const handleImageUpload = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      setSelectedImage(image.path);
    });
  };

  useEffect(() => {
    const supportedDomains = [".com", ".it", ".ch", ".to", ".io", ".ai"];
    const isSupportedDomain = supportedDomains.some((domain) =>
      link.endsWith(domain)
    );
    if (isSupportedDomain) {
      const url = `https://besticon-demo.herokuapp.com/allicons.json?url=${link}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const icons = data.icons;

          if (icons && icons.length > 0) {
            const iconsUrl = icons[0].url;
            setSelectedImage(iconsUrl);
          } else {
            console.log("No URLs found");
            setSelectedImage(null);
          }
        })
        .catch((error) => {
          console.error("Error making API request:", error);
          setSelectedImage(null);
        });
    } else {
      setSelectedImage(null);
    }
  }, [link]);

  return (
    <View style={styles.container}>
      {/* Modal add password */}
      <ModalPass
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        handleImageUpload={handleImageUpload}
        selectedImage={selectedImage}
        title={title}
        setTitle={setTitle}
        username={username}
        link={link}
        setLink={setLink}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        note={note}
        setNote={setNote}
        handleCopyUsername={handleCopyUsername}
        copyUsername={copyUsername}
        handleCopyPassword={handleCopyPassword}
        copyPassword={copyPassword}
        handleCopyNote={handleCopyNote}
        copyNote={copyNote}
        handleAddPassword={handleAddPassword}
      />

      {/* Password Lists */}
      <View style={styles.passwordsWrapper}>
        <Text style={styles.sectionTitle}>Your Passwords</Text>
        {/* Added search bar */}
        <SearchBar onSearch={handleSearch} />
        <AdCard />
        <View style={styles.items}>
          {/* This is where the passwords will go */}
          <ShowPasswords
            passwordItems={passwordItems}
            searchText={searchText}
            handleEditPassword={handleEditPassword}
            completePassword={completePassword}
            onPress={handleAddNewPassword}
            setPasswordsChanged={setPasswordsChanged}
          />
        </View>
      </View>

      {/* Upload a password*/}
      <UploadButton onPress={handleAddNewPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  passwordsWrapper: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  deleteButton: {
    position: "absolute",
    right: 15,
    top: 28,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writePasswordWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addText: {
    color: "#FFF",
    fontSize: 35,
    marginTop: 4,
  },
  modalView: {
    backgroundColor: "#E8EAED",
    borderRadius: 20,
    padding: 25,
    height: "100%",
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
  buttonClose: {
    padding: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
    fontWeight: 600,
    marginTop: 20,
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
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 20,
  },
  sectionModal: {
    marginBottom: 20,
  },
  inputModal: {
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    padding: 10,
    width: 300,
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
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: "100%",
  },
  buttonTextModal: {
    color: "white",
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
});

export default HomeScreen;
