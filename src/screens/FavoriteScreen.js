import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, ScrollView, Image } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavoriteItem from "../components/FavoriteItem";
import { Button, Card } from 'react-native-paper';
import  Toast  from 'react-native-toast-message';
import axios from "axios";

const FavoriteScreen = ({ navigation }) => {
  const [favData, setFavData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalMeal, setTotalMeal] = useState(0);
  const [showClearAll, setShowClearAll] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused===true)
    getFromStorage();
  }, [isFocused]);

  const getFromStorage = async () => {
    const storageData = await AsyncStorage.getItem("cart");
    setFavData(storageData != null ? JSON.parse(storageData) : []);
    const dataParse = JSON.parse(storageData)
    let totalPriceInCart = 0;
    let totalMealInCart = 0
    if(dataParse){
      for(let i = 0; i < dataParse.length; i++){
        totalPriceInCart = totalPriceInCart + (dataParse[i].price * dataParse[i].quantity)
        totalMealInCart = totalMealInCart + dataParse[i].quantity
      }
    }  
    setTotalPrice(totalPriceInCart)
    setTotalMeal(totalMealInCart)
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
   const updateQuantityCart = async (type, id) => {
    let list = [];
      const foundItem = favData.find((item) => item.id === id);
      if(type === "Plus"){
        foundItem.quantity += 1;
      }
      else if(type==="Minus"){
        if(foundItem.quantity === 1 ){
       
        }else{
          foundItem.quantity -= 1;
        }    
      }
        list = [
            ...favData
          ];
     
      await AsyncStorage.setItem("cart", JSON.stringify(list));
      setFavData(list)
    
   }
  const removeDataFromStorage = async (id) => {
    const list = favData.filter((item) => item.id !== id);
    await AsyncStorage.setItem("cart", JSON.stringify(list));
    setFavData(list);
    setShowClearAll(list.length > 1);
  };
  const hanldeCheckout = async () => {
    try {
      const user_info_json = await AsyncStorage.getItem("user_info");
      const user_info =
        user_info_json != null
          ? JSON.parse(user_info_json)
          : {           
            id: "001",
            email:"",
            isLogin: false
            };
         if(user_info.isLogin === false){     
          return navigation.navigate("LoginScreen")
         }   
      const dataCheckout = favData.map((d)=>({
        id: d.id,
        amount: d.quantity
      }))
      // const user_info_json = await AsyncStorage.getItem("user_info");
      // const user_info =
      //   user_info_json != null
      //     ? JSON.parse(user_info_json)
      //     : {           
      //         email: "error get email from async storage",           
      //       };
        if(user_info.email==="error get email from async storage"){
          Toast.show({
            type: 'error',
            text1: 'Error before call API',
            text2: 'Cannot get user info from async storage'
          });
          return
        } 
        const access_token = await AsyncStorage.getItem("access_token");
      const res = await axios.post(`https://bmosapplication.azurewebsites.net/odata/Orders`,{
        email: user_info.email ,
        meals: dataCheckout
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      console.log(res.data);
      Toast.show({
        type: 'success',
        text1: 'Message',
        text2: 'Checkout successfully'
      });
      await AsyncStorage.clear()
      navigation.navigate("Home")
    } catch (error) {
      console.log(error.response.data);
    }     
    
  }
  return (
    <ScrollView style={styles.container}>
      {favData.length !== 0 ? (
        <View>
          <View style={styles.textHeaderContainer}>
            <Text style={styles.textHeader}>Your Cart</Text>
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
                <FavoriteItem navigation={navigation} data={item} removeDataFromStorage={removeDataFromStorage}
                updateQuantityCart={updateQuantityCart}
                />
              )}
            />
          </View>
          <Card style={{paddingBottom: 10, paddingTop: 10, marginBottom: 20, marginLeft:20, marginRight:20}}>
    <Card.Content>
      <Text style={{textAlign:"center", fontSize:24, fontWeight:700}}>Overview</Text>
      <Text>Total Type Meal: {favData.length}</Text>
      <Text>Total Meal: {totalMeal}</Text>
      <Text>Total Price: {totalPrice} VNĐ</Text>
    </Card.Content>
  </Card>
  <Button icon="cart-check" mode="contained" onPress={() => hanldeCheckout()} style={{position:"relative", bottom: 0}}>
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
