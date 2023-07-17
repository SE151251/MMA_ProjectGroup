import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "react-native-paper";
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
              id: "001"           
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
        console.error("API error:", error);
      }
    };
    if(isFocused){
      loadDataOrder();
    }     
  },[isFocused]);
  return (
    <View>
      {data && <>
      
      
      <Text style={{textAlign: "center", fontSize:30, fontWeight:700}}>Wallet Screen</Text>
      <Text style={{textAlign: "center", fontSize:30, fontWeight:700}}>Your Balance: {data.Balance}</Text>
      <Button onPress={()=>{
          navigation.navigate("DepositMoney");
        }}>Deposit Money</Button>
      <FlatList
        data={data.WalletTransactions.reverse()}
        keyExtractor={(item) => item.RechargeID}
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
              <Text>
                Recharge time: {`${format(new Date(item.RechargeTime), 'dd/MM/yyyy')}`}
              </Text>
              <Text>Amount: {item.Amount}</Text>
              <Text>Contetn: {item.Content}</Text>
              <Text>Transaction type: {item.TransactionType} </Text>
              {item.RechargeStatus === 1 && <Text>Recharge Status: Successed </Text>}
              {item.RechargeStatus === 2 && <Text>Recharge Status: Failed </Text>}
              {item.RechargeStatus === 0 && <Text>Recharge Status: Pending </Text>}
            </Card.Content>
          </Card>
        )}
      />
      </>}
    </View>
  );
};

export default WalletScreen;
