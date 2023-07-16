import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
const TestPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Login submit:', email, password);
      const data = await axios.post(`https://bmosapplication.azurewebsites.net/odata/authentications/login`,
      { 
        email: email,
      passwordHash: password
    })
    console.log("zo đây", data.data);
    await AsyncStorage.setItem("access_token", data.data.accessToken)
    await AsyncStorage.setItem("refresh_token", data.data.refreshToken)
    await AsyncStorage.setItem("user_info",JSON.stringify({
      id: data.data.accountId,
      email: data.data.email,
      name: data.data.fullName,
      role: data.data.role
    }))
    if(data.data.role === "Customer") {
      console.log("zo");   
      navigation.navigate("Home")
      return
    }
    if(data.data.role === "Staff"){
      navigation.navigate("StaffHome")
      return
    }
    if(data.data.role === "Store Owner"){
      console.log("admin");
      navigation.navigate("AdminHome")
      return
    }
    } catch (error) {
      // Xử lý lỗi khi đăng nhập thất bại
      if(error.response && error.response.data){
        console.error(error.response.data.Message[0].DescriptionError[0]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
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

export default TestPage;
