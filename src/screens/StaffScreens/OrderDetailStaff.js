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
  console.log(isFocused);
  console.log(route.params);
  useEffect(() => {
    const loadDataOrder = async () => {
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/Orders/${route.params.orderId}?expand=Customer,OrderDetails,OrderTransactions`,
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
  const handleClickButton = (type) => {
    Alert.alert("Are you sure?", `You really want to ${type} this order?`, [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          handleStatusOrder(type);
        },
      },
    ]);
  };
  const handleStatusOrder = async (type) => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      console.log("access token: ", access_token);
      if (type === "Cancel") {
        const res = await axios.delete(
          `https://bmosapplication.azurewebsites.net/odata/orders/order(${route.params.orderId})/customer(${route.params.userId})/cancel`,
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
          text2: "Update order successfully",
        });
        return;
      }
      if (type === "Processing") {
        const res = await axios.put(
          `https://bmosapplication.azurewebsites.net/odata/orders/update-processing/${route.params.orderId}`,
          {},
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
          text2: "Update order successfully",
        });
        return;
      }
      if (type === "Done") {
        console.log(access_token);
        const res = await axios.put(
          `https://bmosapplication.azurewebsites.net/odata/orders/update-done/${route.params.orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("success");
        navigation.goBack();
        Toast.show({
          type: "success",
          text1: "Message",
          text2: "Update order successfully",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Message",
        text2: "Update Failed",
      });
    }
  };
  return (
    <ScrollView style={{ backgroundColor:"#CAF0F8"}}>
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
        }}
      >
        Order Detail
      </Text>

      {data && (
        <>
          <Card style={{ margin: 20 }}>
            <Card.Content>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Customer Name: {data.Customer.FullName}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Phone number: {data.Customer.Phone}
              </Text>
              {/* <Text>Quantity: {data.OrderDetails.Quantity}</Text> */}
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Address: {data.Customer.Address}
              </Text>
            </Card.Content>
          </Card>

          <Card style={{ margin: 20 }}>
            <Card.Content>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Order ID: {data.ID}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Order Date:{" "}
                {`${format(new Date(data.OrderedDate), "dd/MM/yyyy")}`}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                Total: {data.Total} VNĐ
              </Text>
              {data.OrderStatus === 0 && (
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
              {data.OrderStatus === 1 && (
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
              {data.OrderStatus === 2 && (
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
              {data.OrderStatus === 3 && (
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
              {data.OrderStatus === 0 && (
                <View style={{flexDirection:"row", marginTop: 20, marginBottom: 10, justifyContent:"space-around"}}>
                  <Button mode="contained" onPress={() => handleClickButton("Processing")}
                    style={{ backgroundColor:"#0077B6", fontWeight: "bold"}}
                  >
                    Confirm to Processing
                  </Button>
                  <Button mode="contained" onPress={() => handleClickButton("Cancel")}
                    style={{ backgroundColor:"#ef476f", fontWeight: "bold"}}
                  >
                    Cancel
                  </Button>
                </View>
              )}
              {data.OrderStatus === 1 && (
                <View style={{marginBottom: 10, marginTop: 20}}>
                <Button onPress={() => handleClickButton("Done")}
                mode="contained"
                    style={{ backgroundColor:"#03045e", marginHorizontal: 80, fontWeight: "bold"}}>
                  Confirm to Done
                </Button>
                </View>
              )}
            </Card.Content>
          </Card>
          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>
            List Meals
          </Text>
          <FlatList
            data={data.OrderDetails}
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
                      fontSize: 20,
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  >
                    {item.Meal.Title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Single price: {item.Meal.Price}{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Quantity: {item.Quantity}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    Total: {item.UnitPrices} VNĐ
                  </Text>
                </Card.Content>
              </Card>
            )}
          />

          <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>
            Order Logs
          </Text>
          <FlatList
            data={data.OrderTransactions}
            keyExtractor={(item) => item.ID}
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
                    {`${format(new Date(item.PaymentTime), "dd/MM/yyyy")}`}
                  </Text>
                  {item.Status === 0 && (
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
                  {item.Status === 1 && (
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
                  {item.Status === 2 && (
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
                  {item.Status === 3 && (
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
