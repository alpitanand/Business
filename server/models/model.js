const mongoose = require('mongoose');

var dataschema = mongoose.Schema({
    id:String,
    email:String,
    name:String

})

var users = mongoose.model('Input_Data',dataschema);
module.exports = {
    users : users
}
