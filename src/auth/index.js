const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.API_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next()
    }
    catch (e) {
        res.status(401).send({ error: 'Access to resource denied. Authenticate and retry', e })
    }
}

module.exports = auth;
