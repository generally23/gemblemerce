const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    profile: Buffer
});


userSchema.pre('save', modifyPassword);

// modify password before it gets saved

async function modifyPassword (next) {
    // get user
    const user = this;
    // check if user has changed pwd and hash it
    if (user.isModified('password')) {
        const password = await bcrypt.hash(user.password, 8);
        user.password = password;
        next();
    }
}

userSchema.methods.generateToken = async function () {
    // get the user
    const user = this;
    // sign the token with user id
    const token = jwt.sign({ id: user._id.toString() }, process.env.API_KEY);
    // return the token
    return token;
}

userSchema.statics.verifyCredentials = async function (email, password) {
    // get the user model
    const User = this;
    // try to find the user by email
    const user = await User.findOne({ email });
    // stop exec if no user found
    if (!user) {
        throw new Error('Access denied verify your credentials');
    }
    // verifiy if the password matches the password existing in db
    const isMatch = bcrypt.compare(password, user.password);
    // stop exec if no match
    if (!isMatch) {
        throw new Error('Access denied verify your credentials');
    }
    return user;
}

userSchema.pre('remove', async (next) => {
    const user = this;
    Product.deleteMany({seller: user.seller.toString()})
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userCopy = user.toObject();
    delete userCopy.profile;
    return userCopy;
}

module.exports = mongoose.model('User', userSchema);