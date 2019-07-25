const fs = require('fs');
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync(__dirname + '/private.txt', 'utf8');
const publicKey = fs.readFileSync(__dirname + '/public.txt', 'utf8');

const sign = (id) => {

    const signOptions = {
        expiresIn: "30d",
        algorithm: "RS256"
    };

    const token = jwt.sign({id}, privateKey, signOptions);

    return token;
};

const verify = (tokenToVerify) => {

    const verifyOptions = {
        expiresIn: "30d",
        algorithm: ["RS256"]
    };

    try {
        return jwt.verify(tokenToVerify, publicKey, verifyOptions);

    } catch (err) {
        return false;
    }
};

module.exports = {sign, verify};



