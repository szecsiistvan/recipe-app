const mongoose = require('mongoose');
const validator = require('validator');

const recipeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
    },
    ingredients: [{
        ingredient: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Ingredient'
            },
            quantity: {
                type: Number,
                required: true,
                validator(value) {
                    if (value <= 0) {
                        throw new Error('Quantity must be a positive number');
                    }
                }
            }
        }
    }],
    prepTime: {
        type: Number,
        required: true
    },
    cookingSteps:[{
        type: String
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image:{
        type:Buffer
    },
    tags:[{
        type:String,
        minLength:3,
        maxLength:20
    }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;