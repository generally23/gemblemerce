const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    pictures: [
       {
           picture: Buffer
       }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: String, // used or new
    category: {
        type: String,
        required: true
    },
    comments: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
});

productSchema.methods.toJSON = function () {
    const product = this;
    const productObject = product.toObject();
    delete productObject.pictures;
    delete productObject.seller.profile;
    delete productObject.seller.password;
    return productObject;
}

module.exports = mongoose.model('Product', productSchema)
