import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { WebView } from 'react-native-webview';
const Login = () => {
  return (
     <WebView
        source={{
          uri: 'https://github.com/facebook/react-native',
        }}
        style={{marginTop: 20}}
      />
  );
};

export default Login;

const styles = StyleSheet.create({});
