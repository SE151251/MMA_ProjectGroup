import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import HTML from "react-native-render-html";
import COLORS from "../constants/colors";
const width = Dimensions.get("screen").width / 2 - 30;

const FavoriteItem = ({ data, navigation, removeDataFromStorage }) => {
  const [contentWidth, setContentWidth] = useState(0);
  const windowWidth = useWindowDimensions().width;
  useEffect(() => {
    // Cập nhật giá trị contentWidth khi windowWidth thay đổi
    setContentWidth(windowWidth);
  }, [windowWidth]);
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Details", data.id)}>
      <View style={styles.rootContainer}>
        <Image
          style={styles.imageItem}
          resizeMode="cover"
          source={{ uri: data.mealImages }}
        />
        <View style={styles.textContainer}>
          <HTML
            baseStyle={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            contentWidth={contentWidth}
            source={{ html: data.title }}
          />
          <Text style={styles.text}>Single priece: {data.price} VNĐ</Text>
          <Text style={styles.text}>Quantity: {data.quantity}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => removeDataFromStorage(data.id)}
        >
          <FontAwesome
            name="remove"
            size={35}
            color="#ff007f"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteItem;

const styles = StyleSheet.create({
  rootContainer: {
    height: 250,
    backgroundColor: COLORS.light,
    marginHorizontal: 2,
    borderRadius: 10,
    marginVertical: 20,
    // overflow: "hidden",
    width: 350,
  },
  imageItem: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.75,
  },
  textContainer: {
    position: "absolute",
    height: 100,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // justifyContent: "flex-start",
    // alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    //textAlign: "center",
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
