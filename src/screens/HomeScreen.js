import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image } from "react-native";
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
  const [dataProducts, setDataProducts] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    getFromStorage();
    const fetchListMealsActive = async () => {
      try {
        const data = await axios.get(
          "https://bmosapplication.azurewebsites.net/odata/Meals/Active/Meal"
        );
        setDataFetch(data.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    const fetchListProductsActive = async () => {
      try {
        const data = await axios.get(
          "https://bmosapplication.azurewebsites.net/odata/Products/Active/Product"
        );
        setDataProducts(data.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchListMealsActive();
    fetchListProductsActive();
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
      <View>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 90, height: 90 }}
          /></View>
        <Text
          style={{ fontSize: 40, fontWeight: "bold", color: COLORS.orange }}
        >
          BMOS
        </Text>
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
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
        <TouchableOpacity>
        <Text
          style={{
            backgroundColor: "#012A4A",
            height: 40,
            width: 150,
            borderRadius: 15,
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 20,
            fontWeight: 500,
            color:"#fff"
          }}
        >
          Meals
        </Text>
        </TouchableOpacity>
        <TouchableOpacity>
        <Text
          style={{
            backgroundColor: "#012A4A",
            height: 40,
            width: 150,
            borderRadius: 15,
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 20,
            fontWeight: 500,
            color:"#fff"
          }}
        >
          Products
        </Text>
        </TouchableOpacity>
      </View>
      {dataFetch && (
        <FlatList
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          style={{marginTop: 15}}
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
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // backgroundColor: COLORS.lightOrange,
    backgroundColor: "#CAF0F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems:"center",
    marginLeft: 60
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
