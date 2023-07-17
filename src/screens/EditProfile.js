



import React, { useState } from 'react';
import { FontAwesome} from '@expo/vector-icons';
import COLORS from '../constants/colors'
import { View, TextInput, Platform, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';




const EditProfile = ({ route, navigation }) => {
    const { data } = route.params
    const parts = data.birthday.split('/');
    const day = parseInt(parts[0]) + 1;
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const parsedDate = new Date(year, month, day)


    const [email, setEmail] = useState(data.email);
    const [fullName, setFullName] = useState(data.fullName);
    const [address, setAddress] = useState(data.address);
    const [phone, setPhone] = useState(data.phone);
    const [birthday, setBirthday] = useState(parsedDate);
    const [dateText, setDateText] = useState(data.birthday);
    const [image, setImage] = useState(data.image);
    const [gender, setGender] = useState(data.gender);
    const [showPicker, setShowPicker] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [imageError, setImageError] = useState('');


    const showDatePicker = () => {
        setShowPicker(true);
    };


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthday;
        setShowPicker(false);
        setBirthday(currentDate);


        let tempDate = new Date(currentDate)
        let formattedDate = tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getFullYear()
        validateBirthday(selectedDate)
        setDateText(formattedDate)
    };


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
        } else if (trimmedEmail.length < 12 || trimmedEmail.length > 100) {
            setEmailError('Email need to be 12 to 100 characters ');
            isValid = false
        } else {
            setEmailError('')
        }
        setEmail(inputEmail)
        return isValid
    }


    const validateFullName = (inputFullName) => {
        let isValid = true
        const trimmedFullName = inputFullName.trim();
        const fullNameRegex = /^[a-zA-Z\s]+$/;
        if (!trimmedFullName) {
            setFullNameError('Please enter your full name');
            isValid = false
        } else if (!fullNameRegex.test(trimmedFullName)) {
            setFullNameError('Name can only contain characters');
            isValid = false
        } else if (trimmedFullName.length < 6) {
            setFullNameError('Full name must be at least 6 characters');
            isValid = false
        } else {
            setFullNameError('')
        }
        setFullName(inputFullName)
        return isValid
    }
    const validateAddress = (inputAddress) => {
        let isValid = true
        if (!inputAddress || inputAddress.trim().length === 0) {
            setAddressError('Please enter an address');
            isValid = false
        } else if (inputAddress.length < 5 || inputAddress.length > 120) {
            setAddressError('Address must be 6 - 120 characters');
            isValid = false
        } else {
            setAddressError('')
        }
        setAddress(inputAddress)
        return isValid
    }


    const validatePhone = (inputPhone) => {
        let isValid = true
        const trimmedPhone = inputPhone.trim();
        const phoneRegex = /^\d+$/;
        if (!trimmedPhone) {
            setPhoneError('Please enter a phone number');
            isValid = false
        } else if (!phoneRegex.test(trimmedPhone)) {
            setPhoneError('Phone can only contain numbers');
            isValid = false
        } else if (trimmedPhone.length < 10) {
            setPhoneError('Phone must be 10 digits');
            isValid = false
        } else if (trimmedPhone.length > 10) {
            setPhoneError('Phone must be 10 digits');
            isValid = false
        } else {
            setPhoneError('')
        }
        setPhone(inputPhone)
        return isValid
    }
    const validateBirthday = (inputBirthday) => {
        let isValid = true
        const currentYear = new Date().getFullYear()
        if (!inputBirthday) {
            setBirthdayError('Please select your birthday');
            isValid = false
        } else if (currentYear - 13 < inputBirthday.getFullYear()) {
            setBirthdayError('You need to be atleast 13 years old');
            isValid = false
        } else {
            setBirthdayError('')
        }
        setBirthday(inputBirthday)
        return isValid
    }


    const validateGender = (inputGender) => {
        let isValid = true
        setGenderError('');
        if (!inputGender || inputGender.length === 0) {
            setGenderError('Please select your gender');
            isValid = false
        } else {
            setGenderError('')
        }
        setGender(inputGender)
        return isValid
    }


    const validateAvatar = () => {
        let isValid = true
        setImageError('')
        if (image === null || image.length === 0) {
            setImageError('Please select an avatar for your account')
            isValid = false
        }
        return isValid
    }


    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageError('')
        }
    };


    const handleEditProfile = () => {
        const isEmailValid = validateEmail(email);
        const isFullNameValid = validateFullName(fullName);
        const isAddressValid = validateAddress(address);
        const isPhoneValid = validatePhone(phone);
        const isBirthdayValid = validateBirthday(birthday);
        const isGenderValid = validateGender(gender);
        const isAvatarValid = validateAvatar();
        if (
            isEmailValid &&
            isFullNameValid &&
            isAddressValid &&
            isBirthdayValid &&
            isPhoneValid &&
            isGenderValid &&
            isAvatarValid
        ) {


            console.log(true)


        }
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={selectImage}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Image source={{ uri: image }} style={styles.image} />
                            <View style={styles.editIconContainer}>
                                <FontAwesome style={styles.editIcon} name="pencil-square-o" size={30} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>
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
                        <FontAwesome name="pencil-square-o" size={24} color="black" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={validateFullName}
                        />
                    </View>
                    {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}
                    <View style={styles.inputContainer}>
                        <FontAwesome name="address-book-o" size={24} color="black" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Address"
                            value={address}
                            onChangeText={validateAddress}
                        />
                    </View>
                    {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
                    <View style={styles.inputContainer}>
                        <FontAwesome name="phone" size={24} color="black" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Phone"
                            value={phone}
                            onChangeText={validatePhone}
                            keyboardType="numeric"
                        />
                    </View>
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={() => showDatePicker()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="calendar" size={24} color="black" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 20,}}>{dateText}</Text>
                        </TouchableOpacity>
                        {showPicker && (
                            <DateTimePicker
                                value={birthday}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                    {birthdayError ? <Text style={styles.errorText}>{birthdayError}</Text> : null}


                    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginBottom: 20, marginTop: -20 }}>
                        <Picker
                            selectedValue={gender}
                            onValueChange={validateGender}
                        >
                            <Picker.Item style={{ fontSize: 20, fontWeight: 'bold', borderWidth: 1, }} label="Male" value={true} />
                            <Picker.Item style={{ fontSize: 20, fontWeight: 'bold', borderWidth: 1, }} label="Female" value={false} />
                        </Picker>
                    </View>
                    {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}


                    <View style={styles.fieldsContainer}>
                        <TouchableOpacity
                            onPress={() => handleEditProfile()}
                            style={{ backgroundColor: "#06ba0f", borderWidth: 1, borderRadius: 20, }}
                        >
                            <Text style={{ color: 'white', borderRadius: 20, paddingHorizontal: 25, paddingVertical: 10, textAlign: 'center', fontSize: 20, }}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ backgroundColor: "#e3092d", borderWidth: 1, borderRadius: 20, }}
                        >
                            <Text style={{ color: 'white', paddingHorizontal: 25, paddingVertical: 10, textAlign: 'center', fontSize: 20, }}>Cancel</Text>
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
    editIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 100,
        backgroundColor: 'transparent',
    },
    editIcon: {
        opacity: 0.7,
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottom: 'grey',
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingBottom: 5,
        marginBottom: 20,
    },
    errorText: {
        fontWeight: 'bold',
        color: 'red',
        fontSize: 15,
        marginBottom: 15,
        marginTop: -15
    },
    inputText: {
        flex: 1,
        paddingVertical: 0,
        fontSize: 20
    },
    fieldsText: {
        fontSize: 20,
        fontWeight: 'bold',


    },
    fieldsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
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




export default EditProfile



