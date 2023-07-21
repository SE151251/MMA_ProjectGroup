const CreateProductService = async (name, description, expiredDate, total, price, originalPrice, productImage, token) => {
    try {
        const uriParts = productImage.split("/");
        const fileName = uriParts[uriParts.length - 1];
    
        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Description", description);
        formData.append("ExpiredDate", expiredDate.toISOString());
        formData.append("Total", parseFloat(total));
        formData.append("Price", parseFloat(price));
        formData.append("OriginalPrice", parseFloat(originalPrice));
        formData.append("ProductImages", {
          uri: productImage,
          type: "image/jpeg",
          name: fileName,
        });
    
        const response = await fetch(
          "https://bmosapplication.azurewebsites.net/odata/Products",
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
}

const UpdateProductService = async (id, name, description, originalPrice, price, total, status, expiredDate, token) => {
  try {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("ExpiredDate", expiredDate.toISOString());
    formData.append("Total", total);
    formData.append("Price", price);
    formData.append("OriginalPrice", originalPrice);
    formData.append("Status", status);



    const response = await fetch(
      `https://bmosapplication.azurewebsites.net/odata/Products/${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
}

const GetAllProductService = async (token) => {
    try {
        const response = await fetch(
          "https://bmosapplication.azurewebsites.net/odata/Products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "Get",
          }
        );
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.log("Error:", error);
      }
}

export {CreateProductService, UpdateProductService, GetAllProductService} 