const multer = require('multer');

exports.upload = () => {
    return multer({
    	limits: {
        	fileSize: 1000000
    	},
    	fileFilter (req, file, cb) {
	        // check if file ends with pnj gif or jpg
	        const r = /\.(png|jpg|gif|jpeg)$/ig;
	        if (!file.originalname.match(r)) {
	            return cb(new Error('this type of file is not allowed. upload an image instead'), false)
	        }
	        cb(null, true);
    	}
	});
}


exports.isUpdateAllowed = (data, updates) => {
	const dataKeys = Object.keys(data.toObject());
	const updateKeys = Object.keys(updates);
	const isAllowed = updateKeys.every( updateKey => dataKeys.includes(updateKey));
	if (!isAllowed) {
		throw new Error('unallowed updates');
	}
	return true;
}

module.exports = exports;