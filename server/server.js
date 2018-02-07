const express = require('express');
const path = require('path');
var fs = require('fs');
var app = express();
var {
    mongoose
} = require('./models/mongoose.js');
var {
    uploads
} = require('./models/model.js');
var mustacheExpress = require('mustache-express');


//Image path




// Configuiring the port
var port = process.env.PORT || 3000;

//view engine setup
app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, '..', 'public/templets'));
app.set('view engine', 'mustache');


// Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));




//Listining
app.listen(port, () => {
    console.log("Server is up");
})