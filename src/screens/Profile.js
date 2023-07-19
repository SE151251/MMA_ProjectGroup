import React, { useState, useEffect } from "react";
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
import {getUserProfile} from "../services/ProfileService";
import { FontAwesome, Foundation } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [profileData, setProfileData] = useState(null);
  const [dateText, setDateText] = useState('')

  const fetchUserProfile = async () => {
    try {
      const user_info_json = await AsyncStorage.getItem("user_info");
      const user_data =
      user_info_json != null
        ? JSON.parse(user_info_json)
        : {
            id: "0",
            isLogin: false,
          };
      if (user_data.isLogin === false) {
        // setProfileData();
        return navigation.navigate("LoginScreen");
      }
      const access_token = await AsyncStorage.getItem("access_token");
      const data = await getUserProfile(user_data.id, access_token)
      let tempDate = new Date(data.BirthDate);
      let formattedDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();


      setProfileData(data);
      setDateText(formattedDate)
    } catch (error) {
      console.log('Error:', error);
    }
  };


    useEffect(() => {
      if (isFocused) {
        
        fetchUserProfile();
      }
    }, [isFocused]);


  const handleEditProfile = () => {
    const data = {
      ...profileData,
      DateText: dateText,
    }
    navigation.navigate("EditProfile", { data });
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >


      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {profileData !== null ?
          <View style={styles.container}>
            <View style={{ alignItems: "center" }}>
              <Image source={{ uri: profileData.Avatar }} style={styles.image} />
              <Text
                style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}
              >
                {profileData.FullName}
              </Text>
            </View>


            <View style={styles.fieldsContainer}>
              <FontAwesome
                name="address-book-o"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.fieldsText}>{profileData.Address}</Text>
            </View>


            <View style={styles.fieldsContainer}>
              <FontAwesome
                name="calendar"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.fieldsText}>{dateText}</Text>
            </View>


            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.fieldsContainer}>
                <FontAwesome
                  name="phone"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.fieldsText}>{profileData.Phone}</Text>
              </View>


              {profileData.Gender === true ? (
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
                  borderColor: "white",
                  alignItems: "center",
                  borderRadius: 10
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


            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: "#03045E", borderWidth: 1, borderRadius: 20, marginHorizontal: 120 }}
            >
              <Text style={{ paddingHorizontal: 25, fontWeight: 'bold', paddingVertical: 10, textAlign: 'center', fontSize: 20, color: "#ffffff" }}>Back</Text>
            </TouchableOpacity>


          </View>
          :
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Profile not found</Text>
          </View>
        }
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.lightOrange,
    paddingVertical: 50,
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
    borderRadius: 10,
    borderColor: "white",
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





