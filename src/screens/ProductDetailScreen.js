import {
  Ionicons
} from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import HTML from 'react-native-render-html';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Chip } from "react-native-paper";
  
  const ProductDetailScreen = ({ navigation, route }) => {
    const [dataFetch, setDataFetch] = useState();
    const [contentWidth, setContentWidth] = useState(0);
    const windowWidth = useWindowDimensions().width;
    useEffect(() => {
      // Cập nhật giá trị contentWidth khi windowWidth thay đổi
      setContentWidth(windowWidth);
    }, [windowWidth]);
    const data = route.params;
    useEffect(() => {
      const fetchListMealsActive = async () => {
        try {
          const data = await axios.get(
            `https://bmosapplication.azurewebsites.net/odata/Products/Active/Product/${route.params}`
          );
          setDataFetch(data.data);
          // const newdata = JSON.parse(data)
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchListMealsActive();
    }, []);
  
    return (
      <SafeAreaView style={styles.container}>
     
        <View style={styles.header}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
        </View>
        {dataFetch && (
          <>
            <View style={styles.imageContainer}>
              <Image
                style={styles.imageItem}
                source={{ uri: dataFetch.productImages[0].source }}
              />
            </View>
            <View style={styles.detailContainer}>              
            <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    // flex: 4,
                    marginTop: 20,
                    marginBottom: 20,
                    textAlign:"center"
                  }}
                >
                 {dataFetch.name}
                </Text>
                <Chip
              style={{ width: 200, marginLeft: 20 }}
              icon="cash-multiple"
              onPress={() => console.log("Pressed")}
            >
              Price: {dataFetch.price} VNĐ/1 kg
            </Chip>
              <View style={styles.detailHeader}>
              <Text style={{fontSize:24, fontWeight: 700}}>Product Detail</Text>
                   <HTML baseStyle={{fontSize:"16px"}} contentWidth={contentWidth} source={{ html: dataFetch.description }} />
              </View>
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
  