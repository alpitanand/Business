var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './uploads/big');
    },
    filename: function (req, file, callback) {
        var  rand = Math.random().toString(36).substr(2, 12);
        req.rand =  rand;
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        req.ext = ext;
        callback(null, rand+ext);
    }
});

var upload = multer({
    storage: storage
}).single('userPhoto');

module.exports = {
    upload: upload,
};
