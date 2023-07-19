import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";
import HTML from "react-native-render-html";
import COLORS from "../constants/colors";
  
  const width = Dimensions.get("screen").width / 2 - 30;
  
  const Card = ({ data, navigation }) => {
    const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
    const [contentWidth, setContentWidth] = useState(0);
    const windowWidth = useWindowDimensions().width;
    useEffect(() => {
      // Cập nhật giá trị contentWidth khi windowWidth thay đổi
      setContentWidth(windowWidth);
    }, [windowWidth]);
  
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", data.id)}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageItem}
              source={{ uri: data.productImages[0].source }}
            />
          </View>
          <HTML baseStyle={{height: 59, paddingTop: 5,}} contentWidth={contentWidth} source={{ html: data.name }} />
          <Text style={styles.time} numberOfLines={1}>
            Price: {data.price} VNĐ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  export default Card;
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.lightGray,
      width,
      height:220,
      marginHorizontal: 2,
      borderRadius: 10,
      marginVertical: 10,
      padding: 15,
      shadowColor: "black",
      shadowRadius: 4,
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 5 },
    },
    imageContainer: {
      width: "100%",
      height: 110,
      alignItems: "center",
      borderRadius: 20,
      shadowColor: "black",
      shadowRadius: 3,
      shadowOpacity: 0.8,
      shadowOffset: { width: 0, height: 0 },
    },
    imageItem: {
      flex: 1,
      resizeMode: "cover",
      width: "100%",
      borderRadius: 20,
    },
    nameItem: {
      fontWeight: "bold",
      marginTop: 5,
      fontSize: 18,
      color: COLORS.greenTeal,
      justifyContent: "center",
    },
    time: {
      fontSize: 14,
      color: COLORS.brown,
      fontWeight: "500",
      marginTop: 2,
      textAlign:"center"
    },
    infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.green,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 20,
    },
    iconStar: {
      marginRight: 5,
    },
    ratingText: {
      color: "white",
      fontSize: 15,
      fontWeight: "500",
    },
  });
  