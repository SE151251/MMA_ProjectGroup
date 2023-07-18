import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Text } from 'react-native-paper';
const DepositMoney = ({navigation}) => {
  const [amount, setAmount] = useState(0);

  const handleSubmit = async () => {
    try {
        const user_info_json = await AsyncStorage.getItem("user_info");
        const user_info =
          user_info_json != null
            ? JSON.parse(user_info_json)
            : {           
                id: "001"           
              };
      const access_token = await AsyncStorage.getItem("access_token");
      const data = await axios.post(`https://bmosapplication.azurewebsites.net/odata/WalletTransactions`,
      { 
        email: user_info.email,
        amount: amount,
       redirectUrl: "https://momo.vn/"
    }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    navigation.navigate("ShowPageMomo",{
      url: data.data.PayUrl
    })
    } catch (error) {
      console.log(error.response)
      if(error.response && error.response.data){
        console.error(error.response.data.Message[0].DescriptionError[0]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text 
      style={{textAlign:"center", fontSize:24, fontWeight: 900,
    marginBottom: 30
    }}
      >Deposit money to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your Money to deposit"
        keyboardType="number-pad"
        autoCapitalize="none"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <View style={{marginTop: 20}}>
      <Button  title="Back to your wallet" onPress={()=>navigation.navigate('WalletCustomer')} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor:"#AED6F1"
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8
  },
});

export default DepositMoney;
