import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
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
import Toast from 'react-native-toast-message';
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateProductService } from "../../services/ProductService"

const CreateProduct = ({ navigation }) => {
  const today = new Date();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expiredDate, setExpiredDate] = useState('');
  const [total, setTotal] = useState('');
  const [price, setPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [originalPrice, setOriginalPrice] = useState('');
  const [dateText, setDateText] = useState('Select Expired Date');
  const [showPicker, setShowPicker] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [totalError, setTotalError] = useState("");
  const [expiredDateError, setExpiredDateError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [originalPriceError, setOriginalPriceError] = useState("");
  const [productImageError, setProductImageError] = useState("");

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expiredDate;
    setShowPicker(false);
    setExpiredDate(currentDate);

    let tempDate = new Date(currentDate);
    let formattedDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    validateExpiredDate(selectedDate);
    setDateText(formattedDate);
  };

  const validateName = (inputName) => {
    let isValid = true;
    const trimmedName = inputName.trim();
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!trimmedName) {
      setNameError("Please enter product name");
      isValid = false;
    } else if (!nameRegex.test(trimmedName)) {
      setNameError("Name can only contain characters and numbers");
      isValid = false;
    } else if (trimmedName.length < 6) {
      setNameError("Name must be at least 6 characters");
      isValid = false;
    } else {
      setNameError("");
    }
    setName(inputName);
    return isValid;
  };

  const validateDescription = (inputDescription) => {
    let isValid = true;
    if (!inputDescription || inputDescription.trim().length === 0) {
      setDescriptionError("Please enter a description");
      isValid = false;
    } else if (inputDescription.length < 5) {
      setDescriptionError("Description must be atleast 6 characters");
      isValid = false;
    } else {
      setDescriptionError("");
    }
    setDescription(inputDescription);
    return isValid;
  };

  const validateTotal = (inputTotal) => {
    let isValid = true;
    const trimmedTotal = inputTotal.trim();
    const numberRegex = /^\d+$/;
    if (!trimmedTotal) {
      setTotalError("Please enter total number");
      isValid = false;
    } else if (!numberRegex.test(trimmedTotal)) {
      setTotalError("Total can only contain numbers");
      isValid = false;
    } else if (trimmedTotal < 1 || trimmedTotal > 100) {
      setTotalError("Total must be between 1 and 100");
      isValid = false;
    } else {
      setTotalError("");
    }
    setTotal(trimmedTotal);
    return isValid;
  };

  const validateExpiredDate = (inputExpiredDate) => {
    let isValid = true;
    if (!inputExpiredDate) {
      setExpiredDateError("Please select your expiredDate");
      isValid = false;
    } else {
      setExpiredDateError("");
    }
    setExpiredDate(inputExpiredDate);
    return isValid;
  };

  const validatePrice = (inputPrice) => {
    let isValid = true;
    const numberRegex = /^\d+$/;
    const trimmedPrice = inputPrice.trim()
    setPriceError("");
    if (!trimmedPrice) {
      setPriceError("Please enter product price");
      isValid = false;
    } else if (!numberRegex.test(trimmedPrice)) {
      setPriceError("Price can only contain numbers");
      isValid = false;
    } else if (trimmedPrice < 1000 || trimmedPrice > 999999999) {
      setPriceError("Price must be between 1000 and 999.999.999 VND");
      isValid = false;
    } else {
      setPriceError("");
    }
    setPrice(trimmedPrice);
    return isValid;
  };

  const validateOriginalPrice = (inputOriginalPrice) => {
    let isValid = true;
    const numberRegex = /^\d+$/;
    const trimmedOrriginPrice = inputOriginalPrice.trim()
    setOriginalPriceError("");
    if (!trimmedOrriginPrice) {
      setOriginalPriceError("Please enter product original price");
      isValid = false;
    } else if (!numberRegex.test(trimmedOrriginPrice)) {
      setOriginalPriceError("Original price can only contain numbers");
      isValid = false;
    } else if (trimmedOrriginPrice < 1000 || trimmedOrriginPrice > 999999999) {
      setOriginalPriceError("Original Price must be between 1000 and 999.999.999 VND");
      isValid = false;
    } else {
      setOriginalPriceError("");
    }
    setOriginalPrice(trimmedOrriginPrice);
    return isValid;
  };

  const validateProductImage = () => {
    let isValid = true;
    setProductImageError("");
    if (productImage === null || productImage.length === 0) {
      setProductImageError("Please select a product image");
      isValid = false;
    }
    return isValid;
  };

  const selectProductImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
      setProductImageError("");
    }
  };

  const clearForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setTotal('')
    setOriginalPrice('')
    setExpiredDate(null)
    setDateText('Select Expired Date')
    setProductImage('')
  }

  const handleCreateProduct = async () => {
    const isNameValid = validateName(name);
    const isDescriptionValid = validateDescription(description);
    const isTotalValid = validateTotal(total);
    const isPriceValid = validatePrice(price);
    const isExpiredDateValid = validateExpiredDate(expiredDate);
    const isOriginalPriceValid = validateOriginalPrice(originalPrice);
    const isProductImageValid = validateProductImage()
    if (
      isNameValid &&
      isDescriptionValid &&
      isExpiredDateValid &&
      isTotalValid &&
      isPriceValid &&
      isOriginalPriceValid &&
      isProductImageValid
    ) {
      const access_token = await AsyncStorage.getItem("access_token");
      const result = await CreateProductService(name, description, expiredDate, total, price, originalPrice, productImage, access_token)
      if (result) {
        Toast.show({
          type: "success",
          text1: "Message",
          text2: `Create ${name} Success`,
        });
        clearForm()
      } else if (result.StatusCode === 400) {
        Toast.show({
          type: "error",
          text1: "Message",
          text2: `Form not valid`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Message",
          text2: `Something went wrong.`,
        });
      }
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
          <TouchableOpacity onPress={selectProductImage}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={productImage ? { uri: productImage } : require('../../../assets/images/empty-picture.png')}
                style={styles.productImage}
              />
              {productImageError ? (<Text style={styles.errorText}>{productImageError}</Text>) : null}
            </View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <FontAwesome
              name="pencil-square-o"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Product Name"
              value={name}
              onChangeText={validateName}
            />
          </View>
          {nameError ? (<Text style={styles.errorText}>{nameError}</Text>) : null}

          <View style={styles.inputContainer}>
            <FontAwesome name="dropbox" size={22} color="black" style={{ marginRight: 5 }} />
            <TextInput
              style={styles.inputText}
              placeholder="Total"
              value={total}
              onChangeText={validateTotal}
              keyboardType="numeric"
            />
          </View>
          {totalError ? (<Text style={styles.errorText}>{totalError}</Text>) : null}

          <View style={styles.inputContainer}>
            <FontAwesome name="dollar" size={24} color="black" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.inputText}
              placeholder="Price"
              value={price}
              onChangeText={validatePrice}
              keyboardType="numeric"
            />
          </View>
          {priceError ? (<Text style={styles.errorText}>{priceError}</Text>) : null}

          <View style={styles.inputContainer}>
            <FontAwesome name="money" size={24} color="black" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.inputText}
              placeholder="Original Price"
              value={originalPrice}
              onChangeText={validateOriginalPrice}
              keyboardType="numeric"
            />
          </View>
          {originalPriceError ? (<Text style={styles.errorText}>{originalPriceError}</Text>) : null}

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
              <Text style={{ fontSize: 20, color: 'grey' }}>{dateText}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                minimumDate={today}
                value={expiredDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}

              />
            )}
          </View>
          {expiredDateError ? (<Text style={styles.errorText}>{expiredDateError}</Text>) : null}

          <View style={{ marginBottom: 20 }}>
            <Text>Description</Text>
            <View style={{ borderWidth: 1 }}>
              <TextInput
                style={styles.descriptionInput}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={validateDescription}
              />
            </View>
          </View>
          {descriptionError ? (<Text style={styles.errorText}>{descriptionError}</Text>) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleCreateProduct}
              style={{
                backgroundColor: "#023E8A",
                borderWidth: 1,
                borderRadius: 20,
                borderColor: "#023E8A"
              }}
            >
              <Text
                style={{
                  color: "white",
                  borderRadius: 20,
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                clearForm()
                navigation.goBack()
              }}
              style={{
                backgroundColor: "#ef476f",
                borderWidth: 1,
                borderRadius: 20,
                borderColor: "#ef476f"
              }}
            >
              <Text
                style={{
                  color: "white",
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                Cancel
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
    backgroundColor: "#CAF0F8",
    paddingVertical: 50,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 100,
    backgroundColor: "transparent",
  },
  editIcon: {
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottom: "grey",
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingBottom: 5,
    marginBottom: 20,
  },
  errorText: {
    fontWeight: "bold",
    color: "red",
    fontSize: 15,
    marginBottom: 15,
    marginTop: -15,
  },
  inputText: {
    fontSize: 20,
    width: "100%"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  descriptionInput: {
    padding: 10,
    fontSize: 18,
  },
});

export default CreateProduct;
