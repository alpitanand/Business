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

app.get('/:id/love', (req, res) => {
    console.log("Hitting");
    var image_Id = req.params.id;
    var fb_id = req.user.id;
    var query = {
        "imageId": image_Id
    }
    var upvote = {
        $inc: {
            love: 1
        },
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"love"
            }
        }
    }

    var downvote = {
        $pull: {
            "voteArray":{
                Fbid:fb_id,
                react:"love"
            }
        },
        $inc: {
            love: -1
        }
    }

    var changeLaugh = {
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"love"
            }
        },
        $inc:{
            love:1
        }
    }

var changeLaughPull = {
    $pull: {
        "voteArray":{
            Fbid:fb_id,
            react:"laugh"
        }
    },
    $inc: {
        laugh: -1
    },
}
    var changeSadPull = {
        $pull: {
            "voteArray":{
                Fbid:fb_id,
                react:"sad"
            }
        },
        $inc: {
            sad: -1
        }
    }

    var changeSad = {
      
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"love"
            }
        },
       
        $inc:{
            love:1
        }
    }

    likeImformation.find({
        $and:[{
            "imageId": image_Id
        },{
            "voteArray.Fbid":fb_id
        }]
    },function(err,data){
        if(data.length===0){
            likeImformation.findOneAndUpdate(query, upvote, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("upvoted");
                                res.send("upvoted");
                            }
                });
        }
        else if(data.length>0){
            console.log("its already there "+data[0].voteArray.length);
            for(var z = 0; z<data[0].voteArray.length; z++){
                if(data[0].voteArray[z].Fbid === fb_id){
                    if(data[0].voteArray[z].react==="love"){
                        likeImformation.findOneAndUpdate(query, downvote, function (err, voted) {
                                        if (err) {
                                            res.status(404)
                                        } else {
                                            console.log("downvoted");
                                            res.send("downvoted");
                                        }
                             });
                    }
                   else if(data[0].voteArray[z].react === "laugh"){
                       console.log("laughed");
                       likeImformation.findOneAndUpdate(query,changeLaughPull,function(err, pulled){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("laughPulled");
                           
                        }
                       })
                        likeImformation.findOneAndUpdate(query, changeLaugh, function (err, voted) {
                            if (err) {
                                console.log(err);
                                res.status(404)
                            } else {
                                console.log("downLaugh");
                                res.send("downLaugh");
                            }
                 });
                    }

                    else if(data[0].voteArray[z].react === "sad"){

                        likeImformation.findOneAndUpdate(query, changeSadPull, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("Sadness pulled");
                                
                            }
                 });
                        likeImformation.findOneAndUpdate(query, changeSad, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("changeSad");
                                res.send("downSad");
                            }
                 });
                    }

                }
            }
        }
    })
})


app.get('/:id/laugh', (req, res) => {
    console.log("Hitting laugh");
    var image_Id = req.params.id;
    var fb_id = req.user.id;
    var query = {
        "imageId": image_Id
    }
    var upvote = {
        $inc: {
            laugh: 1
        },
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"laugh"
            }
        }
    }

    var downvote = {
        $pull: {
            "voteArray":{
                Fbid:fb_id,
                react:"laugh"
            }
        },
        $inc: {
            laugh: -1
        }
    }

    var changeLove = {
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"laugh"
            }
        },
        $inc:{
            laugh:1
        }
    }

var changeLovePull = {
    $pull: {
        "voteArray":{
            Fbid:fb_id,
            react:"love"
        }
    },
    $inc: {
        love: -1
    },
}
    var changeSadPull = {
        $pull: {
            "voteArray":{
                Fbid:fb_id,
                react:"sad"
            }
        },
        $inc: {
            sad: -1
        }
    }

    var changeSad = {
      
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"laugh"
            }
        },
       
        $inc:{
            laugh:1
        }
    }

    likeImformation.find({
        $and:[{
            "imageId": image_Id
        },{
            "voteArray.Fbid":fb_id
        }]
    },function(err,data){
        if(data.length===0){
            likeImformation.findOneAndUpdate(query, upvote, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("upvoted");
                                res.send("laughed");
                            }
                });
        }
        else if(data.length>0){
            console.log("its already there "+data[0].voteArray.length);
            for(var z = 0; z<data[0].voteArray.length; z++){
                if(data[0].voteArray[z].Fbid === fb_id){
                    if(data[0].voteArray[z].react==="laugh"){
                        likeImformation.findOneAndUpdate(query, downvote, function (err, voted) {
                                        if (err) {
                                            console.log(err);
                                            res.status(404)
                                        } else {
                                            console.log("downvoted");
                                            res.send("notlaughed");
                                        }
                             });
                    }
                   else if(data[0].voteArray[z].react === "love"){
                       console.log("laughed");
                       likeImformation.findOneAndUpdate(query,changeLovePull,function(err, pulled){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("laughPulled");
                           
                        }
                       })
                        likeImformation.findOneAndUpdate(query, changeLove, function (err, voted) {
                            if (err) {
                                console.log(err);
                                res.status(404)
                            } else {
                                console.log("downLove");
                                res.send("downLove");
                            }
                 });
                    }

                    else if(data[0].voteArray[z].react === "sad"){

                        likeImformation.findOneAndUpdate(query, changeSadPull, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("Sadness pulled");
                                
                            }
                 });
                        likeImformation.findOneAndUpdate(query, changeSad, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("changeSad");
                                res.send("downSad");
                            }
                 });
                    }

                }
            }
        }
    })
})

