import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import Toast from "react-native-toast-message";

const ListMealsScreen = ({ navigation }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  const loadProductsAPI = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    try {
      const res = await axios.get(
        `https://bmosapplication.azurewebsites.net/odata/Meals`,
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
  const handleDeleteMeal = async (id) => {
    Alert.alert("Are you sure?", "You really want to delete this Meal?", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          deleteMeal(id);
        },
      },
    ]);
  };

  const deleteMeal = async (id) => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      const res = await axios.delete(
        `https://bmosapplication.azurewebsites.net/odata/Meals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(res.data);
      loadProductsAPI()
      Toast.show({
        type: "success",
        text1: "Message",
        text2: "Delete meal successfully",
      });
    } catch (error) {
      console.log(error.response.data);
      Toast.show({
        type: "error",
        text1: "Message",
        text2: "Delete meal failed!",
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
                <Card.Cover source={{ uri: item.MealImages[0].Source }} />
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 10 }}>Meal ID: {item.ID}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Name: {item.Title}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Price: {item.Price} VNĐ</Text>               
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
                    Status: {item.Status === 1 ? "Stocking" : "InActive"}
                  </Text>
                  {/* <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
                  ExpiredDate:{" "}
                    {`${format(new Date(item.ExpiredDate), "dd/MM/yyyy")}`}
                  </Text> */}
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
                      onPress={() => handleDeleteMeal(item.ID)}
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

export default ListMealsScreen;
