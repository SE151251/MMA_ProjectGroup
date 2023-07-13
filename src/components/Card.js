import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Animated, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import COLORS from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HTML from 'react-native-render-html';
import { FontAwesome5 } from '@expo/vector-icons'; 


const width = Dimensions.get("screen").width / 2 - 30;

const Card = ({ data, navigation, favData, setFavData, dataFetch }) => {
    const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
    const [contentWidth, setContentWidth] = useState(0);
  const windowWidth = useWindowDimensions().width;
  useEffect(() => {
    // Cập nhật giá trị contentWidth khi windowWidth thay đổi
    setContentWidth(windowWidth);
  }, [windowWidth]);

    const setDataToStorage = async () => {
        let list;
        if (favData == []) {
            list = [data.id];
            console.log("list :",list);
            await AsyncStorage.setItem("favorite", JSON.stringify(list));
        } else {
            list = [...favData, data.id];
            await AsyncStorage.setItem("favorite", JSON.stringify(list));
        }
        setFavData(list);
    };

    const removeDataFromStorage = async () => {
        const list = favData.filter((item) => item !== data.id);
        await AsyncStorage.setItem("favorite", JSON.stringify(list));
        setFavData(list);
    };

    const changeFavorite = () => {
        Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        if (favData.includes(data.id)) {
            removeDataFromStorage();
        } else {
            setDataToStorage();
        }
    };

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Details", data.id)}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.imageItem} source={{ uri: data.mealImages[0].source }} />
                </View>
                {/* <Text numberOfLines={1} style={styles.nameItem}>
                    {data.description}
                </Text> */}
                
                <HTML contentWidth={contentWidth} source={{ html: data.description }} />
                <Text style={styles.time} numberOfLines={1}>
                   {data.price} VNĐ
                </Text>
                <View style={styles.infoContainer}>
                    <TouchableWithoutFeedback onPress={changeFavorite}>
                        <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
                        <FontAwesome5 
                        style={[styles.iconStar, { marginLeft: 2.5 }]} 
                        name="cart-plus" 
                        size={24} 
                        color="black" />
                            {/* {favData.includes(data.id) ? (
                                <AntDesign
                                    style={[styles.iconStar, { marginLeft: 2.5 }]}
                                    name="heart"
                                    size={22}
                                    color="#ff007f"
                                />
                            ) : (
                                <AntDesign
                                    style={[styles.iconStar, { marginLeft: 2.5 }]}
                                    name="hearto"
                                    size={22}
                                    color="#ff007f"
                                />
                            )} */}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <View style={styles.ratingContainer}>
                        <AntDesign
                            style={styles.iconStar}
                            name="star"
                            size={14}
                            color="#fff700"
                        />
                        <Text style={styles.ratingText}>{data.status}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default Card;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.lightGray,
        width,
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
        fontSize: 12,
        color: COLORS.brown,
        fontWeight: "500",
        marginTop: 2,
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
