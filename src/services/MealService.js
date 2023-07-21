const CreateMealService = async (title, description, mealImage, token) => {
    try {
        const uriParts = mealImage.split("/");
        const fileTitle = uriParts[uriParts.length - 1];
    
        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("MealImages", {
          uri: mealImage,
          type: "image/jpeg",
          title: fileTitle,
        });
    
        const response = await fetch(
          "https://bmosapplication.azurewebsites.net/odata/Meals",
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

const UpdateMealService = () => {

}

export {CreateMealService, UpdateMealService} 