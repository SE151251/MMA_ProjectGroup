import * as FileSystem from 'expo-file-system';


const register = async (email, password, fullName, address, phone, birthday, gender, imageUri) => {
  try {


    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1];


    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });


    const formData = new FormData();
    formData.append('Email', email);
    formData.append('PasswordHash', password);
    formData.append('FullName', fullName);
    formData.append('Address', address);
    formData.append('Phone', phone);
    formData.append('Gender', gender);
    formData.append('BirthDate', birthday.toISOString());
    formData.append('Avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });


    const response = await fetch('https://bmosapplication.azurewebsites.net/odata/Customers/Register', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formData,


    });


    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error:', error);
  }
};


export default register



