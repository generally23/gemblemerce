const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Local modules

const commentHandlers = require('./handlers/commentHandlers');

router.get('/:productId/comments', );

router.post('/:productId/comments', null);

router.patch('/:productId/comments/:commentId', null);

router.delete('/:productId/comments/:commentId', null);

module.exports = router;

