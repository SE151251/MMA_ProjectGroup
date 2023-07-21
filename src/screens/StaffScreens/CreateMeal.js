import React, { useState, useEffect } from "react";
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
    Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CheckBox from 'expo-checkbox';
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateMealService } from "../../services/MealService"
import { GetAllProductService } from "../../services/ProductService"
import { useIsFocused } from "@react-navigation/native";
import Modal from 'react-native-modal';
/*
* TODO: Finishing Create Meal with Picker for Products
*/
const CreateMeal = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mealImage, setMealImage] = useState(null);
    const [products, setProducts] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [mealImageError, setMealImageError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [titleError, setTitleError] = useState("")
    const [productError, setProductError] = useState("")

    const fetchProduct = async () => {
        try {
            const access_token = await AsyncStorage.getItem("access_token");

            const data = await GetAllProductService(access_token)
            const filterData = data.value.map((product) => ({
                id: product.ID,
                name: product.Name
            }))
            setProducts(filterData);
        } catch (error) {
            console.log('Error:', error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            fetchProduct()
        }
    }, [isFocused]);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const confirmSelection = () => {
        setIsModalVisible(false);
        console.log(selectedProducts);
    };

    const handleToggleProduct = (product) => {
        if (selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)) {
            setSelectedProducts(selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleAddProduct = () => {
        setSelectedProducts([...selectedProducts, null]);
    };

    const handleProductChange = (productId, index) => {
        const updatedSelectedProducts = [...selectedProducts];
        updatedSelectedProducts[index] = { id: productId };
        setSelectedProducts(updatedSelectedProducts);
    };

    const validateTitle = (inputTitle) => {
        let isValid = true;
        const trimmedTitle = inputTitle.trim();
        const titleRegex = /^[a-zA-Z0-9\s]+$/;
        if (!trimmedTitle) {
            setTitleError("Please enter meal title");
            isValid = false;
        } else if (!titleRegex.test(trimmedTitle)) {
            setTitleError("Title can only contain characters and numbers");
            isValid = false;
        } else if (trimmedTitle.length < 6) {
            setTitleError("Title must be atleast 6 characters");
            isValid = false;
        } else {
            setTitleError("");
        }
        setTitle(inputTitle);
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

    const validateMealImage = () => {
        let isValid = true;
        setMealImageError("");
        if (mealImage === null || mealImage.length === 0) {
            setMealImageError("Please select a meal image");
            isValid = false;
        }
        return isValid;
    };

    const selectMealImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setMealImage(result.assets[0].uri);
            setMealImageError("");
        }
    };

    const clearForm = () => {
        setTitle('')
        setDescription('')
        setMealImage('')
        setProducts([])
    }

    const handleCreateMeal = async () => {
        const isTitleValid = validateTitle(title);
        const isDescriptionValid = validateDescription(description);
        const isMealImageValid = validateMealImage()
        if (
            isTitleValid &&
            isDescriptionValid &&
            isMealImageValid
        ) {
            const access_token = await AsyncStorage.getItem("access_token");
            const result = await CreateMealService(title, description, mealImage, access_token)
            if (result) {
                Toast.show({
                    type: "success",
                    text1: "Message",
                    text2: `Create ${title} Success`,
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
                    <TouchableOpacity onPress={selectMealImage}>
                        <View style={{ alignItems: "center", marginBottom: 20 }}>
                            <Image
                                source={mealImage ? { uri: mealImage } : require('../../../assets/images/empty-picture.png')}
                                style={styles.mealImage}
                            />
                            {mealImageError ? (<Text style={styles.errorText}>{mealImageError}</Text>) : null}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <FontAwesome
                            title="pencil-square-o"
                            size={24}
                            color="black"
                            style={{ marginRight: 10 }}
                        />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Meal Title"
                            value={title}
                            onChangeText={validateTitle}
                        />
                    </View>
                    {titleError ? (<Text style={styles.errorText}>{titleError}</Text>) : null}

                    <View style={styles.inputPicker}>
                        <Modal>
                            <ScrollView>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Select Products</Text>
                                    {products.map((product) => (
                                        <View key={product.id} style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)}
                                                onValueChange={() => handleToggleProduct(product)}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginLeft: 10 }}>{product.name}</Text>
                                        </View>
                                    ))}
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <TouchableOpacity onPress={confirmSelection} style={styles.confirmButton}>
                                            <Text style={styles.confirmButtonText}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>

                        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                            <ScrollView>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Choose Products</Text>
                                    <View>
                                        <View style={{ borderWidth: 1, borderRadius: 15, paddingHorizontal: 20, paddingVertical: 10 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>product</Text>
                                            {selectedProducts.map((selected, index) => {
                                                <View key={index}>
                                                    <Picker selectedValue={selected.id} onValueChange={() => { }}>
                                                        <Picker.Item

                                                            style={{ fontSize: 20, fontWeight: "bold", borderWidth: 1 }}
                                                            label="Select product"
                                                            value=""
                                                        />
                                                        {products.map((product) => (
                                                            <Picker.Item
                                                                key={product.id}
                                                                style={{ fontSize: 20, fontWeight: "bold", borderWidth: 1 }}
                                                                label={product.name}
                                                                value={product.id}
                                                            />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            })}
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={handleAddProduct}>
                                                <FontAwesome name="plus-circle" size={24} color="#007BFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <TouchableOpacity onPress={confirmSelection} style={styles.confirmButton}>
                                            <Text style={styles.confirmButtonText}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>



                        <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 20 }}>Selected Product: {selectedProducts.map((selectedProduct) => selectedProduct.name).join(', ')}</Text>
                        <TouchableOpacity onPress={toggleModal}>
                            <Text style={{
                                backgroundColor: '#007BFF',
                                padding: 10,
                                borderRadius: 5,
                                alignItems: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                width: '40%',
                                textAlign: 'center'
                            }}>Select Product</Text>
                        </TouchableOpacity>
                    </View>

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
                            onPress={handleCreateMeal}
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
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    inputPicker: {
        flexDirection: "column",
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
    mealImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    descriptionInput: {
        padding: 10,
        fontSize: 18,
    },
});

export default CreateMeal;
