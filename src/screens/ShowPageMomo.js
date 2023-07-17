import React, { useEffect } from "react";
import { Linking, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
const ShowPageMomo = ({route}) => {

  const handleNavigationStateChange = (navState) => {
    const url = navState.url;
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
        onNavigationStateChange={handleNavigationStateChange}
      />
  );
};

export default ShowPageMomo;

