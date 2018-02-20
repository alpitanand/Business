const mongoose = require('mongoose');

var userschema = mongoose.Schema({
    id: String,
    email: String,
    name: String

})

var uploadSchema = mongoose.Schema({
    Fbid: String,
    email: String,
    events: [{
        event: String,
        imageId: String
    }]

})

var users = mongoose.model('fblogin', userschema);
var usersuploadImformation = mongoose.model('uploadImf', uploadSchema);
module.exports = {
    users: users,
    usersuploadImformation: usersuploadImformation
}