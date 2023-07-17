import React, { useState } from "react";
import {
  View,
  Platform,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesome, Foundation } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState("tm@gmail.com");
  const [fullName, setFullName] = useState("minh quan");
  const [address, setAddress] = useState("asdasdasd");
  const [phone, setPhone] = useState("1234567891");
  const [birthday, setBirthday] = useState("1/1/2000");
  const [image, setImage] = useState(
    "https://i.pinimg.com/originals/25/13/3d/25133df91301e29bcd36eec3949009ff.jpg"
  );
  const [gender, setGender] = useState(true);

  const handleEditProfile = () => {
    const data = {
      email: email,
      fullName: fullName,
      address: address,
      phone: phone,
      birthday: birthday,
      image: image,
      gender: gender,
    };
    navigation.navigate("EditProfile", { data });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text
              style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}
            >
              Tran Minh Quan
            </Text>
          </View>

          <View style={styles.fieldsContainer}>
            <FontAwesome
              name="user"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.fieldsText}>mquan@gmail.com</Text>
          </View>

          <View style={styles.fieldsContainer}>
            <FontAwesome
              name="address-book-o"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.fieldsText}>Abdc 12/122 </Text>
          </View>

          <View style={styles.fieldsContainer}>
            <FontAwesome
              name="phone"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.fieldsText}>0123451587</Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.fieldsContainer}>
              <FontAwesome
                name="calendar"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.fieldsText}>22/11/2000</Text>
            </View>

            {gender === true ? (
              <View style={styles.fieldsContainer}>
                <Text style={styles.fieldsText}>Gender: </Text>
                <Foundation name="male-symbol" size={30} color="blue" />
              </View>
            ) : (
              <View style={styles.fieldsContainer}>
                <Foundation name="female-symbol" size={30} color="pink" />
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row-reverse", marginBottom: 15 }}>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={{
                backgroundColor: "white",
                padding: 5,
                borderWidth: 1,
                borderColor: "black",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                <FontAwesome
                  name="pencil-square-o"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />{" "}
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.lightOrange,
    paddingVertical: 30,
  },
  fieldsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  fieldsContainer: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 90,
    marginBottom: 10,
  },
});

export default Profile;
