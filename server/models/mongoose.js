var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/Drips');
mongoose.connect('mongodb://alpit_anand:DBADBADBA1@ds119368.mlab.com:19368/business');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    mongoose : mongoose
}