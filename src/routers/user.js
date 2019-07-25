const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const {sign} = require('../token/tokenAuth');
const router = new express.Router();


// create user
router
    .post('/users', async (req, res) => {

        const userID = mongoose.Types.ObjectId();
        const token = sign(userID);
        if (req.body.password.length < 8 || req.body.password.includes("password")) {
            return res.status(400).send();
        }

        if (req.body.role) {
            if (req.body.role.toUpperCase() !== 'ADMIN' || req.body.role.toUpperCase() !== 'NORMAL') {
                return res.status(400).send();
            }
        }


        const password = await bcrypt.hash(req.body.password, 8);

        const user = new User({
            _id: userID,
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: password,
        });

        const userWithEmail = await User.findOne({email: req.body.email});

        if (userWithEmail) {
            return res.status(400).send(`${req.body.email} is already used.`);
        } else {
            try {

                res.cookie('token', token, {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
                const responseUser = {
                    email: user.email,
                };
                await user.save();

                res.status(201).send(responseUser);

            } catch (e) {
                res.status(400).send(e);
            }
        }
    });

router
    .get('/users/me', auth, async (req, res) => {

        console.log(req.user);


        try {

            const responseUser = {
                name: req.user.name,
                email: req.user.email,
            };

            res.status(200).send(responseUser);


        } catch (e) {

        }

    });


// login user
router
    .post('/users/login', async (req, res) => {

        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).send('No such email registered');
        }


        let isUserValid;
        try {
            isUserValid = await bcrypt.compare(req.body.password, user.password);
        } catch (e) {
            throw new Error(e);
        }

        if (isUserValid) {
            try {
                const token = sign(user._id);
                res.cookie('token', token, {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});

                const responseUser = {
                    email: user.email,
                };

                await user.save();

                res.status(200).send(responseUser);
            } catch (e) {
                res.status(400).send(e);
            }
        } else {
            res.status(400).send();
        }
    });


// logout user
router
    .post('/users/logout', auth, async (req, res) => {

        res.cookie('token', "", {maxAge: +0});

        res.status(200).send('User logged out');

        console.log('ok');

        try {


        } catch (e) {

        }
    });

// modify user
router
    .put('/users/me', auth, async (req, res) => {

        if (req.body.password && (req.body.password.length < 8 || req.body.password.includes("password"))) {
            return res.status(401).send();
        }

        if (req.body.role) {
            if (req.body.role.toUpperCase() !== 'ADMIN' || req.body.role.toUpperCase() !== 'NORMAL') {

                return res.status(402).send();
            }
        }

        if (req.body.name) {
            req.user.name = req.body.name;
        }
        if (req.body.email) {
            req.user.email = req.body.email;
        }

        let isPasswordModified;

        if (req.body.password) {

            try {
                isPasswordModified = await bcrypt.compare(req.user.password, req.body.password);
            } catch (e) {
                return res.status(401).send('password error1');
            }
        }

        if (isPasswordModified) {
            if (req.body.password.length < 8 || req.body.password.includes("password")) {
                return res.status(402).send('password error2');
            }
            req.user.password = await bcrypt.hash(req.body.password, 8);
        }

        // if (req.user.role !== req.body.role) {
        //     if (req.body.role || req.body.role.toUpperCase() !== 'ADMIN' || req.body.role.toUpperCase() !== 'NORMAL') {
        //         return res.status(400).send('role error');
        //     } else {
        //         userToSave.role = req.body.role;
        //     }
        // };

        try {
            await req.user.save();
            res.status(200).send('Modification saved' + req.user);

        } catch (e) {
            res.status(403).send(e);
        }
    });


// delete user
router
    .delete('/users/me', auth, async (req, res) => {

        try {

            await req.user.remove();

            res.status(200).send(req.user.email);

        } catch (e) {

        }
    });

module.exports = router;

