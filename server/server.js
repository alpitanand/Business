const express = require('express');
const path = require('path');
const hbs = require('hbs');
var multer = require('multer');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var {
    mongoose
} = require('./models/mongoose.js');
var {
    users
} = require('./models/model.js');
var {
    facebook_login
} = require('./config.js');
var {serializeUser} = require('./config.js');
var {deserializeUser} = require('./config.js');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;



app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());




// Configuiring the port
var port = process.env.PORT || 3000;

//Setting view engine
app.set('view engine', 'hbs');


// Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));
  
  
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    }),
    function (req, res) {
      res.redirect('/');
    });




app.get('/selfie', (req, res) => {
    res.render('competition.hbs');
})


//Listining
app.listen(port, () => {
    console.log("Server is up");
})