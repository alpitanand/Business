var multer = require('multer');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('s3_config.json');
var s3 = new AWS.S3();
var multerS3 = require('multer-s3'),

storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './uploads/big');
    },
    filename: function (req, file, callback) {
        var  rand = Math.random().toString(36).substr(2, 12);
        req.rand =  rand;
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        req.ext = ext;
        callback(null, rand+'.jpg');
    }
});

var upload = multer({
    storage: storage
}).single('userPhoto');

// upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'bigfilepic',
//         metadata: function (req, file, cb) {
//           console.log("ALpit");
//             cb(null, {fieldName: file.fieldname});
          
//         },
//         key: function (req, file, cb) {
//             var  rand = Math.random().toString(36).substr(2, 12);
//                     req.rand =  rand;
//                     ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
//                     req.ext = ext;
//           cb(null,  rand+'.jpg')
//         }
//       })
//     }
// ).single('userPhoto');

module.exports = {
    upload: upload,
};
