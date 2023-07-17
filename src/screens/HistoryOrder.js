import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";
const HistoryOrder = ({navigation}) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused()
  useEffect(() => {
    const loadDataOrder = async () => {
      const user_info_json = await AsyncStorage.getItem("user_info");
      const user_info =
        user_info_json != null
          ? JSON.parse(user_info_json)
          : {           
              id: "001",
            isLogin: false
            };
         if(user_info.isLogin === false){
          setData()
          return navigation.navigate("LoginScreen")
         }   
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/orders/customer/${user_info.id}`,
          {
            //If post or put
            //.......
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData(res.data.reverse());
      } catch (error) {
        console.error("API error:", error);
      }
    };
    if(isFocused){
    loadDataOrder();
    }
  },[isFocused]);
  return (
    <View>
      <Text>HistoryOrder</Text>
    {data &&
    <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <Card
        style={{
          paddingBottom: 10,
          paddingTop: 10,
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 20,
        }}
        onPress={() => {
          navigation.navigate("OrderDetail", {        
           orderId: item.id
          });
        }}
      >
        <Card.Content>
          <Text
            style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
          >
            Order ID: {item.id}
          </Text>
          <Text>{`${format(new Date(item.orderedDate), 'dd/MM/yyyy')}`}</Text>
          <Text>Total: {item.total} VNĐ</Text>
          {item.orderStatus === 0 && <Text>Status: New Order</Text>}
          {item.orderStatus === 1 && <Text>Status: Processing</Text>}
          {item.orderStatus === 2 && <Text>Status: Done</Text>}
          {item.orderStatus === 3 && <Text>Status: Canceled</Text>}            
        </Card.Content>
      </Card>
    )}
  />
    } 
    </View>
  );
};

export default HistoryOrder;
