const mongoose = require('mongoose');
const validator = require('validator');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email format');
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password should not contain the word password');
                }
            }
        }, role: {
            type: String,
            uppercase: true,
            default: 'NORMAL',
            validator(value) {
                if (value.uppercase() !== 'ADMIN' || value.uppercase() !== 'NORMAL') {
                    throw new Error('Invalid role');
                }
            }
        }, tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },
    {
        timestamps: true
    });

const User = mongoose.model('User', userSchema);

module.exports = User;


