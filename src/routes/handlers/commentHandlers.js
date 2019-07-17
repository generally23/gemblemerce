const express = require('express');


/* LOCAL MODULES */
const Product = require('../../models/product');
const Comment = require('../../models/comment');

exports.fetchComments = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate('comments');
        res.send(product.comments);
    } catch (e) {
        next(e);
    }  
}

