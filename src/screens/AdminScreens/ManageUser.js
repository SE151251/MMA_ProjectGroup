import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "react-native-paper";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { Alert } from "react-native";

const ManageUser = ({ navigation }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  const loadDashboardAPI = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    try {
      const res = await axios.get(
        `https://bmosapplication.azurewebsites.net/odata/Customers?$expand=Account`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setData(res.data.value);
      console.log(res.data.value[0].Avatar);
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      loadDashboardAPI();
    }
  }, [isFocused]);
  const handleDeleteUser = async (id) => {
    Alert.alert("Are you sure?", "You really want to delete this user?", [
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
      const res = await axios.put(
        `https://bmosapplication.azurewebsites.net/odata/Customers/${id}/Ban`,
        {},
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
        text2: "Delete user successfully",
      });
    } catch (error) {
      console.log(error.response.data);
      Toast.show({
        type: "error",
        text1: "Message",
        text2: "Delete user failed!",
      });
    }
  };
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
                <Card.Cover source={{ uri: item.Avatar }} />
                  <Text>Account ID: {item.AccountID}</Text>
                  <Text>FullName: {item.FullName}</Text>
                  <Text>Address: {item.Address}</Text>
                  <Text>Phone: {item.Phone}</Text>
                  <Text>
                    Gender: {item.Gender === true ? "Male" : "Female"}
                  </Text>
                  <Text>
                    BirthDate:{" "}
                    {`${format(new Date(item.BirthDate), "dd/MM/yyyy")}`}
                  </Text>
                  <Text>
                    Status:{" "}
                    {item.Account.Status === true ? "Active" : "InActive"}
                  </Text>
                  {item.Account.Status === true && (
                    <Button
                      icon="trash-can-outline"
                      mode="contained"
                      onPress={() => handleDeleteUser(item.AccountID)}
                    >
                      Delete user
                    </Button>
                  )}
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
