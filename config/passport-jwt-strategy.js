const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const { ExtractJwt } = require("passport-jwt");


let opts = {
    //header have set of key in which it have some bearer key set 
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "codeial"
}

passport.use(
    new JWTStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);


module.exports = passport;
