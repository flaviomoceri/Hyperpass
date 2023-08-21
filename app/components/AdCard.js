import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AdCard = () => {
  const handlePress = () => {
    Linking.openURL("https://holepunch.to/");
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient
        colors={["#18191f", "#0e3452"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.adCard}
      >
        <View style={styles.content}>
          <Text style={styles.adText}>Powered by</Text>
          <Image
            source={require("../assets/holepunch.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adCard: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  adText: {
    color: "#d3d3d3",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
});

export default AdCard;
