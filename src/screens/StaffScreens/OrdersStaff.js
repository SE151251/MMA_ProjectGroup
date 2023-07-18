import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Chip } from "react-native-paper";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
const DashboardStaff = ({ navigation }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
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
    if (isFocused) {
      loadDashboardAPI();
    }
  }, [isFocused]);
  return (
    <View style={{backgroundColor:"#52BE80"}}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 20,
          marginTop: 30,
        }}
      >
        List Orders
      </Text>
      {data && (
        <FlatList
          data={data.reverse().slice(0, 20)}
          keyExtractor={(item) => item.ID}
          style={{marginBottom: 100}}
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
                  userId: item.Customer.Account.ID,
                });
              }}
            >
              <Card.Content>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>
                  Customer Name: {item.Customer.FullName}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>
                  Email: {item.Customer.Account.Email}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>
                  OrderID: {item.ID}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>
                  Order Time:{" "}
                  {`${format(new Date(item.OrderedDate), "dd/MM/yyyy")}`}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>
                  Total: {item.Total} VNĐ
                </Text>
                {item.OrderStatus === 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>
                      Status:{" "}
                    </Text>
                    <Chip
                      icon="new-box"
                      mode="outlined"
                      style={{ backgroundColor: "#F9E79F", width: 130 }}
                    >
                      New Order
                    </Chip>
                  </View>
                )}
                {item.OrderStatus === 1 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>
                      Status:{" "}
                    </Text>
                    <Chip
                      icon="dots-horizontal"
                      mode="outlined"
                      style={{ backgroundColor: "#5DADE2", width: 120 }}
                    >
                      Processing
                    </Chip>
                  </View>
                )}
                {item.OrderStatus === 2 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>
                      Status:{" "}
                    </Text>
                    <Chip
                      icon="checkbox-marked"
                      mode="outlined"
                      style={{ backgroundColor: "#2ECC71", width: 80 }}
                    >
                      Done
                    </Chip>
                  </View>
                )}
                {item.OrderStatus === 3 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>
                      Status:{" "}
                    </Text>
                    <Chip
                      icon="cancel"
                      mode="outlined"
                      style={{ backgroundColor: "#EC7063", width: 90 }}
                    >
                      Cancel
                    </Chip>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default DashboardStaff;
