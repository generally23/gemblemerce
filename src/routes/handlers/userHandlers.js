const User = require('../../models/user');
const sharp = require('sharp');
const utils = require('../../utils');

exports.signup = async ( req, res, next ) => {
    // create new user doc
    const user = new User( req.body );
    try {
        // save user doc in db
        await user.save();
        // get token for this user
        const token = await user.generateToken();
        // send user and token back
        res.send({ user, token });
    } catch ( e ) {
        // respond with error in case something goes wrong
        next(e)
    }
}

exports.signin = async ( req, res, next ) => {
    // collect data from user
    const { email, password } = req.body;
    // verify user email and password
    try {
        const user = await User.verifyCredentials( email, password );
        const token = await user.generateToken();
        res.send({ user, token });
    } catch ( e ) {
        next(e)
    }
}

exports.logout = async (req, res, next) => {
    req.user = undefined;
}

exports.getUser = async ( req, res, next ) => {
    try {
        const user = await User.findById(req.params.accountId);
        res.send(user);
    } catch (e) {
        next(e);
    } 
}

exports.uploadPicture = async ( req, res, next ) => {
    // get current signed in user
    const user = req.user;
    // get uploaded img and transform it
    const profileImg = await sharp(req.file.buffer).resize({ width: 150, height: 150 }).png().toBuffer();
    // set profile to uploaded img
    user.profile = profileImg;
    try {
        // save user to db
        await user.save();
        res.send({ succes: 'profile image successfully uploaded' });
    } catch ( e ) {
        next(e)
    }
}

exports.getUserProfileImage = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.accountId);

        res.set('Content-Type', 'image/*');

        res.send(user.profile);  
    } catch (e) {
        next(e)
    }
}

exports.updateAccount = async (req, res, next) => {
    const user = req.user;
    try {
        utils.isUpdateAllowed(req.user, req.body);
        for (let key in req.body) {
            user[key] = req.body[key];
        }
        await user.save();
        res.send(user);
    } catch (e) {
        next(e);
    }
}

exports.deleteAccount = async ( req, res, next ) => {
    try {
        await User.deleteOne({ _id: req.params.accountId });
        res.send(req.user); 
    } catch (e) {
        next(e);
    }  
}

module.exports = exports;



