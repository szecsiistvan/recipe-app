const User = require('../models/user');
const {verify} = require('../token/tokenAuth');

const auth = async (req, res, next) => {

    if (!req.headers.cookie) {
        return res.status(401).send({error: 'Please authenticate.'});
    }

    const splitCookies = req.headers.cookie.split('token=');

    const token = splitCookies[1];

    const _id = verify(token).id;

    const user = await User.findOne({_id});

        try {

            if (!user) {
                throw new Error()
            }

            req.token = token;
            req.user = user;
            next();
        } catch (e) {

            res.status(401).send({error: 'Please authenticate.'})
        }

};

module.exports = auth;