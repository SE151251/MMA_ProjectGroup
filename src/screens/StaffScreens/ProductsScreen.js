import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "react-native-paper";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { Alert } from "react-native";
import  Toast  from "react-native-toast-message";

const ProductScreen = ({ navigation }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  const loadProductsAPI = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    try {
      const res = await axios.get(
        `https://bmosapplication.azurewebsites.net/odata/Products`,
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
  useEffect(() => {
    if (isFocused) {
      loadProductsAPI();
    }
  }, [isFocused]);
  const handleDeleteUser = async (id) => {
    Alert.alert("Are you sure?", "You really want to delete this Product?", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          deleteUser(id);
        },
      },
    ]);
  };

  const deleteUser = async (id) => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      const res = await axios.delete(
        `https://bmosapplication.azurewebsites.net/odata/Products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(res.data);
      loadDashboardAPI();
      Toast.show({
        type: "success",
        text1: "Message",
        text2: "Delete product successfully",
      });
    } catch (error) {
      console.log(error.response.data);
      Toast.show({
        type: "error",
        text1: "Message",
        text2: "Delete product failed!",
      });
    }
  };
  return (
    <View style={{ backgroundColor: "#CAF0F8" }}>
     {/* <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 30,
          marginTop: 30,
          color: "#03045E",
        }}
      >
        List Products
      </Text> */}
      {data && (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.ID}
            style={{marginBottom: 20, marginTop: 20}}
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
                <Card.Cover source={{ uri: item.ProductImages[0].Source }} />
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 10 }}>Product ID: {item.ID}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Name: {item.Name}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Original Price: {item.OriginalPrice} VNĐ</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Price: {item.Price} VNĐ</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500 , marginBottom: 5}}>Total: {item.Total}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                    Status: {item.Status === 1 ? "Active" : "InActive"}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
                  ExpiredDate:{" "}
                    {`${format(new Date(item.ExpiredDate), "dd/MM/yyyy")}`}
                  </Text>
                  {/* <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
                    Status:{" "}
                    {item.Account.Status === true ? "Active" : "InActive"}
                  </Text> */}
                 <View style={{flexDirection: 'row', justifyContent:"space-around"}}>
                 <Button
                      icon="pencil"
                      mode="contained"
                      onPress={() => console.log("Press update")}
                    //   style={{ backgroundColor:"#ef476f"}}
                    >
                      Update
                    </Button>
                 {item.Status === 1 && (
                    <Button
                      icon="trash-can-outline"
                      mode="contained"
                      onPress={() => handleDeleteUser(item.ID)}
                      style={{ backgroundColor:"#ef476f"}}
                    >
                      Delete
                    </Button>
                  )}                
                 </View>
                  
                </Card.Content>
              </Card>
            )}
          />
        </>
      )}
    </View>
  );
};

export default ProductScreen;
