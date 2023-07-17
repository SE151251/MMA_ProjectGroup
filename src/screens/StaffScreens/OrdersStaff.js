import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";
const DashboardStaff = ({navigation}) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused()
  useEffect(() => {
    const loadDashboardAPI = async () => {
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/Orders?$expand=Customer($expand=Account)`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData(res.data.value);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    if(isFocused){
    loadDashboardAPI();
    }
  },[isFocused]);
  return (
    <View>
      <Text>List orders</Text>
    {data &&
   
   <FlatList
   data={data.reverse()}
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
         navigation.navigate("OrderDetailStaff", {        
          orderId: item.ID,
          userId: item.Customer.Account.ID
         });
       }}
     >
       <Card.Content>
       <Text style={{  fontSize: 20, fontWeight: 700 }}>
          Customer Name: {item.Customer.FullName}
         </Text>
         <Text>
          Email: {item.Customer.Account.Email}
         </Text>
         <Text>
          OrderID: {item.ID}
         </Text>
         <Text>Order Time: {`${format(new Date(item.OrderedDate), 'dd/MM/yyyy')}`}</Text>
         <Text>Total: {item.Total} VNĐ</Text>
         {item.OrderStatus === 0 && <Text>Status: New Order</Text>}
          {item.OrderStatus === 1 && <Text>Status: Processing</Text>}
          {item.OrderStatus === 2 && <Text>Status: Done</Text>}
          {item.OrderStatus === 3 && <Text>Status: Canceled</Text>}        
       </Card.Content>
     </Card>
   )}
 />}
    </View>
  );
};

export default DashboardStaff;
