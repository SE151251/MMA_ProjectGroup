import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, } from "react-native";
import React from "react";
import COLORS from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const width = Dimensions.get("screen").width / 2 - 30;

const FavoriteItem = ({ data, navigation, removeDataFromStorage }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Details", data)}>
            <View style={styles.rootContainer}>
                <Image
                    style={styles.imageItem}
                    resizeMode="cover"
                    source={{ uri: data.imageUrl }}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{data.name}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={removeDataFromStorage.bind(this, data.id)}
                >
                    <MaterialCommunityIcons
                        style={styles.icon}
                        name="cards-heart"
                        size={35}
                        color="#ff007f"
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default FavoriteItem;

const styles = StyleSheet.create({
    rootContainer: {
        height: 150,
        width,
        backgroundColor: COLORS.light,
        marginHorizontal: 2,
        borderRadius: 10,
        marginVertical: 20,
        overflow: "hidden",
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
        height: 50,
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    icon: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});
