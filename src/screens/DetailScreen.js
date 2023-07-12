import { StyleSheet, Text, View, Image, Animated, TouchableWithoutFeedback, ScrollView, FlatList, } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons, MaterialCommunityIcons, AntDesign, } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsScreen = ({ navigation, route }) => {
    const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
    const [favData, setFavData] = useState([]);
    const data = route.params;

    useEffect(() => {
        getFromStorage();
    }, []);

    const getFromStorage = async () => {
        const data = await AsyncStorage.getItem("favorite");
        setFavData(data != null ? JSON.parse(data) : []);
    };

    const setDataToStorage = async () => {
        let list;
        if (favData == []) {
            list = [data.id];
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back-outline"
                    size={30}
                    color="black"
                    onPress={() => navigation.goBack()}
                />
                <TouchableWithoutFeedback onPress={changeFavorite}>
                    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
                        {favData.includes(data.id) ? (
                            <MaterialCommunityIcons
                                name="cards-heart"
                                size={38}
                                color="#ff007f"
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="cards-heart-outline"
                                size={38}
                                color="grey"
                            />
                        )}
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.imageContainer}>
                <Image style={styles.imageItem} source={{ uri: data.imageUrl }} />
            </View>
            <View style={styles.detailContainer}>
                <View style={styles.detailHeader}>
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: "bold",
                            flex: 4,
                            marginLeft: 20,
                        }}
                    >
                        {data.name}
                    </Text>
                    <View style={styles.startTag}>
                        <AntDesign
                            style={styles.iconStar}
                            name="star"
                            size={14}
                            color="#fff700"
                        />
                        <Text
                            style={{
                                marginLeft: 10,
                                color: COLORS.white,
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
                            {data.rating}
                        </Text>
                    </View>
                </View>
                <ScrollView
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ height: 300 }}
                    contentInsetAdjustmentBehavior="automatic"
                >
                    <View style={{ flex: 1 }}>
                        <View style={styles.aboutContainer}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Material</Text>
                            <FlatList
                                data={data.material}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => (
                                    <Text style={{ color: "grey", marginTop: 5, fontSize: 15 }}>
                                        {index + 1} : {item}
                                    </Text>
                                )}
                            />
                        </View>
                        <View style={styles.aboutContainer}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cooking Steps</Text>
                            <FlatList
                                data={data.cookStep}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => (
                                    <Text style={{ color: "grey", marginTop: 5, fontSize: 15 }}>
                                        {index + 1} - {item}
                                    </Text>
                                )}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightOrange,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 10,
    },
    imageContainer: {
        flex: 0.35,
        marginTop: 14,
        marginHorizontal: 40,
        borderRadius: 15,
        overflow: "hidden",
    },
    imageItem: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
    },
    detailContainer: {
        flex: 0.7,
        backgroundColor: COLORS.light,
        marginHorizontal: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 15,
    },
    detailHeader: {
        marginTop: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    startTag: {
        flex: 1,
        backgroundColor: COLORS.green,
        width: 80,
        height: 40,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    aboutContainer: { marginTop: 15, paddingHorizontal: 20 },
    headerIcon: {
        overflow: "hidden",
        padding: 13,
        borderRadius: 30,
        backgroundColor: "#d8dfff",
        justifyContent: "center",
        alignItems: "center",
    },
});
