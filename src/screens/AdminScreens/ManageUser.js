import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions } from "react-native";

const ManageUser = ({ navigation }) => {
  const [data, setData] = useState();
  const [totalProfitsMonths, setTotalProfitsMonths] = useState(0);
  const isFocused = useIsFocused();
  const screenWidth = Dimensions.get("window").width;
  useEffect(() => {
    const loadDashboardAPI = async () => {
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/Customers`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData(res.data.value);
        console.log(res.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    if (isFocused) {
      loadDashboardAPI();
    }
  }, [isFocused]);
  
  return (
    <View>
      <Text>Staff Dashboard</Text>
      {data && (
        <>
     <FlatList
    data={data}
    keyExtractor={(item) => item.AccountID}
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
          >
            Account ID: {item.AccountID}
          </Text>
          <Text
          >
            FullName: {item.FullName}
          </Text>       
          <Text
          >
            Address: {item.Address}
          </Text>  
          <Text
          >
            Phone: {item.Phone}
          </Text>  
          <Text
          >
            Gender: {item.Gender}
          </Text>  
          <Text
          >
            BirthDate: {`${format(new Date(item.BirthDate), 'dd/MM/yyyy')}`}
          </Text>  
        </Card.Content>
      </Card>
    )}
  />
        </>
      )}
     
    </View>
  );
};

export default ManageUser;
