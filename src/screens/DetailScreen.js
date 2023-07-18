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
  useWindowDimensions,
} from "react-native";
import { Button, Chip } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import HTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";

const DetailsScreen = ({ navigation, route }) => {
  const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
  const [cartData, setCartData] = useState([]);
  const [dataFetch, setDataFetch] = useState();
  const [contentWidth, setContentWidth] = useState(0);
  const windowWidth = useWindowDimensions().width;
  useEffect(() => {
    setContentWidth(windowWidth);
  }, [windowWidth]);
  const data = route.params;
  useEffect(() => {
    const fetchListMealsActive = async () => {
      try { 
        const data = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/Meals/Active/Meal/${route.params}`
        );
        setDataFetch(data.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    const getFromStorage = async () => {
      const data = await AsyncStorage.getItem("cart");
      setCartData(data != null ? JSON.parse(data) : []);
      };
    fetchListMealsActive();
    getFromStorage();
  }, []);

  const setDataToStorage = async () => {
    let list = [];
    if (cartData.length === 0) {
      list.push({
        id: dataFetch.id,
        title: dataFetch.title,
        price: dataFetch.price,
        mealImages: dataFetch.mealImages[0].source,
        quantity: 1,
      });
      await AsyncStorage.setItem("cart", JSON.stringify(list));
      return;
    } else {

      const foundItem = cartData.find((item) => item.id === dataFetch.id);
      if (foundItem) {  
        foundItem.quantity += 1;
        list = [
            ...cartData,
          ];
      }
      else{
        list = [
            ...cartData,
            {
              id: dataFetch.id,
              title: dataFetch.title,
              price: dataFetch.price,
              mealImages: dataFetch.mealImages[0].source,
              quantity: 1
            },
          ];
      }
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
              color="black"
            />
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
          <ScrollView style={styles.detailContainer}>
            <View style={styles.detailHeader}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}
            >
              {dataFetch.title}
            </Text>
            <Chip
              style={{ width: 200 }}
              icon="cash-multiple"
              onPress={() => console.log("Pressed")}
            >
              Price: {dataFetch.price} VNĐ
            </Chip>
            <Text
              style={{ fontSize: 20, fontWeight: 500, marginTop: 20 }}
            >
              Meal description:
            </Text>
            <View style={{width: 340}}>
              <HTML
                baseStyle={{ fontSize: "18px", fontWeight: 700}}
                contentWidth={contentWidth}
                source={{ html: dataFetch.description }}
                
              />
              </View>
            </View>                     
            <View
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              // style={{ height: 300 }}
              contentInsetAdjustmentBehavior="automatic"
            >
              <View style={styles.aboutContainer}>
                <FlatList
                  data={dataFetch.productMeals}
                  style={{marginBottom: 20}}
                  scrollEnabled={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", item.product.id)}>
                      <View
                        style={{
                          borderWidth: 1,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          marginBottom: 10,
                          borderRadius: 15,
                        }}
                      >
                        <Image
                          style={{
                            // width: "100%",
                            resizeMode: "cover",
                            height: 100,
                            width: 100,
                            alignItems: "center",
                            borderRadius: 10,
                            shadowColor: "black",
                            shadowRadius: 3,
                            shadowOpacity: 0.8,
                            shadowOffset: { width: 0, height: 0 },
                          }}
                          source={{ uri: item.product.productImages[0].source }}
                        />
                        <View
                          style={{
                            flexDirection: "column",
                            marginLeft: 20,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ marginTop: 5, fontSize: 15, width: 200 }}>
                            {item.product.name}
                          </Text>
                          <Text style={{ marginTop: 5, fontSize: 15 }}>
                            Price: {item.product.price} VNĐ/1kg
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
              {/* </View> */}
            </View>
           
          </ScrollView>
          <Button
              mode="contained-tonal"
              style={{ borderRadius: 20, margin: 20 }}
              buttonColor="#F7DC6F"
              onPress={changeFavorite}
              icon="cart-plus"
            >
              Add to cart
            </Button>
        </>
      )}
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.lightOrange,
    backgroundColor: "#52BE80"
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
    borderRadius: 20,
    // borderTopRightRadius: 20,
    marginTop: 15,
  },
  detailHeader: {
    // marginTop: 14,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 20,
    marginLeft: 20,
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
