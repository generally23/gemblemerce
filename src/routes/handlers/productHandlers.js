
const Product = require('../../models/product');
const utils = require('../../utils');

exports.getProducts = async ( req, res, next ) => {
    try {
        // find all products
        const products = await Product.find().populate('seller').exec();
        // send back the products
        res.send( products )
    } catch ( e ) {
        next(e)
    }
};
exports.createProduct = async ( req, res, next ) => {
    // create a new product with the user data
    const product = new Product( req.body );
    // relate the product to it's owner
    product.seller = req.user._id;
    try {
        // save it to database
        await product.save();
        // send it as response
        res.status( 201 ).redirect('/products');
    } catch ( e ) {
        next(e);
    }
};

exports.updateProduct = async (req, res, next) => {
    // get product id
    const { productId } = req.params;
    try {
        // try to find product with Pid;
        const product = await Product.findById(productId);
        // check if all keys in body exist keys from db and allow update
        const isUpdateAllowed = utils.isUpdateAllowed(product, req.body);
        // make updates
        for (let key in req.body) {
            product[key] = req.body[key];
        }
        // save product
        await product.save();
        // send product back
        res.send( product );
    } catch (e) {
        next(e);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete( productId );
        res.send( deletedProduct )
    } catch ( e ) {
        next(e);
    }
};

exports.uploadProductPictures = async (req, res, next) => {
    // get the id of the product
    const { productId } = req.params;
    try {
        // map and return an array of buffer image object
        const pictures = req.files.map( picture => ( { picture: picture.buffer }));
        // try to find a product with this id
        const product = await Product.findById(productId);
        if (product) {
            // check if the product's pictures field does not exceed required imgs limits
            if (product.pictures.length >= 3) {
                throw new Error();
            }
            // add the images inside the pictures field
            product.pictures = [...product.pictures, ...pictures];
            // save it to Database
            await product.save();
            // send the product back
            return res.send(product);
        } 

    } catch (e) {
        next(e)
    }
}


exports.getProductImages = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        res.set('Content-Type', 'image/png');
        const productImage = product.pictures[req.params.imageId].picture;
        res.send(productImage)
    } catch (e) {
        next(e)
    }
}

module.exports = exports;












