const express = require('express');
const router = express.Router();
const upload = require('../utils').upload();

const auth = require('../auth');

const userHandlers = require('./handlers/userHandlers');

router.get('/:accountId', auth, userHandlers.getUser);

router.post(
    '/:accountId/profileImage',
    auth,
    upload.single('profileImage'),
    userHandlers.uploadPicture,
    (err, req, res, next) => err && res.send(err)
);

router.get('/:accountId/profileImage', userHandlers.getUserProfileImage);

router.post('/signup', userHandlers.signup);

router.post('/signin', userHandlers.signin);

router.patch('/:accountId', auth, userHandlers.updateAccount);

router.delete('/:accountId', auth, userHandlers.deleteAccount);

router.post('/logout', userHandlers.logout);

module.exports = router;








