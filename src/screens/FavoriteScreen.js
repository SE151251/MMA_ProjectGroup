import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, ScrollView, Image } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavoriteItem from "../components/FavoriteItem";
import { Button, Card } from 'react-native-paper';
const FavoriteScreen = ({ navigation }) => {
  const [favData, setFavData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showClearAll, setShowClearAll] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused===true)
    getFromStorage();
  }, [isFocused]);

  const getFromStorage = async () => {
    const storageData = await AsyncStorage.getItem("cart");
    setFavData(storageData != null ? JSON.parse(storageData) : []);
    console.log("cart: ",JSON.parse(storageData));
    const dataParse = JSON.parse(storageData)
    let totalPriceInCart = 0;
    if(dataParse){
      for(let i = 0; i < dataParse.length; i++){
        totalPriceInCart = totalPriceInCart + (dataParse[i].price * dataParse[i].quantity)
      }
    }
    
    console.log(totalPriceInCart);
    setTotalPrice(totalPriceInCart)
    setShowClearAll(storageData != null && JSON.parse(storageData).length > 1);
  };

  const removeAllStorage = async () => {
    Alert.alert("Are you sure?", "You really want to remove all your meals in cart?", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          AsyncStorage.clear();
          setFavData([]);
          setShowClearAll(false);
        },
      },
    ]);
  };

  const removeDataFromStorage = async (id) => {
    const list = favData.filter((item) => item.id !== id);
    await AsyncStorage.setItem("cart", JSON.stringify(list));
    setFavData(list);
    setShowClearAll(list.length > 1);
  };

  return (
    <ScrollView style={styles.container}>
      {favData.length !== 0 ? (
        <View>
          <View style={styles.textHeaderContainer}>
            <Text style={styles.textHeader}>Favorite Collection</Text>
          </View>

          {showClearAll && (
            <View style={styles.clearContainer}>
              <TouchableOpacity style={styles.innerClearContainer} onPress={removeAllStorage}>
                <Ionicons name="trash" size={25} color="grey" />
                <Text style={{ fontWeight: "bold", marginTop: 5, marginLeft: 5, color: "grey" }}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.cardContainer}>
            <FlatList
              data={favData}
              showsVerticalScrollIndicator={false}
              // columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              // numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <FavoriteItem navigation={navigation} data={item} removeDataFromStorage={removeDataFromStorage} />
              )}
            />
          </View>
          <Card style={{paddingBottom: 10, paddingTop: 10, marginBottom: 20}}>
    <Card.Content>
      <Text style={{textAlign:"center", fontSize:24, fontWeight:700}}>Overview</Text>
      <Text>Total Meal: {favData.length}</Text>
      <Text>Total Price: {totalPrice} VNĐ</Text>
    </Card.Content>
  </Card>
  <Button icon="cart-check" mode="contained" onPress={() => console.log('Pressed')}>
    Checkout
  </Button>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={require("../../assets/images/empty-box.png")} style={{ width: 250, height: 250 }}/>
          <Text style={styles.textEmpty}>Your cart is empty</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightOrange,
  },
  clearContainer: {
    marginHorizontal: 20,
  },
  innerClearContainer: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  textHeaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  textHeader: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.orange,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  emptyContainer: {
    height: 550,
    justifyContent: "center",
    alignItems: "center",
  },
  textEmpty: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.greenTeal,
  },
});
