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

const ManageStaff = ({ navigation }) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  const loadDashboardAPI = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    try {
      const res = await axios.get(
        `https://bmosapplication.azurewebsites.net/odata/Staffs?$expand=Account`,
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
      loadDashboardAPI();
    }
  }, [isFocused]);
  const handleDeleteUser = async (id) => {
    Alert.alert("Are you sure?", "You really want to delete this Staff?", [
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
        `https://bmosapplication.azurewebsites.net/odata/Staffs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
     console.log(res.data);
      loadDashboardAPI();
      Toast.show({
        type: "success",
        text1: "Message",
        text2: "Delete Staff successfully",
      });
    } catch (error) {
      console.log(error.response.data);
      Toast.show({
        type: "error",
        text1: "Message",
        text2: "Delete Staff failed!",
      });
    }
  };
  return (
    <View style={{ backgroundColor: "#CAF0F8" }}>
     <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 30,
          marginTop: 30,
          color: "#03045E",
        }}
      >
        Manage Staffs
      </Text>
      {data && (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.AccountID}
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
              >
                <Card.Content>
                <Card.Cover source={{ uri: item.Avatar }} />
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5, marginTop: 10 }}>Account ID: {item.AccountID}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>FullName: {item.FullName}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Email: {item.Account.Email}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Address: {item.Address}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500 , marginBottom: 5}}>Phone: {item.Phone}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500 , marginBottom: 5}}>Identity Number: {item.IdentityNumber}</Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                    Gender: {item.Gender === true ? "Male" : "Female"}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                    Birt Date:{" "}
                    {`${format(new Date(item.BirthDate), "dd/MM/yyyy")}`}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                  Registered Date:{" "}
                    {`${format(new Date(item.RegisteredDate), "dd/MM/yyyy")}`}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
                    Status:{" "}
                    {item.Account.Status === true ? "Active" : "InActive"}
                  </Text>
                  {item.Account.Status === true && (
                    <Button
                      icon="trash-can-outline"
                      mode="contained"
                      onPress={() => handleDeleteUser(item.AccountID)}
                      style={{ backgroundColor:"#ef476f", marginHorizontal: 90}}
                    >
                      Delete Staff
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

export default ManageStaff;
