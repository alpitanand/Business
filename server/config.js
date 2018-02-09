var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
// var {
//   users
// } = require('./models/model.js');

var serializeUser = passport.serializeUser(function (user, done) {
    done(null, user);
});

var deserializeUser = passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

facebook_login =  passport.use(new FacebookStrategy({
    clientID: 772833366242667,
    clientSecret: "2b4f9076fc32b3e25a2be3f8711e71c3",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email'],
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    process.nextTick(function () {
        //    var me = new users({
        //     email:profile.emails[0].value,
        //     name:profile.displayName,
        //     id: profile.id
        //    });
        //    user.findOne({email:me.email}, function(err, u) {
        //     if(!u) {
        //         me.save(function(err, me) {
        //             if(err) return done(err);
        //             done(null,me);
        //         });
        //     } else {
        //         console.log(u);
        //         done(null, u);
        //     }
        // });
        return done(null, profile);
    });
}));




module.exports={
 facebook_login: facebook_login,
 serializeUser : serializeUser,
 deserializeUser: deserializeUser
}