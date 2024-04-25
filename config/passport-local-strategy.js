const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
}, 
    async function(req , email, password, done) {
        //find user and establish the identity
        try{
            const user = await User.findOne({ email:email});

            if(!user ||user.password !== password){
                // console.log("Invalid Username/Password");
                req.flash("error","Invalid Username/Password");
                return done(null ,false);
                // 2 parameter : 1. error 2.authentication 
            }
            return done(null ,user);
        }catch(err){
            // console.log("error in finding user");
            req.flash('error',err)
            return done(err);
        }
    
}
));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null ,user.id);   
});

//deserializing user from the key in the cookies
passport.deserializeUser(async function(id,done){
    try{
  const user = await User.findById(id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    }catch(err){
        console.log('Error in finding user --> Passport');
        return done(err);
    }
  
})


// check if user is authenticated 
passport.checkAuthentication = function(req,res,next){
    //if user is sign in then pass to request to next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not sign in
    return res.redirect('/users/sign-in');
}
//send user detail to controllers if user is authenticated
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current  signed in user from the session cookies and we are just sending to the local views
        res.locals.user = req.user
    }
    next();
}


module.exports = passport;