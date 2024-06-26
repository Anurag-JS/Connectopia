const passport = require('passport');
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");


//tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID: "672098762359-0evlr6vod6qp88f4djkeoghniguapu0d.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",

    },
    // accessToken is provide by google for authentication and refreshToken is generate when accessToken is expired
   async function(accessToken,refeshToken,profile,done){
       try {
           const user = await User.findOne({ email: profile.emails[0].value }).exec();
           //profile.emails give all emails that user contains
           
        //    console.log(profile);
           
           if (user) {
            // if user found set it to user as req.user
               return done(null, user);
           } else {
            // if not found,create user and set it to new user or req.user
               const newUser = await User.create({
                   name: profile.displayName,
                   email: profile.emails[0].value,
                   password: crypto.randomBytes(20).toString('hex')
               });

               return done(null, newUser);
           }
       } catch (err) {
           console.log("error in google strategy passport", err);
           return done(err);
       }
    }
))

module.exports = passport;