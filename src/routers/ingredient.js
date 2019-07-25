const app = require('../app');
const express = require('express');
const User = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = new express.Router();

// create ingredient
router.post('/ingredients', auth, async (req, res) => {

    const _id = mongoose.Types.ObjectId();

    const ingredient = new Ingredient({
        _id,
        name: req.body.name
    });

    try {
        await ingredient.save();
        res.status(201).send(ingredient);

    } catch (e) {
        res.status(400).send();
    }
});

// modify ingredient
router
    .put('/ingredients', auth, async (req,res)=>{

        const ingredient = await Ingredient.findById(req.body.id);
        console.log(req.body.id);

        ingredient.name = req.body.name;

        if(!ingredient){
            res.status(400).send('wrong ingredient id');
        }

        try {
            await ingredient.save();
            res.status(200).send(ingredient);
        }catch (e) {
            res.status(400).send(e);
        }


});


// delete ingredient
router
    .delete('/ingredients', auth, async (req,res)=>{

    const ingredient = await Ingredient.findByIdAndDelete(req.body.id);

    if(!ingredient){
        res.status(401).send('wrong ingredient id');
    }

    try {
        res.status(200).send(ingredient);
    }catch (e) {
        res.status(400).send(e);
    }
});



module.exports = router;