const app = require('../app');
const express = require('express');
const User = require('../models/recipe');
const Recipe = require('../models/recipe');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/recipes', auth, async (req, res) => {

    if (!req.body.ingredients) {
        return res.status(400).send({message: 'Please add ingredients'})
    }

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
        _id: mongoose.Types.ObjectId(),
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

// get my recipes
router.get('/recipes/me', auth, async (req,res)=>{

    const myRecipes = await Recipe.find({owner:req.user._id});

    try {
        res.status(200).send(myRecipes);

    } catch (e) {
        res.status(400).send({message:'Error listing my recipes'})
    }
});

//get recipes
//sortby=sortingtype:0/1&filterby=filterfield:gte/eq/lte-value
router.get('/recipes/', auth, async (req,res)=>{

    let sortQuery = {};

    console.log(req.query);

    if(req.query.sortby){
        const sortByType = req.query.sortby.split(':')[0];
        const isSortByAsc = req.query.sortby.split(':')[1] ? 0 : 1;

        sortQuery[sortByType] = isSortByAsc ? 1 : -1;
    }

    let filterQuery = {};

    if(req.query.filterby){
        const filterText = req.query.filterby.split(':');
        const filterParams = filterText[1].split('-');

        const filterByType = filterText[0];
        const filterOperator = filterParams[0];
        let filterValue = filterParams[1];

        if (!isNaN(filterValue)) {
            filterValue = Number(filterValue);
        }

        if (filterOperator === "eq") {
            filterQuery[filterByType] = filterValue;
            console.log('filterQuery:');
            console.log(filterQuery);
        } else {
            const filterString = '$' + filterOperator;

            const innerFilter = {};
            innerFilter[filterString] = filterValue;

            filterQuery[filterByType] = innerFilter;

        }
    }

    const recipes = await Recipe.find(filterQuery).sort(sortQuery);




    try {
        res.status(200).send(recipes);

    } catch (e) {
        res.status(400).send({message:'Error listing my recipes'})
    }
});

router
    .put('/recipes', auth, async (req, res) => {

        let myRecipe = await Recipe.findById(req.body._id);


        const requestRecipe = req.body;
        const recipeKeys = Object.keys(requestRecipe);

        console.log(recipeKeys);

        recipeKeys.forEach((key) => {
            if (myRecipe[key] !== requestRecipe[key]) {
                myRecipe[key] = requestRecipe[key];
            }
        });

        try {

            await myRecipe.save();
            res.status(200).send({message: 'Successful recipe modification', myRecipe})

        } catch (e) {
            res.status(400).send('recipe modification error');
            console.log(e);
        }


    });

router
    .delete('/recipes', auth, async (req, res) => {


        try {

            await Recipe.findByIdAndDelete(req.body._id);
            res.status(200).send(req.body.id);

        } catch (e) {
            res.status(400).send('No such recipe id');
        }


    });


module.exports = router;

