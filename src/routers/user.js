const app = require('../app');
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = new express.Router();

router.get('/test', (req, res) => {
    console.log('valami');
    res.status(202).send('valami');
});

router
    .post('/users', async (req, res) => {


        if (req.body.password.length < 8 || req.body.password.includes("password")) {
            return res.status(400).send();
        }

        console.log(req.body);

        const password = await bcrypt.hash(req.body.password, 8);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: password
        });

        const userWithEmail = await User.findOne({email: req.body.email});

        if (userWithEmail) {
            return res.status(400).send(`${req.body.email} is already used.`);
        } else {
            try {
                const responseUser = {
                    name: user.name,
                    email: user.email
                };
                await user.save();
                res.status(201).send(responseUser);

            } catch (e) {
                res.status(400).send(e);
            }
        }
    });

module.exports = router;

