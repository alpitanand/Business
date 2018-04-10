const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var userschema = new mongoose.Schema({
    id: String,
    email: String,
    name: String

})

var uploadSchema = new mongoose.Schema({
    Fbid: String,
    email: String,
    events: [{
        event: String,
        imageId: String
    }]
})

var likeSchema = new mongoose.Schema({
    imageId: String,
    email: String,
    Fbid: String,
    event:String,
    name:String,
    
    love:{type:Number, default:0},
    laugh:{type:Number, default:0},
    sad:{type:Number, default:0},

    total:{type:Number, default:0},

   voteArray:[{
       Fbid: String,
       react: String
   }]

})

likeSchema.plugin(mongoosePaginate);

var users = mongoose.model('fblogin', userschema);
var usersuploadImformation = mongoose.model('uploadImf', uploadSchema);
var likeImformation = mongoose.model('VotingImf', likeSchema)
module.exports = {
    users: users,
    usersuploadImformation: usersuploadImformation,
    likeImformation:likeImformation
}