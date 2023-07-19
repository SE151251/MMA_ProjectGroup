import { ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
const DashboardStaff = ({ navigation }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
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
    if (isFocused) {
      loadDashboardAPI();
    }
  }, [isFocused]);
  return (
    <ScrollView style={{ backgroundColor: "#CAF0F8" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 30,
          marginTop: 30,
          color:"#03045E"
        }}
      >
        STAFF Dashboard
      </Text>
      {data && (
        <>
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
                Total Products
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalProducts}
              </Text>
            </Card.Content>
          </Card>
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
                Total Meals
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalMeals}
              </Text>
            </Card.Content>
          </Card>
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
                Done orders
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalDoneOrders}
              </Text>
            </Card.Content>
          </Card>
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
                New orders
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalNewOrders}{" "}
              </Text>
            </Card.Content>
          </Card>
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
                Profits In This Month
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalMonthProfits}{" "}
              </Text>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
};

export default DashboardStaff;
