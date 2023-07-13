import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableWithoutFeedback,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Button,
    useWindowDimensions
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import COLORS from "../constants/colors";
  import {
    Ionicons,
    MaterialCommunityIcons,
    AntDesign,
  } from "@expo/vector-icons";
  import HTML from 'react-native-render-html';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useIsFocused } from "@react-navigation/native";
  import { FontAwesome5 } from '@expo/vector-icons'; 
  import axios from "axios";
  
  const ProductDetailScreen = ({ navigation, route }) => {
    const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
    const [cartData, setCartData] = useState([]);
    const [dataFetch, setDataFetch] = useState();
    const [contentWidth, setContentWidth] = useState(0);
    const windowWidth = useWindowDimensions().width;
    useEffect(() => {
      // Cập nhật giá trị contentWidth khi windowWidth thay đổi
      setContentWidth(windowWidth);
    }, [windowWidth]);
    const data = route.params;
    const getFromStorage = async () => {
        const data = await AsyncStorage.getItem("cart");
        setCartData(data != null ? JSON.parse(data) : []);
        };
    useEffect(() => {
      const fetchListMealsActive = async () => {
        try {
          const data = await axios.get(
            `https://bmosapplication.azurewebsites.net/odata/Meals/Active/Meal/${route.params}`
          );
          setDataFetch(data.data);
          // const newdata = JSON.parse(data)
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchListMealsActive();
      getFromStorage();
    }, []);
  
  
    const setDataToStorage = async () => {
        let list = [];
        if (cartData.length === 0) {
            console.log("k có item");
          list.push({
            id: dataFetch.id,
            description: dataFetch.description,
            price: dataFetch.price,
            mealImages: dataFetch.mealImages[0].source,
            quantity: 1,
          });
          console.log("list new:", list);
          await AsyncStorage.setItem("cart", JSON.stringify(list));
          return;
        } else {
            console.log("có item");
          const foundItem = cartData.find((item) => item.id === dataFetch.id);
          if (foundItem) {  
            foundItem.quantity += 1;
            list = [
                ...cartData,
              ];
              console.log("list update quantity:", list);   
          }
          else{
            list = [
                ...cartData,
                {
                  id: dataFetch.id,
                  description: dataFetch.description,
                  price: dataFetch.price,
                  mealImages: dataFetch.mealImages[0].source,
                  quantity: 1
                },
              ];
          }
          console.log("list update new: ", list);
          await AsyncStorage.setItem("cart", JSON.stringify(list));
        }
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
        setDataToStorage();
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
                    <FontAwesome5 
                          style={{ marginLeft: 2.5, marginRight: 5 }} 
                          name="cart-plus" 
                          size={24} 
                          color="black" />
                      </Animated.View>
                  </TouchableWithoutFeedback>
        </View>
        {dataFetch && (
          <>
            <View style={styles.imageContainer}>
              <Image
                style={styles.imageItem}
                source={{ uri: dataFetch.mealImages[0].source }}
              />
            </View>
            <View style={styles.detailContainer}>
              <View style={styles.detailHeader}>
                {/* <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    flex: 4,
                    marginLeft: 20,
                    textAlign:"center"
                  }}
                > */}
                   <HTML baseStyle={{fontSize:"18px", fontWeight:700}} contentWidth={contentWidth} source={{ html: dataFetch.description }} />
                {/* </Text> */}
                {/* <View style={styles.startTag}>
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
                    {dataFetch.status}
                  </Text>
                </View> */}
              </View>
              <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    flex: 4,
                    marginLeft: 20,
                  }}
                >
                  Price: {dataFetch.price} VNĐ
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign:"center" }}>
                      Products in meal 
                    </Text>
              <ScrollView
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ height: 250 }}
                contentInsetAdjustmentBehavior="automatic"
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.aboutContainer}>               
                    <FlatList
                      data={data.material}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <Text
                          style={{ color: "grey", marginTop: 5, fontSize: 15 }}
                        >
                          {index + 1} : {item}
                        </Text>
                      )}
                    />
                  </View>
                  <View style={styles.aboutContainer}>
                    {/* <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      Products in Meal
                    </Text> */}
                    <FlatList
                      data={dataFetch.productMeals}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity  onPress={() =>(console.log("press"))}>
                        <View style={{
                          borderWidth: 1,
                          paddingHorizontal: 10,
                           paddingVertical: 10,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          marginBottom:10,
                          borderRadius: 15
                        }}>
                           <Image
                            style={{
                              // width: "100%",
                              resizeMode:"cover",
                              height: 100,
                              width:100,
                              alignItems: "center",
                              borderRadius: 10,
                              shadowColor: "black",
                              shadowRadius: 3,
                              shadowOpacity: 0.8,
                              shadowOffset: { width: 0, height: 0 },
                            }}
                            source={{ uri: item.product.productImages[0].source }}
                          />
                          <View style={{flexDirection:"column", marginLeft:20, justifyContent:"center"}}>
                          <Text
                            style={{ color: "grey", marginTop: 5, fontSize: 15 }}
                          >
                            {item.product.name}
                          </Text>
                          <Text
                            style={{ color: "grey", marginTop: 5, fontSize: 15 }}
                          >
                            Price: {item.product.price}/1kg
                          </Text> 
                          </View>                   
                        </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </ScrollView>
              <Button title="Add to cart" onPress={()=>(console.log("add to cart"))} />
            </View>
          </>
        )}
      </SafeAreaView>
    );
  };
  
  export default ProductDetailScreen;
  
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
      // marginTop: 14,
      // flexDirection: "row",
      // justifyContent: "space-between",
      // alignItems: "center",
      marginTop: 20,
      marginLeft:20
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
  