import { View, Text, FlatList, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "react-native-paper";
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
const OrderDetail = ({navigation,route}) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused()
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
    if(isFocused){
      loadDataOrder();
    }
    
    
  },[isFocused]);
  const handleClickButton = (type) => {
    // var typeAlert;
    // if(type === "Processing") typeAlert=`Are you sure?", "You really want to ${type} this order?`
    Alert.alert("Are you sure?", `You really want to ${type} this order?`, [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          handleStatusOrder(type)
        },
      },
    ]);
  }
  const handleStatusOrder = async (type) =>{
    // const user_info_json = await AsyncStorage.getItem("user_info");
    // const user_info =
    //   user_info_json != null
    //     ? JSON.parse(user_info_json)
    //     : {           
    //         id: "001"           
    //       };
    
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      console.log("access token: ", access_token);
      if(type==="Cancel"){    
      const res = await axios.delete(
        `https://bmosapplication.azurewebsites.net/odata/orders/order(${route.params.orderId})/customer(${route.params.userId})/cancel`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      navigation.goBack()
      return
    }
    if(type==="Processing"){  
      const res = await axios.put(
        `https://bmosapplication.azurewebsites.net/odata/orders/update-processing/${route.params.orderId}`,
      {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      navigation.goBack()
      return
    }
    if(type==="Done"){    
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
      navigation.goBack()
      return
    }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View>
            <View style={{marginBottom:20, marginTop: 30}}>
        <Ionicons
          name="arrow-back-outline"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        </View>
      <Text>Order Detail</Text>

      {data && <>
        <Card>
            <Card.Content>
            <Text>Customer Name: {data.Customer.FullName}</Text> 
              <Text
              >
                Phone number: {data.Customer.Phone}
              </Text>
               {/* <Text>Quantity: {data.OrderDetails.Quantity}</Text> */}
              <Text>Address: {data.Customer.Address}</Text>
            </Card.Content>
          </Card>  

        <Card>
            <Card.Content>
            <Text>ID: {data.ID}</Text> 
              <Text
              >
                Order Date: {`${format(new Date(data.OrderedDate), 'dd/MM/yyyy')}`}
              </Text>
               {/* <Text>Quantity: {data.OrderDetails.Quantity}</Text> */}
              <Text>Total: {data.Total} VNĐ</Text>
              {data.OrderStatus === 0 && <Text>Status: New Order</Text>}
              {data.OrderStatus === 1 && <Text>Status: Processing</Text>}
              {data.OrderStatus === 2 && <Text>Status: Done</Text>}
              {data.OrderStatus === 3 && <Text>Status: Canceled</Text>} 
              {data.OrderStatus === 0 && 
              <View>
                <Button onPress={()=>handleClickButton("Processing")}>Confirm to Processing</Button>
                <Button onPress={()=>handleClickButton("Cancel")}>Cancel</Button>
              </View>  
              }
              {data.OrderStatus === 1 && <Button onPress={()=>handleClickButton("Done")}>Confirm to Done</Button>}
            </Card.Content>
          </Card>  
        <Text>List Meals:</Text>
          <FlatList
        data={data.OrderDetails}
        keyExtractor={(item) => item.mealID}
        style={{marginTop:30}}
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
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {item.Meal.Title}
              </Text>         
              <Text>Single price: {item.Meal.Price} </Text>
              <Text>Quantity: {item.Quantity}</Text>
              <Text>Total: {item.UnitPrices} VNĐ</Text>
            </Card.Content>
          </Card>
        )}
      /> 

     <Text>Order Log</Text>
      <FlatList
        data={data.OrderTransactions}
        keyExtractor={(item) => item.ID}
        style={{marginTop:30}}
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
              <Text>
               Log time: {`${format(new Date(item.PaymentTime), 'dd/MM/yyyy')}`}
              </Text>            
              {item.Status === 0 && <Text>Status: New Order</Text>}
          {item.Status === 1 && <Text>Status: Processing</Text>}
          {item.Status === 2 && <Text>Status: Done</Text>}
          {item.Status === 3 && <Text>Status: Canceled</Text>}      
            </Card.Content>
          </Card>
        )}
      />
      </>}
         
    </View>
  );
};

export default OrderDetail;
