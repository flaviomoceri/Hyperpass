import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import Password from "./Password";

const generateRandomColor = () => {
  // Generate a random color in hexadecimal format
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const ShowPasswords = ({
  passwordItems,
  searchText,
  handleEditPassword,
  completePassword,
  onPress,
  setPasswordsChanged,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [selectedItemTitle, setSelectedItemTitle] = useState("");
  const [itemColors, setItemColors] = useState({});

  const openDeleteConfirmationModal = (key, title) => {
    setSelectedItemKey(key);
    setSelectedItemTitle(title);
    setModalVisible(true);
  };

  const handleDeleteConfirmation = () => {
    completePassword(selectedItemKey);
    setModalVisible(false);
    setPasswordsChanged(true);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    // Generate random color only on initial load
    const colors = {};
    Object.keys(passwordItems).forEach((key) => {
      if (!itemColors[key]) {
        colors[key] = generateRandomColor();
      } else {
        colors[key] = itemColors[key];
      }
    });
    setItemColors(colors);
  }, [passwordItems]);

  // Group the items by the initial letter of the title
  const groupedPasswords = {};
  Object.entries(passwordItems).forEach(([key, item]) => {
    const initialLetter = item.title[0].toUpperCase();
    if (!groupedPasswords[initialLetter]) {
      groupedPasswords[initialLetter] = [];
    }
    groupedPasswords[initialLetter].push({ key, item });
  });

  // Sort the keys alphabetically
  const sortedKeys = Object.keys(groupedPasswords).sort();

  // Filter items based on search text
  const filteredItems = sortedKeys.reduce((acc, initialLetter) => {
    const items = groupedPasswords[initialLetter].filter(({ item }) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    if (items.length > 0) {
      acc.push({ initialLetter, items });
    }
    return acc;
  }, []);

  return (
    <View style={{ maxHeight: 450 }}>
      <ScrollView
        contentContainerStyle={{ flex: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>No items found</Text>
            <TouchableOpacity
              style={styles.createPasswordButton}
              onPress={onPress}
            >
              <Text style={styles.createPasswordButtonText}>
                Create your first password
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredItems.map(({ initialLetter, items }) => (
            <View key={initialLetter}>
              <Text style={styles.initialLetter}>{initialLetter}</Text>
              {items.map(({ key, item }) => (
                <View key={key} style={styles.passwordContainer}>
                  <TouchableOpacity onPress={() => handleEditPassword(key)}>
                    <Password
                      textTitle={item.title}
                      textUsername={item.username}
                      textNote={item.note}
                      textPassword={item.password}
                      imageUri={item.image}
                      itemColor={itemColors[key]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => openDeleteConfirmationModal(key, item.title)}
                    style={styles.deleteButton}
                  >
                    <Image
                      source={require("../assets/icons/trash.png")}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
        <View style={{ height: 150 }}></View>
        {/* Deletion confirmation modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to delete "{selectedItemTitle}"?
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
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  createPasswordButton: {
    backgroundColor: "#8386f5",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  icon: {
    width: 22,
    height: 22,
  },
  container: { flex: 1 },
  createPasswordButtonText: {
    color: "white",
    fontSize: 14,
  },
  noItemsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  noItemsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  passwordContainer: {
    marginBottom: 10,
  },
  deleteButton: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonModal: {
    backgroundColor: "#8386f5",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 10,
    width: 100,
    alignItems: "center",
  },
  initialLetter: {
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: 500,
  },
  buttonModalCancel: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 10,
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
});

export default ShowPasswords;
