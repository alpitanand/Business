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
    usersuploadImformation,
    likeImformation
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
var {
    check
} = require('./authenticate');
var jimp = require('jimp');




////----------------------------------------------------/////
// This helper gaves "is" function in the template for rendering the right image in right event
var helpers = require('handlebars-helpers');
var compare = helpers.comparison({
    hbs: hbs
});
////----------------------------------------------------/////





////----------------------------------------------------/////
// This helper will give pagination option in handlebars
var paginate = require('handlebars-paginate');
hbs.registerHelper('paginate', paginate);
////----------------------------------------------------/////





////----------------------------------------------------/////
// Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'uploads')));
////----------------------------------------------------/////



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

app.get('/love/:id', (req, res) => {
    res.send("loved");
})

var place = "";

// app.get('/events/:event', check,(req, res) => {
//     place = req.params.event;
//    likeImformation.find({})
//             	          .exec(function(err, data){
//      if(data[0]==undefined){
//         res.render('event.hbs', {
//             name: req.user.displayName
//         });
//     }
//     else{
//         res.render('event.hbs', {
//             name: req.user.displayName,
//             event:data,
//             eventName:req.params.event,
//             pagination: {
//                 page: 1,
//                 pageCount: 10
//               }
//         });
//     }
//     })
// })

app.get('/events/:event/:page', (req, res) => {
    // var perPage = 20;
    var page = req.params.page;
    var event = req.params.event;
    var number_of_pages=1;
    
    
    likeImformation.count({
        "event": event
    },function(err, count){
        number_of_pages=count;
    })



    likeImformation.paginate(likeImformation.find({
        "event": event
    }), {
        sort: {
            _id: -1
        },
        page: page,
        limit: 20
    }, function (err, data) {
        if (data === undefined) {
            res.render('event.hbs', {
                name: req.user.displayName
            });
        } else {
            // console.log("*******************************************");
            // console.log(count + "*************" + "alpit");
            // console.log("*******************************************");
            var pageNumber =Math.ceil((number_of_pages) / 20)-1;
            res.render('event.hbs', {
                name: req.user.displayName,
                event: data.docs,
                eventName: req.params.event,
                pagination: {
                    page: page,
                    pageCount: pageNumber+1
                }

            });
        }
    })

})


app.post('/events/:event/upload', upload, function (req, res) {

    var fb_id = req.user.id;
    var email = req.user._json.email;
    var random = req.rand;
    var place = req.params.event;

    console.log(fb_id);

    var query = {
        'Fbid': fb_id
    }

    //   var update = {
    //         $set: {
    //             email: email
    //         },
    //         $push: {
    //             events: {
    //                 $each:[
    //                     {
    //                 event: place,
    //                 imageId: random
    //                     }
    //                 ],
    //                $slice: 3
    //             }
    //         }
    //     },
    //     options = {
    //         upsert: true
    //     };



    var voteDb = new likeImformation({
        'Fbid': fb_id,
        'imageId': random,
        "email": email,
        'event': place
    })


    jimp.read('./uploads/Big/' + random + req.ext, function (err, lenna) {
        if (err) throw err;
        lenna.quality(80)
            .scaleToFit(1024, 1024)
            .write('./uploads/Big/' + random + req.ext); // save
    });

    jimp.read('./uploads/Big/' + random + req.ext, function (err, lenna) {
        if (err) throw err;
        lenna.exifRotate()
            .cover(280, 320) // resize
            .quality(80) // set JPEG qualit
            .write('./uploads/Small/' + random + req.ext); // save

        // usersuploadImformation.findOneAndUpdate(query, update, options, function (err, data) {
        //     if (err) {
        //         console.log("Not able to update");
        //     } else {
        //         console.log("Updated");
        //     }
        // });

        likeImformation.find(query).find(function (err, data_of_user) {
            var count = 0;
            for (var i = 0; i < data_of_user.length; i++) {
                if (data_of_user[i].event === place) {
                    count++;
                }
            }


            if (count < 20) {
                console.log(data_of_user.length);
                voteDb.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("save");
                    }
                })
            }
        })


    });
res.status(200);
res.end('File have been uploded')
});


//Listining
app.listen(port, () => {
    console.log("Server is up");
})