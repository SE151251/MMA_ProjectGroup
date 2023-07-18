// import React, { useState } from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from 'axios';
// const TestPage = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       console.log('Login submit:', email, password);
//       const data = await axios.post(`https://bmosapplication.azurewebsites.net/odata/authentications/login`,
//       { 
//         email: email,
//       passwordHash: password
//     })
//     await AsyncStorage.setItem("access_token", data.data.accessToken)
//     await AsyncStorage.setItem("refresh_token", data.data.refreshToken)
//     await AsyncStorage.setItem("user_info",JSON.stringify({
//       id: data.data.accountId,
//       email: data.data.email,
//       name: data.data.fullName,
//       role: data.data.role,
//       isLogin: true
//     }))
//     if(data.data.role === "Customer") {
//       console.log("zo");   
//       navigation.navigate("Home")
//       return
//     }
//     if(data.data.role === "Staff"){
//       console.log("staff token: ", data.data.accessToken);
//       navigation.navigate("StaffHome")
//       return
//     }
//     if(data.data.role === "Store Owner"){
//       console.log("admin");
//       setEmail(null)
//       setPassword(null)
//       navigation.navigate("AdminHome")
//       return
//     }
//     } catch (error) {
//       // Xử lý lỗi khi đăng nhập thất bại
//       if(error.response && error.response.data){
//         console.error(error.response.data.Message[0].DescriptionError[0]);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Login" onPress={handleLogin} />

//       <Button title="Back to home" onPress={()=>navigation.navigate('Home')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
// });

// export default TestPage;
import React, { useState } from 'react';
import { View, TextInput, Platform, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../constants/colors'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');


  const validateEmail = (inputEmail) => {
    let isValid = true
    const trimmedEmail = inputEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
        setEmailError('Please enter an email');
        isValid = false
    } else if (!emailRegex.test(trimmedEmail)) {
        setEmailError('Please enter a valid email address');
        isValid = false
    } else if(trimmedEmail.length < 12 || trimmedEmail.length > 100){
        setEmailError('Email need to be 12 to 100 characters ');
        isValid = false
    } else {
        setEmailError('')
    }
    setEmail(inputEmail)
    return isValid
}


  const validatePassword = (inputPassword) => {
    let isValid = true
    const trimmedPassword = inputPassword.trim();
    if (!trimmedPassword) {
        setPasswordError('Please enter a password');
        isValid = false
    } else {
        setPasswordError('')
    }
    setPassword(inputPassword)
    return isValid
}




  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (isEmailValid && isPasswordValid) {
      console.log(true)
      // loginService(email, password)
      //   .then((data) => {
      //     if (data.StatusCode === 400) {
      //       setLoginError(data.Message[0].DescriptionError[0]);
      //     } else {
      //       navigation.navigate('Home')
      //       setLoginError('')
      //     }
      //   })
    try {
      const data = await axios.post(`https://bmosapplication.azurewebsites.net/odata/authentications/login`,
      { 
        email: email,
      passwordHash: password
    })
    await AsyncStorage.setItem("access_token", data.data.accessToken)
    await AsyncStorage.setItem("refresh_token", data.data.refreshToken)
    await AsyncStorage.setItem("user_info",JSON.stringify({
      id: data.data.accountId,
      email: data.data.email,
      name: data.data.fullName,
      role: data.data.role,
      isLogin: true
    }))
    if(data.data.role === "Customer") {
      console.log("zo");   
      navigation.navigate("Home")
      return
    }
    if(data.data.role === "Staff"){
      console.log("staff token: ", data.data.accessToken);
      setEmail('')
      setPassword('')
      navigation.navigate("StaffHome")
      return
    }
    if(data.data.role === "Store Owner"){
      console.log("admin");
      setEmail('')
      setPassword('')
      navigation.navigate("AdminHome")
      return
    }
    } catch (error) {
      // Xử lý lỗi khi đăng nhập thất bại
      if(error.response && error.response.data){
        console.error(error.response.data.Message[0].DescriptionError[0]);
      }
    }

    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
      <View style={{alignItems: 'center', marginBottom: 20}}>
                    <Text style={{ fontSize: 30, fontWeight:'bold'}} >Login</Text>
                </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={24} color="black" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            value={email}
            onChangeText={validateEmail}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color="black" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={validatePassword}
          />
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
        <View style={{ flexDirection: 'row-reverse' }}>
          <TouchableOpacity style={{ paddingRight: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>




        <TouchableOpacity
          onPress={() => handleLogin()}
          style={{ backgroundColor: "#F7DC6F", padding: 10, borderRadius: 20, marginHorizontal: 30, marginVertical: 10, borderWidth: 1, borderColor: 'black' }}
        >
          <Text style={{ color: 'black', textAlign: 'center', fontSize: 20, }}>Login</Text>
        </TouchableOpacity>


        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Don't have an account? Register now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // backgroundColor: COLORS.lightOrange
    backgroundColor: "#52BE80"
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottom: 'grey',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingBottom: 5,
    marginBottom: 20,
  },
  inputText: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 20
  },
  errorText: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 15,
    marginBottom: 15,
    marginTop: -15
  },
});




export default Login;







