const app = require('../app');
const express = require('express');
const User = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/ingredients', auth, async (req, res) => {

    const ingredient = new Ingredient({
        name: req.body.name
    });

    try {
        await ingredient.save();
        res.status(201).send();

    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;