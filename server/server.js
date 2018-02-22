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
    usersuploadImformation
} = require('./models/model.js');
var {
    facebook_login,
    serializeUser,
    deserializeUser
} = require('./config.js');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var {
    upload
} = require('./file-upload.js');
var jimp = require('jimp');

// Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));


app.use(session({
    secret: "enter custom sessions secret here",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(passport.initialize());

app.use(passport.session());




// Configuiring the port
var port = process.env.PORT || 3000;

//Setting view engine
app.set('view engine', 'hbs');



app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
}));

app.get('/', (req, res) => {
    if (req.user != undefined) {
        res.render('competition.hbs', {
            name: req.user.displayName
        });
    } else {
        res.sendFile(path.join(__dirname, '..', 'views/index.html'))
    }

})

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/loggedIn',
        failureRedirect: '/'
    }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/loggedIn', (req, res) => {
    res.render('competition.hbs', {
        name: req.user.displayName
    });
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

var place = "";
app.get('/events/:event', (req, res) => {
    place = req.params.event;
    res.render('event.hbs', {
        name: req.user.displayName
    });
})


app.post('/events/upload', upload, function (req, res) {

    var fb_id = req.user.id;
    var email = req.user._json.email;
    var random = req.rand;

    console.log(fb_id);

    var query = {
            'Fbid': fb_id
        },
        update = {
            $set: {
                email: email
            },
            $push: {
                events: {
                    event: place,
                    imageId: random
                }
            }
        },
        options = {
            upsert: true
        };

    usersuploadImformation.findOneAndUpdate(query, update, options, function (err, data) {
        if (err) {
            console.log("Not able to update");
        } else {
            console.log("Updated");
        }
    });


    jimp.read('./uploads/Big/' + random + req.ext, function (err, lenna) {
        if (err) throw err;
        lenna.quality(60)
            .scaleToFit(1024, 1024)
            .write('./uploads/Big/' + random + req.ext); // save
    });

    jimp.read('./uploads/Big/' + random + req.ext, function (err, lenna) {
        if (err) throw err;
        lenna.scaleToFit(256, 256) // resize
            .quality(60) // set JPEG qualit             
            .write('./uploads/Small/' + random + req.ext); // save
    });
});


//Listining
app.listen(port, () => {
    console.log("Server is up");
})