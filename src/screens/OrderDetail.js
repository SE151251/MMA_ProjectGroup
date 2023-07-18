import { View, Text, FlatList, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Chip } from "react-native-paper";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
const OrderDetail = ({ navigation, route }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  useEffect(() => {
    const loadDataOrder = async () => {
      const user_info_json = await AsyncStorage.getItem("user_info");
      const user_info =
        user_info_json != null
          ? JSON.parse(user_info_json)
          : {
              id: "001",
            };
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/orders/order(${route.params.orderId})/customer(${user_info.id})`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    if (isFocused) {
      loadDataOrder();
    }
  }, [isFocused]);
  const handleCancelOrder = async (orderId) => {
    Alert.alert("Are you sure?", "You really want to cancel this order?", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          cancelOrder(orderId);
        },
      },
    ]);
  };
  const cancelOrder = async (orderId) => {
    const user_info_json = await AsyncStorage.getItem("user_info");
    const user_info =
      user_info_json != null
        ? JSON.parse(user_info_json)
        : {
            id: "001",
          };
    const access_token = await AsyncStorage.getItem("access_token");
    try {
      const res = await axios.delete(
        `https://bmosapplication.azurewebsites.net/odata/orders/order(${orderId})/customer(${user_info.id})/cancel`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      navigation.goBack();
      return;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView style={{ backgroundColor: "#52BE80" }}>
      <View style={{ marginBottom: 20, marginTop: 30 }}>
        <Ionicons
          name="arrow-back-outline"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 20,
          //
        }}
      >
        Order Detail
      </Text>

      {data && (
        <>
          <Card style={{ margin: 20 }}>
            <Card.Content>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                OrderID: {data.id}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Order Date:{" "}
                {`${format(new Date(data.orderedDate), "dd/MM/yyyy")}`}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Total: {data.total} VNĐ
              </Text>
              {/* {data.orderStatus === 0 && <Text>Status: New Order</Text>}
              {data.orderStatus === 1 && <Text>Status: Processing</Text>}
              {data.orderStatus === 2 && <Text>Status: Done</Text>}
              {data.orderStatus === 3 && <Text>Status: Canceled</Text>}  */}
              {data.orderStatus === 0 && (
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
              {data.orderStatus === 1 && (
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
              {data.orderStatus === 2 && (
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
              {data.orderStatus === 3 && (
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

              {data.orderStatus === 0 && (
                <Button
                  icon="cancel"
                  mode="contained-tonal"
                  onPress={() => handleCancelOrder(data.id)}
                  style={{ margin: 20, backgroundColor: "#EC7063" }}
                >
                  Cancel
                </Button>
              )}
            </Card.Content>
          </Card>
          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>
            List Meals
          </Text>
          <FlatList
            data={data.orderDetails}
            keyExtractor={(item) => item.mealID}
            style={{ marginTop: 30 }}
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
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {item.meal.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {item.meal.quantity}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Single price: {item.meal.price} VNĐ
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Quantity: {item.quantity}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Total Price: {item.unitPrices} VNĐ
                  </Text>
                </Card.Content>
              </Card>
            )}
          />

          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>
            Order Logs
          </Text>
          <FlatList
            data={data.orderTransactions}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 30 }}
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
                    style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}
                  >
                    Log time:{" "}
                    {`${format(new Date(item.paymentTime), "dd/MM/yyyy")}`}
                  </Text>
                  {/* <Text>Status: {item.status}</Text> */}
                  {item.status === 0 && (
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
                  {item.status === 1 && (
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
                  {item.status === 2 && (
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
                  {item.status === 3 && (
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
        </>
      )}
    </ScrollView>
  );
};

export default OrderDetail;
