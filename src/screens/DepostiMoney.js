import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
const DepositMoney = ({navigation}) => {
  const [email, setEmail] = useState(0);
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        const user_info_json = await AsyncStorage.getItem("user_info");
        const user_info =
          user_info_json != null
            ? JSON.parse(user_info_json)
            : {           
                id: "001"           
              };
        const access_token = await AsyncStorage.getItem("access_token");
      console.log('Login submit:', email, password);
      const data = await axios.post(`https://bmosapplication.azurewebsites.net/odata/WalletTransactions`,
      { 
        email: user_info.email,
        amount: email,
       redirectUrl: "https://momo.vn/"
    }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    console.log("zo đây", data.data);
    navigation.navigate("TestRedirect",{
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
      <TextInput
        style={styles.input}
        placeholder="Money"
        keyboardType="number-pad"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Type Agree to deposit"      
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default DepositMoney;
