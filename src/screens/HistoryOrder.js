import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Chip } from "react-native-paper";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
const HistoryOrder = ({ navigation }) => {
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
              isLogin: false,
            };
      if (user_info.isLogin === false) {
        setData();
        return navigation.navigate("LoginScreen");
      }
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/orders/customer/${user_info.id}`,
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
  return (
    <View style={{ backgroundColor: "#CAF0F8" }}>
      <Text
        style={{
          textAlign: "center",
          color: "#03045E",
          fontSize: 30,
          fontWeight: 700,
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        History Orders
      </Text>
      {data && (
        <FlatList
          data={data.reverse()}
          keyExtractor={(item) => item.id}
          style={{marginBottom: 90}}
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
                navigation.navigate("OrderDetail", {
                  orderId: item.id,
                });
              }}
            >
              <Card.Content>
                <Text
                style={{ fontSize: 18, fontWeight: 500 }}
                >
                  Order ID: {item.id}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                  Order Date:{" "}
                  {`${format(new Date(item.orderedDate), "dd/MM/yyyy")}`}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>Total: {item.total} VNĐ</Text>

                {item.orderStatus === 0 && 
                 <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
                 <Text style={{ fontSize: 18, fontWeight: 500 }}>Status: </Text>
                 <Text
                  //  icon="new-box"
                  //  mode="outlined"
                      style={{ backgroundColor: "#133c55", width: 100, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                 >
                   New Order
                 </Text>
               </View>
                }
                {item.orderStatus === 1 &&  <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
                 <Text style={{ fontSize: 18, fontWeight: 500 }}>Status: </Text>
                 <Text
                  //  icon="dots-horizontal"
                  //  mode="outlined"
                    style={{ backgroundColor: "#540b0e", width: 90, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                 >
                   Processing
                 </Text>
               </View>}
                {item.orderStatus === 2 && (
                  <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>Status: </Text>
                    <Text
                      // icon="checkbox-marked"
                      // mode="outlined"
                      style={{ backgroundColor: "#3f37c9", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                    >
                      Done
                    </Text>
                  </View>
                )}
                {item.orderStatus === 3 && 
                 <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
                 <Text style={{ fontSize: 18, fontWeight: 500 }}>Status: </Text>
                 <Text
                  //  icon="cancel"
                  //  mode="outlined"
                      style={{ backgroundColor: "#d90429", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
                 >
                   Cancel
                 </Text>
               </View>
                }
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default HistoryOrder;
