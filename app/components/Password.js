import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native";

const Password = (props) => {
  const imageUri = props.imageUri ? { uri: props.imageUri } : null;
  const textTitle = props.textTitle ? props.textTitle.substring(0, 2) : "";

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        {imageUri ? (
          <Image source={imageUri} style={styles.itemImage} />
        ) : (
          <View
            style={[
              styles.itemImagePlaceholder,
              { backgroundColor: props.itemColor },
            ]}
          >
            <Text style={styles.itemImageText}>{textTitle}</Text>
          </View>
        )}
        <View>
          <Text style={styles.itemText}>{props.textTitle}</Text>
          <Text style={styles.textUsername}>{props.textUsername}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textUsername: {
    color: "#c0bfbf",
    fontSize: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemText: {
    maxWidth: "100%",
    fontSize: 20,
    fontWeight: 500,
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 10,
  },
  itemImagePlaceholder: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImageText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default Password;
