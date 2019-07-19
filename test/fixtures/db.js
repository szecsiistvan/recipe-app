const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Recipe = require('../../src/models/recipe');
const Ingredient = require('../../src/models/ingredient');

const userOneID = mongoose.Types.ObjectId();

const userOne = new User({
    _id: userOneID,
    role: "NORMAL",
    name: "Istvan",
    email: "a@a.hu",
    password: "szarafidesz"
});

const userTwoID = mongoose.Types.ObjectId();

const userTwo = new User({
    _id: userTwoID,
    role: "ADMIN",
    name: "Béla",
    email: "b@b.hu",
    password: "szarafidesz"
});

const userThreeID = mongoose.Types.ObjectId();

const userThree = new User({
    role: "NORMAL",
    name: "Csaba",
    email: "c@c.hu",
    password: "szarafidesz"
});

const ingredientOneId = mongoose.Types.ObjectId();

const ingredientOne = new Ingredient({
    _id: ingredientOneId,
    name: "first ingredient"
});

const ingredientTwoId = mongoose.Types.ObjectId();

const ingredientTwo = new Ingredient({
    _id: ingredientTwoId,
    name: "second ingredient"
});

const ingredientThreeId = mongoose.Types.ObjectId();

const ingredientThree = new Ingredient({
    _id: ingredientThreeId,
    name: "third ingredient"
});

const recipeOneId = mongoose.Types.ObjectId();

const recipeOne = new Recipe({
    _id: recipeOneId,
    name: "First Recipe",
    description: "Description for the first recipe",
    ingredients: [
        {
            ingredient: {
                id: ingredientOneId,
                "quantity": 1
            }
        },
        {
            ingredient: {
                id: ingredientTwoId,
                "quantity": 2
            }
        }
    ],
    prepTime: 11,
    cookingSteps: ["one", "two", "three"],
    owner: userOneID,
    tags: ["one", "two", "three"]
});

const recipeTwoId = mongoose.Types.ObjectId();

const recipeTwo = new Recipe({
    _id: recipeTwoId,
    name: "Second Recipe",
    description: "Description for the second recipe",
    ingredients: [
        {
            ingredient: {
                id: ingredientTwoId,
                "quantity": 3
            }
        }
    ],
    prepTime: 22,
    cookingSteps: ["twentyone", "twentytwo", "twentythree"],
    owner: userTwoID,
    tags: ["five", "six", "seven"]
});

const recipeThreeId = mongoose.Types.ObjectId();

const recipeThree = new Recipe({
    _id: recipeThreeId,
    name: "Third Recipe",
    description: "Description for the third recipe",
    ingredients: [
        {
            ingredient: {
                id: ingredientTwoId,
                "quantity": 3
            }
        }
    ],
    prepTime: 33,
    cookingSteps: ["twentyone", "twentytwo", "twentythree"],
    owner: userTwoID,
    tags: ["five", "six", "seven"]
});

const setupDatabase = async () => {
    await User.deleteMany();
    await Ingredient.deleteMany();
    await Recipe.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Ingredient(ingredientOne).save();
    await new Ingredient(ingredientTwo).save();
    await new Recipe(recipeOne).save();
    await new Recipe(recipeTwo).save();
};

module.exports = {
    setupDatabase,
    userOne,
    userTwo,
    userThree,
    ingredientOne,
    ingredientTwo,
    ingredientThree,
    recipeOne,
    recipeTwo,
    recipeThree
}








