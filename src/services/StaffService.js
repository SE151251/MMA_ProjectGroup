const createStaffService = async (
    email,
    password,
    fullName,
    address,
    phone,
    birthday,
    gender,
    imageUri,
    identityNum,
    token
  ) => {
    try {
      const uriParts = imageUri.split("/");
      const fileName = uriParts[uriParts.length - 1];
  
      const formData = new FormData();
      formData.append("Account.Email", email);
      formData.append("Account.PasswordHash", password);
      formData.append("FullName", fullName);
      formData.append("IdentityNumber", identityNum);
      formData.append("Address", address);
      formData.append("Phone", phone);
      formData.append("Gender", gender);
      formData.append("BirthDate", birthday.toISOString());
      formData.append("Avatar", {
        uri: imageUri,
        type: "image/jpeg",
        name: fileName,
      });
  
      const response = await fetch(
        "https://bmosapplication.azurewebsites.net/odata/Staffs",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  export default createStaffService;
  