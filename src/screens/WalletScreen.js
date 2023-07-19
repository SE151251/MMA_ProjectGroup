import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Chip } from "react-native-paper";
import { format } from 'date-fns';
import { useIsFocused } from "@react-navigation/native";
const WalletScreen = ({navigation}) => {
  const [data, setData] = useState();
  const isFocused = useIsFocused()
  useEffect(() => {
    const loadDataOrder = async () => {
      const user_info_json = await AsyncStorage.getItem("user_info");
      const user_info =
        user_info_json != null
          ? JSON.parse(user_info_json)
          : {           
              id: "001", 
              isLogin: false          
            };
            if(user_info.isLogin === false){
              setData()
              return navigation.navigate("LoginScreen")
             }   
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/Wallets/${user_info.id}?$expand=WalletTransactions`,
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
    if(isFocused){
      loadDataOrder();
    }     
  },[isFocused]);
  return (
    <View style={{ backgroundColor:"#CAF0F8"}}>
      {data && <>
      
      
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginTop: 10, color: "#03045E",}}>Wallet Screen</Text>
        <Text style={{ textAlign: "center", fontSize: 25, fontWeight: 700, color: "#031d44",}}>Your Balance: {data.Balance}</Text>
      <Button icon="cash-multiple" mode="contained" 
          style={{ margin: 20, backgroundColor: "#022b3a", marginHorizontal: 120 }} 
      onPress={()=>{
          navigation.navigate("DepositMoney");
        }}>Deposit Money</Button>
      <FlatList
        data={data.WalletTransactions.reverse().slice(0, 20)}
        keyExtractor={(item) => item.RechargeID}
        style={{marginBottom: 170}}
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
              <Text style={{fontSize: 18, fontWeight: 500}}>
                Recharge time: {`${format(new Date(item.RechargeTime), 'dd/MM/yyyy')}`}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 500}}>Amount: {item.Amount}</Text>
              <Text style={{fontSize: 18, fontWeight: 500}}>Content: {item.Content}</Text>
              <Text style={{fontSize: 18, fontWeight: 500}} >Transaction type: {item.TransactionType} </Text>
              {item.RechargeStatus === 1 && 
               <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
               <Text style={{ fontSize: 18, fontWeight: 500 }}>Recharge Status: </Text>
               <Text
                // icon="checkbox-marked"
                // mode="outlined"
                    style={{ backgroundColor: "#3f37c9", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
               >
                 Successed
               </Text>
             </View>
              }
              {item.RechargeStatus === 2 && 
               <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
               <Text style={{ fontSize: 18, fontWeight: 500 }}>Recharge Status: </Text>
               <Text
              //  icon="cancel"
              //  mode="outlined"
                    style={{ backgroundColor: "#d90429", width: 80, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
               >
                 Failed
               </Text>
             </View>
              }
              {item.RechargeStatus === 0 && 
              <View style={{flexDirection:"row", alignItems:"center", marginTop: 10}}>
              <Text style={{ fontSize: 18, fontWeight: 500 }}>Status: </Text>
              <Chip
                // icon="dots-horizontal"
                // mode="outlined"
                    style={{ backgroundColor: "#540b0e", width: 90, color: '#ffffff', borderRadius: 10, textAlign: "center", padding: 5, fontWeight: "bold" }}
              >
                Pending
              </Chip>
            </View>
              }
            </Card.Content>
          </Card>
        )}
      />
      </>}
    </View>
  );
};

export default WalletScreen;
