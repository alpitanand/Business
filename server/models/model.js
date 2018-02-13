const mongoose = require('mongoose');

var dataschema = mongoose.Schema({
    id: String,
    email: String,
    name: String

})

var users = mongoose.model('fblogin', dataschema);
module.exports = {
    users: users
}