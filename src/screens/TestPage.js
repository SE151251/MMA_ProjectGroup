import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const TestPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      //const data = await login(email, password);
      
      // Xử lý dữ liệu nhận được sau khi đăng nhập thành công
      console.log('Login success:', email, password);
      navigation.navigate("TestRedirect")
    } catch (error) {
      // Xử lý lỗi khi đăng nhập thất bại
      console.error('Login failed:', error);
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
