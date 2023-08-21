import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable, Image } from "react-native";

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    onSearch(text);
    setSearchText(text);
  };

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <Pressable
        style={styles.buttonSearchBar}
        onPress={() => handleSearch(searchText)} // Call handleSearch with the current text
      >
        <Image
          source={require("../assets/icons/search.png")}
          resizeMode="contain"
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f0eff4",
    borderRadius: 20,
    marginRight: 5,
  },
  icon: {
    width: 20,
    height: 20,
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
});

export default SearchBar;