app.get('/:id/sad', (req, res) => {
    console.log("Hitting laugh");
    var image_Id = req.params.id;
    var fb_id = req.user.id;
    var query = {
        "imageId": image_Id
    }
    var upvote = {
        $inc: {
            sad: 1
        },
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"sad"
            }
        }
    }

    var downvote = {
        $pull: {
            "voteArray":{
                Fbid:fb_id,
                react:"sad"
            }
        },
        $inc: {
            sad: -1
        }
    }

    var changeLove = {
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"sad"
            }
        },
        $inc:{
            sad:1
        }
    }

var changeLovePull = {
    $pull: {
        "voteArray":{
            Fbid:fb_id,
            react:"love"
        }
    },
    $inc: {
        love: -1
    },
}
    var changeLaughPull = {
        $pull: {
            "voteArray":{
                Fbid:fb_id,
                react:"laugh"
            }
        },
        $inc: {
            laugh: -1
        }
    }

    var changeLaugh = {
      
        $push: {
            "voteArray":{
                Fbid:fb_id,
                react:"sad"
            }
        },
       
        $inc:{
            sad:1
        }
    }

    likeImformation.find({
        $and:[{
            "imageId": image_Id
        },{
            "voteArray.Fbid":fb_id
        }]
    },function(err,data){
        if(data.length===0){
            likeImformation.findOneAndUpdate(query, upvote, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("upvoted");
                                res.send("sad");
                            }
                });
        }
        else if(data.length>0){
            console.log("its already there "+data[0].voteArray.length);
            for(var z = 0; z<data[0].voteArray.length; z++){
                if(data[0].voteArray[z].Fbid === fb_id){
                    if(data[0].voteArray[z].react==="sad"){
                        likeImformation.findOneAndUpdate(query, downvote, function (err, voted) {
                                        if (err) {
                                            console.log(err);
                                            res.status(404)
                                        } else {
                                            console.log("downvoted");
                                            res.send("notSad");
                                        }
                             });
                    }
                   else if(data[0].voteArray[z].react === "love"){
                       console.log("laughed");
                       likeImformation.findOneAndUpdate(query,changeLovePull,function(err, pulled){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("laughPulled");
                           
                        }
                       })
                        likeImformation.findOneAndUpdate(query, changeLove, function (err, voted) {
                            if (err) {
                                console.log(err);
                                res.status(404)
                            } else {
                                console.log("downLove");
                                res.send("downLove");
                            }
                 });
                    }

                    else if(data[0].voteArray[z].react === "laugh"){

                        likeImformation.findOneAndUpdate(query, changeLaughPull, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("laugh pulled");
                                
                            }
                 });
                        likeImformation.findOneAndUpdate(query, changeLaugh, function (err, voted) {
                            if (err) {
                                res.status(404)
                            } else {
                                console.log("changeSad");
                                res.send("downLaugh");
                            }
                 });
                    }

                }
            }
        }
    })
})


    // likeImformation.find({
    //     $and: [{
    //         "imageId": image_Id
    //     }, {
    //         "votedBy": fb_id
    //     }]
    // }).count(function (err, count_num) {
    //     if (count_num === 0) {
    //         likeImformation.findOneAndUpdate(query, upvote, function (err, voted) {
    //             if (err) {
    //                 res.status(404)
    //             } else {
    //                 console.log("upvoted");
    //                 res.send("upvoted");
    //             }
    //         });
    //     } else if (count_num > 0) {
    //         console.log(count_num);
    //         likeImformation.findOneAndUpdate(query, downvote, function (err, voted) {
    //             if (err) {
    //                 res.status(404)
    //             } else {
    //                 console.log("downupvoted");
    //                 res.send("downvoted");
    //             }
    //         });
    //     }
    // })


    //     if (likeImformation.find({
    //             "imageId": image_Id
    //         }, {
    //             "votedBy": fb_id
    //         }).count() == 0) {
    // console.log("ALpit is awesome");
    //         likeImformation.findOneAndUpdate(query, upvote, function (err, voted) {
    //             if (err) {
    //                 res.status(404)
    //             } else {

    //                 res.send("upvoted");
    //             }
    //         });
    //     } else if (likeImformation.find({
    //             "imageId": image_Id
    //         }, {
    //             "votedBy": fb_id
    //         }).count() > 0) {
    //         likeImformation.findOneAndUpdate(query, downvote, function (err, voted) {
    //             if (err) {
    //                 res.status(404)
    //             } else {

    //                 res.send("downvoted");
    //             }
    //         });

    //     }






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
    var number_of_pages = 1;


    likeImformation.count({
        "event": event
    }, function (err, count) {
        number_of_pages = count;
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
            // console.log(data.docs[0].vote);
            // console.log("*******************************************");
            var pageNumber = Math.ceil((number_of_pages) / 20);
        
         //     var rankArr=[];
        //     for(var j=0;j<data.docs.length;j++){
        //         var x = data.docs[j].vote;
        //         likeImformation.find({$and:[{"event":event},{ vote: { $gt: x } } ] }).count(function(e,c){
        //            rankArr.push(c);
        //    })
        //     }
           
            res.render('event.hbs', {
                name: req.user.displayName,
                event: data.docs,
                eventName: req.params.event,
                pagination: {
                    page: page,
                    pageCount: pageNumber
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