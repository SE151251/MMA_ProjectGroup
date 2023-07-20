import React, { useState } from "react";
import {
  View,
  TextInput,
  Platform,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import registerService from "../services/RegisterService";
import  Toast  from "react-native-toast-message";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [dateText, setDateText] = useState("Choose date");
  const [image, setImage] = useState(null);

  const [gender, setGender] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [imageError, setImageError] = useState("");

  const showDatePicker = () => {
    setShowPicker(true);
  };
  const handleImageChange = () => {
    setImage(null);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowPicker(false);
    setBirthday(currentDate);

    let tempDate = new Date(currentDate);
    let formattedDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    validateBirthday(selectedDate);
    setDateText(formattedDate);
  };

  const validateEmail = (inputEmail) => {
    let isValid = true;
    const trimmedEmail = inputEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      setEmailError("Please enter an email");
      isValid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else if (trimmedEmail.length < 12 || trimmedEmail.length > 100) {
      setEmailError("Email need to be 12 to 100 characters ");
      isValid = false;
    } else {
      setEmailError("");
    }
    setEmail(inputEmail);
    return isValid;
  };

  const validatePassword = (inputPassword) => {
    let isValid = true;
    const trimmedPassword = inputPassword.trim();
    if (!trimmedPassword) {
      setPasswordError("Please enter a password");
      isValid = false;
    } else if (trimmedPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    setPassword(inputPassword);
    return isValid;
  };
  const validateFullName = (inputFullName) => {
    let isValid = true;
    const trimmedFullName = inputFullName.trim();
    const fullNameRegex = /^[a-zA-Z\s]+$/;
    if (!trimmedFullName) {
      setFullNameError("Please enter your full name");
      isValid = false;
    } else if (!fullNameRegex.test(trimmedFullName)) {
      setFullNameError("Name can only contain characters");
      isValid = false;
    } else if (trimmedFullName.length < 6) {
      setFullNameError("Full name must be at least 6 characters");
      isValid = false;
    } else {
      setFullNameError("");
    }
    setFullName(inputFullName);
    return isValid;
  };
  const validateAddress = (inputAddress) => {
    let isValid = true;
    if (!inputAddress || inputAddress.trim().length === 0) {
      setAddressError("Please enter an address");
      isValid = false;
    } else if (inputAddress.length < 5 || inputAddress.length > 120) {
      setAddressError("Address must be 6 - 120 characters");
      isValid = false;
    } else {
      setAddressError("");
    }
    setAddress(inputAddress);
    return isValid;
  };

  const validatePhone = (inputPhone) => {
    let isValid = true;
    const trimmedPhone = inputPhone.trim();
    const phoneRegex = /^\d+$/;
    if (!trimmedPhone) {
      setPhoneError("Please enter a phone number");
      isValid = false;
    } else if (!phoneRegex.test(trimmedPhone)) {
      setPhoneError("Phone can only contain numbers");
      isValid = false;
    } else if (trimmedPhone.length < 10) {
      setPhoneError("Phone must be 10 digits");
      isValid = false;
    } else if (trimmedPhone.length > 10) {
      setPhoneError("Phone must be 10 digits");
      isValid = false;
    } else {
      setPhoneError("");
    }
    setPhone(inputPhone);
    return isValid;
  };
  const validateBirthday = (inputBirthday) => {
    let isValid = true;
    const currentYear = new Date().getFullYear();
    if (!inputBirthday) {
      setBirthdayError("Please select your birthday");
      isValid = false;
    } else if (currentYear - 13 < inputBirthday.getFullYear()) {
      setBirthdayError("You need to be atleast 13 years old");
      isValid = false;
    } else {
      setBirthdayError("");
    }
    setBirthday(inputBirthday);
    return isValid;
  };

  const validateGender = (inputGender) => {
    let isValid = true;
    setGenderError("");
    if (!inputGender || inputGender.length === 0) {
      setGenderError("Please select your gender");
      isValid = false;
    } else {
      setGenderError("");
    }
    setGender(inputGender);
    return isValid;
  };

  const validateAvatar = () => {
    let isValid = true;
    setImageError("");
    if (image === null || image.length === 0) {
      setImageError("Please select an avatar for your account");
      isValid = false;
    }
    return isValid;
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError("");
    }
  };

  const handleRegister = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isFullNameValid = validateFullName(fullName);
    const isAddressValid = validateAddress(address);
    const isPhoneValid = validatePhone(phone);
    const isBirthdayValid = validateBirthday(birthday);
    const isGenderValid = validateGender(gender);
    const isAvatarValid = validateAvatar();

    if (
      isEmailValid &&
      isPasswordValid &&
      isFullNameValid &&
      isAddressValid &&
      isPhoneValid &&
      isBirthdayValid &&
      isGenderValid &&
      isAvatarValid
    ) {
      registerService(
        email,
        password,
        fullName,
        address,
        phone,
        birthday,
        gender,
        image
      ).then((data) => {
        console.log(data);
        // if (data.StatusCode === 200) {
        //   console.log("SUCCESS");
          navigation.navigate('LoginScreen');
          Toast.show({
            type: "success",
            text1: "Message",
            text2: "Register successfully",
          });
        // } else if (data.StatusCode === 400) {
        //   data.Message.map((error) => {
        //     console.log(error.FieldNameError);
        //     error.DescriptionError.map((description) => {
        //       console.log(description);
        //     });
        //   });
        // }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          type: "error",
          text1: "Message",
          text2: "Register failed",
        });
      })
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "#03045E" }}>
              Register
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="user"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              value={email}
              onChangeText={validateEmail}
            />
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="lock"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={validatePassword}
            />
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="pencil-square-o"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Full Name"
              value={fullName}
              onChangeText={validateFullName}
            />
          </View>
          {fullNameError ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="address-book-o"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Address"
              value={address}
              onChangeText={validateAddress}
            />
          </View>
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="phone"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Phone"
              value={phone}
              onChangeText={validatePhone}
              keyboardType="numeric"
            />
          </View>
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => showDatePicker()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <FontAwesome
                name="calendar"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: 20 }}>{dateText}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={birthday || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          {birthdayError ? (
            <Text style={styles.errorText}>{birthdayError}</Text>
          ) : null}

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              marginBottom: 20,
              marginTop: -15,
            }}
          >
            <Picker selectedValue={gender} onValueChange={validateGender}>
              <Picker.Item
                style={{ fontSize: 20, fontWeight: "bold", borderWidth: 1 }}
                label="Select gender"
                value=""
              />
              <Picker.Item
                style={{ fontSize: 20, fontWeight: "bold", borderWidth: 1 }}
                label="Male"
                value={true}
              />
              <Picker.Item
                style={{ fontSize: 20, fontWeight: "bold", borderWidth: 1 }}
                label="Female"
                value={false}
              />
            </Picker>
          </View>
          {genderError ? (
            <Text style={styles.errorText}>{genderError}</Text>
          ) : null}

          {image ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={selectImage}>
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImageChange}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 20,
                    borderWidth: 1,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    backgroundColor: "#fa9737",
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={selectImage}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    borderWidth: 1,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    backgroundColor: "#0077B6",
                    borderRadius: 20,
                    color: "#ffffff"
                  }}
                >
                  Select Avatar
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {imageError ? (
            <Text style={styles.errorText}>{imageError}</Text>
          ) : null}

          <TouchableOpacity
            onPress={() => handleRegister()}
            style={{
              backgroundColor: "#03045E", padding: 10, borderRadius: 30, marginHorizontal: 120, marginVertical: 10, borderWidth: 1, borderColor: 'black'
            }}
          >
            <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
              Register
            </Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Already has an account? Login now
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
    justifyContent: "center",
    paddingHorizontal: 20,
    // backgroundColor: COLORS.lightOrange,
    backgroundColor: "#CAF0F8",
    paddingVertical: 30,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottom: "grey",
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingBottom: 5,
    marginBottom: 20,
  },
  inputText: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 20,
  },
  errorText: {
    fontWeight: "bold",
    color: "red",
    fontSize: 15,
    marginBottom: 15,
    marginTop: -15,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default Register;
