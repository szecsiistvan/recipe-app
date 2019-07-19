const app = require('../app');
const express = require('express');
const User = require('../models/recipe');
const Recipe = require('../models/recipe');
const router = new express.Router();
const mongoose = require('mongoose');


router.post('/recipes', async (req, res) => {

    const newArray = req.body.ingredients.map((value) => {
        const id = mongoose.Types.ObjectId(value.ingredient.id);
        const newLine = {
            ingredient: {
                id,
                quantity: value.ingredient.quantity
            }
        };
        return newLine;
    });

    const recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        ingredients: newArray,
        prepTime: req.body.prepTime,
        cookingSteps: req.body.cookingSteps,
        owner: req.body.owner,
        image: req.body.image,
        tags: req.body.tags
    });

    try {
        await recipe.save();
        res.status(201).send(recipe);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;

