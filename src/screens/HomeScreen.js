import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import Card from "../components/Card";
import { useIsFocused } from "@react-navigation/native";
import { CATEGORIES } from "../../database/categories";
import { RECIPES } from "../../database/recipes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const HomeScreen = ({ navigation }) => {
    const [recipes, SetRecipe] = useState(RECIPES);
    const [categoryIndex, setCategoryIndex] = useState(CATEGORIES[0].id);
    const [searchQuery, setSearchQuery] = useState("");
    const [favData, setFavData] = useState([]);
    const [dataFetch, setDataFetch] = useState();
    const isFocused = useIsFocused();

    useEffect(() => {
        //getFromStorage();
        const fetchListMealsActive = async () => {
            try {
                const data = await axios.get("https://bmosapplication.azurewebsites.net/odata/Meals/Active/Meal")
                // console.log(data.data[0].description);
                setDataFetch(data.data)
                // const newdata = JSON.parse(data)                       
            } catch (error) {
               console.log(error.response.data); 
            }
           
        };
    fetchListMealsActive()
    }, [isFocused]);

    const updateFavData = (list) => {
        setFavData(list);
    };

    const getFromStorage = async () => {
        const data = await AsyncStorage.getItem("favorite");
        setFavData(data != null ? JSON.parse(data) : []);
    };

    const selectCategory = (categoryIndex) => {
        setCategoryIndex(categoryIndex);
        if (categoryIndex == "c0") {
            SetRecipe(RECIPES)
        } else {
            SetRecipe(RECIPES.filter((item) => item.categoryId === categoryIndex));
        }
    };

    const changeSearch = (query) => {
        setSearchQuery(query);
        console.log(searchQuery);
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

            {/* <CategoryList
                categories={CATEGORIES}
                categoryIndex={categoryIndex}
                setCategoryIndex={selectCategory}
            /> */}
            {dataFetch && <FlatList
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                numColumns={2}
                data={dataFetch.filter((item) =>
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                renderItem={({ item }) => (
                    <Card
                        navigation={navigation}
                        data={item}
                        dataFetch={dataFetch}
                        favData={favData}
                        setFavData={setFavData}
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
        backgroundColor: COLORS.lightOrange,
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