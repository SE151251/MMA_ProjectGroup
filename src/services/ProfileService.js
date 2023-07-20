

const getUserProfile = async (userId, token) => {
    try {
      const response = await fetch(`https://bmosapplication.azurewebsites.net/odata/Customers/${userId}`
        , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        });
  
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error:', error);
    }
  };
  
  
  const updateUserProfile = async (userId, token, updatedData) => {
    try {
      const formData = new FormData();
      formData.append('FullName', updatedData.FullName);
      formData.append('Address', updatedData.Address);
      formData.append('Phone', updatedData.Phone);
      formData.append('Gender', updatedData.Gender);
      formData.append('BirthDate', updatedData.BirthDate.toISOString());
      if (updatedData.Avatar !== null) {
        const uriParts = updatedData.Avatar.split('/');
        const fileName = uriParts[uriParts.length - 1];
        formData.append('Avatar', {
          uri: updatedData.Avatar,
          type: 'image/jpeg',
          name: fileName,
        });
      }
      console.log("ABC")
      const response = await fetch(`https://bmosapplication.azurewebsites.net/odata/Customers/${userId}`
        , {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          method: 'PUT',
          body: formData,
        });
  
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  
  
  
  
  export { getUserProfile, updateUserProfile }
  
  
  
  
  
  
  
  
  
  
  
  