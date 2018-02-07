const mongoose = require('mongoose');

var dataschema = mongoose.Schema({
    name:{
        type: String,
        min : 2,
        required : true
    },
    emailId :{
        type: String,
        min: 3,
        required: true
    }
})

var uploads = mongoose.model('Input_Data',dataschema);
module.exports = {
    uploads : uploads
}
