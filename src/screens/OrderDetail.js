import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";
const OrderDetail = ({navigation,route}) => {
  const [data, setData] = useState();
  console.log(route.params);
  useEffect(() => {
    const loadDataOrder = async () => {
      const user_info_json = await AsyncStorage.getItem("user_info");
      const user_info =
        user_info_json != null
          ? JSON.parse(user_info_json)
          : {           
              id: "001"           
            };
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        console.log(`https://bmosapplication.azurewebsites.net/odata/orders/order(${route.params.orderId})/customer(${user_info.id})`);
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/orders/order(${route.params.orderId})/customer(${user_info.id})`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(res.data);
        setData(res.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    loadDataOrder();
    
  },[]);
  return (
    <View>
            <View style={{marginBottom:30, marginTop:20}}>
        <Ionicons
          name="arrow-back-outline"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        </View>
      <Text>Order Detail</Text>

      {data && <>
        <Card>
            <Card.Content>
            <Text>ID: {data.id}</Text> 
              <Text
              >
                {`${format(new Date(data.orderedDate), 'dd/MM/yyyy')}`}
              </Text>
              <Text>Status: {data.orderStatus}</Text>
              <Text>Total: {data.total} VNĐ</Text>
              <Text>Status: </Text>
            </Card.Content>
          </Card>  
        <Text>List Meals:</Text>
          <FlatList
        data={data.orderDetails}
        keyExtractor={(item) => item.orderID}
        style={{marginTop:30}}
        renderItem={({ item }) => (
          <Card
            style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}      
          >
            <Card.Content>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {item.meal.title}
              </Text>
              <Text>{item.meal.quantity}</Text>            
              <Text>Single price: {item.meal.price} </Text>
              <Text>Total: {item.unitPrices} VNĐ</Text>
            </Card.Content>
          </Card>
        )}
      /> 

     <Text>Order Log</Text>
      <FlatList
        data={data.orderTransactions}
        keyExtractor={(item) => item.id}
        style={{marginTop:30}}
        renderItem={({ item }) => (
          <Card
            style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}      
          >
            <Card.Content>
              <Text>
               Log time: {`${format(new Date(item.paymentTime), 'dd/MM/yyyy')}`}
              </Text>            
              <Text>Status: {item.status}</Text>
            </Card.Content>
          </Card>
        )}
      />
      </>}
         
    </View>
  );
};

export default OrderDetail;
