export default class Recipe {
    constructor(id, categoryId, name, imageUrl, rating, material, cookStep, time) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.material = material;
        this.cookStep = cookStep;
        this.time = time;
    }
}