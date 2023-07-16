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
          `https://bmosapplication.azurewebsites.net/odata/StaffDashBoards`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData(res.data);
        console.log(res.data);
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
      <Text>Staff Dashboard</Text>
    {data &&
   
      <Card
        style={{
          paddingBottom: 10,
          paddingTop: 10,
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 20,
        }}
        // onPress={() => {
        //   navigation.navigate("", {        
        //    orderId: item.id
        //   });
        // }}
      >
        <Card.Content>
          <Text
            style={{ marginTop: 20 }}
          >
           Product: {data.TotalProducts}
          </Text>

        </Card.Content>
        <Card.Content>
          <Text>Meals: {data.TotalMeals}</Text>
         
        </Card.Content>
        <Card.Content>
         
         
          <Text>Done orders: {data.TotalDoneOrders}</Text>
         
        </Card.Content>
        <Card.Content>
         
          <Text>New orders: {data.TotalNewOrders} </Text>     
         
        </Card.Content>
        <Card>
        <Card.Content>
        
          <Text>Profits In This Month: {data.TotalMonthProfits} </Text>  
        </Card.Content>
        </Card>
      </Card>
    }
    
    </View>
  );
};

export default DashboardStaff;
