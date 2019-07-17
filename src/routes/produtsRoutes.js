const express = require('express');
const router = express.Router();

/* @@ Local modules @@ */
const upload = require('../utils').upload();
const auth = require('../auth');
const productHandlers = require('./handlers/productHandlers');

/* @@ Routes @@ */

router.get('', productHandlers.getProducts);

router.post('', auth, productHandlers.createProduct);
    
router.patch('/:productId', auth, productHandlers.updateProduct);

router.delete('/:productId', auth, productHandlers.deleteProduct);

router.post('/:productId/images', auth, upload.array('images', 3), productHandlers.uploadProductPictures, (err, req, res, next) => {
    if (err) {
        next(err)
    }
});

router.get('/:productId/images/:imageId', productHandlers.getProductImages);

module.exports = router; 


