import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [cartData, setCartData] = useState([]);
    const [dataFetch, setDataFetch] = useState();
    const isFocused = useIsFocused();

    useEffect(() => {
        getFromStorage();
        const fetchListMealsActive = async () => {
            try {
                const data = await axios.get('https://bmosapplication.azurewebsites.net/odata/Meals/Active/Meal')                              
                setDataFetch(data.data)                                     
            } catch (error) {
               console.log(error.response.data); 
            }
           
        };
        fetchListMealsActive()
      
    }, [isFocused]);

    const getFromStorage = async () => {
    const data = await AsyncStorage.getItem("cart");
    setCartData(data != null ? JSON.parse(data) : []);
    };

    const changeSearch = (query) => {
        setSearchQuery(query);
        // console.log(searchQuery);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 40, fontWeight: "bold", color: COLORS.orange, }}>BMOS</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="black" />
                    <TextInput
                        placeholder="Search"
                        style={styles.textInput}
                        onChangeText={changeSearch}
                    />
                </View>
            </View>
            {dataFetch && <FlatList
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                numColumns={2}
                data={dataFetch.filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                renderItem={({ item }) => (
                    <Card
                        navigation={navigation}
                        data={item}                       
                        cartData={cartData}
                        setCartData={setCartData}
                    />
                )}
            />
        }
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        // backgroundColor: COLORS.lightOrange,
        backgroundColor: "#52BE80"
        
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
    },
    searchContainer: {
        flexDirection: "row",
        marginTop: 12,
    },
    searchBox: {
        height: 50,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    textInput: {
        marginLeft: 15,
        flex: 1,
        fontWeight: "bold",
    },
});