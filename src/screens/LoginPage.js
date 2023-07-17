import React, { useEffect } from "react";
import { Linking, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
const Login = ({route}) => {
  const handleNavigation = (event) => {
    console.log("zo 1", event);
    const url = event.url;
    console.log("tới");
    console.log(url);
    // Kiểm tra xem URL có chứa scheme của Momo không
    if (url.startsWith('momo://')) {
      // Mở ứng dụng Momo bằng cách chuyển hướng URL scheme
      Linking.openURL(url);
      return false; // Ngăn chặn WebView mở URL
    }

    return true; // Cho phép WebView mở URL
  };
  const handleNavigationStateChange = (navState) => {
    console.log("zo");
    const url = navState.url;
    console.log("url: ",url);
    if (url && url.startsWith('momo://')) {
      // Mở ứng dụng Momo bằng cách chuyển hướng URL scheme
      Linking.openURL(url);
      // Hoặc thực hiện các hành động khác liên quan đến Momo
    }
  };
  
  return (
     <WebView    
        source={{ uri: route.params.url }}
        style={{marginTop: 20}}
        //onShouldStartLoadWithRequest={handleNavigation}
        onNavigationStateChange={handleNavigationStateChange}
      />
  );
};

export default Login;

const styles = StyleSheet.create({});
