import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { format } from 'date-fns';
const HistoryOrder = ({navigation}) => {
  const [data, setData] = useState();
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
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/orders/customer/${user_info.id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("tới");
        setData(res.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    loadDataOrder();
    
  },[]);
  return (
    <View>
      <Text>HistoryOrder</Text>
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
                {item.status}
              </Text>
              <Text>{`${format(new Date(item.orderedDate), 'dd/MM/yyyy')}`}</Text>
              <Text>Total: {item.total} VNĐ</Text>
              <Text>Status: </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

export default HistoryOrder;
