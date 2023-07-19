import { View, Text, FlatList, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Chip } from "react-native-paper";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import  Toast  from "react-native-toast-message";
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
        console.log("API error:", error);
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
      Toast.show({
        type: "success",
        text1: "Message",
        text2: "Cancel order successfully",
      });
      return;
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Message",
        text2: "Cancel order failed!",
      });
    }
  };
  return (
    <ScrollView style={{ backgroundColor: "#CAF0F8" }}>
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
          color: "#03045E"
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
                  <Text
                    // icon="new-box"
                    // mode="outlined"
                    style={{ backgroundColor: "#133c55", width: 100, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                  >
                    New Order
                  </Text>
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
                  <Text
                    // icon="dots-horizontal"
                    // mode="outlined"
                    style={{ backgroundColor: "#540b0e", width: 90, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                  >
                    Processing
                  </Text>
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
                  <Text
                    // icon="checkbox-marked"
                    // mode="outlined"
                    style={{ backgroundColor: "#3f37c9", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                  >
                    Done
                  </Text>
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
                  <Text
                    // icon="cancel"
                    // mode="outlined"
                    style={{ backgroundColor: "#d90429", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                  >
                    Cancel
                  </Text>
                </View>
              )}

              {data.orderStatus === 0 && (
                <Button
                  icon="trash-can"
                  mode="contained"
                  onPress={() => handleCancelOrder(data.id)}
                  style={{ margin: 20, backgroundColor: "#d90429", marginHorizontal: 100 }}
                >
                  Cancel
                </Button>
              )}
            </Card.Content>
          </Card>
          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 700, color: "#03045E" }}>
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

          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 700, color: "#03045E" }}>
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
                      <Text
                        // icon="new-box"
                        // mode="outlined"
                        style={{ backgroundColor: "#133c55", width: 100, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                      >
                        New Order
                      </Text>
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
                      <Text
                        // icon="dots-horizontal"
                        // mode="outlined"
                        style={{ backgroundColor: "#540b0e", width: 90, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                      >
                        Processing
                      </Text>
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
                      <Text
                        // icon="checkbox-marked"
                        // mode="outlined"
                        style={{ backgroundColor: "#3f37c9", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                      >
                        Done
                      </Text>
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
                      <Text
                        // icon="cancel"
                        // mode="outlined"
                        style={{ backgroundColor: "#d90429", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                      >
                        Cancel
                      </Text>
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
