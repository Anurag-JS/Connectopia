const User = require("../models/user");
const fs = require("fs");
const path=require("path");

module.exports.profile = async function (req, res) {

    const user = await User.findById(req.params.id);
    return res.render('user_profile', {
        title: "user profile",
        profile_user: user
    });
}

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("Multer error ",err);
                }
                // console.log(req.file); 
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    //if avatar profile pic already available then delete it using fs and path
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                    }
                    // this is saving a path of the uploaded file into the avatar file in the user
                    //avatarPath is static var declared in user model 
                    user.avatar=User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                return res.redirect("back");
            });


        } catch (err) {
            console.log(err);
            req.flash('error',err);
            return res.redirect("back");
        }
    } else {
        req.flash('error','Unauthorized')
        return res.status(401).send("Unauthorized");
    }
}

// render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render('user_sign_up', {
        title: "Codial sign up",
    })
}

// render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render('user_sign_in', {
        title: "Codial sign in",
    })
}

// get the sign up details
module.exports.create = async function (req, res) {
    if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            // User with the same email already exists
            return res.redirect('back');
        }

        await User.create(req.body);
        return res.redirect('/users/sign-in');

    } catch (err) {
        console.log('Error in creating user:', err);
        return res.redirect('back');
    }
}

// sign up and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully')
    return res.redirect('/');

}

module.exports.destroySession = function (req, res) {

    req.flash('success', 'You have Logged out')
    req.logout(function (err) {
        if (err) {
            // Handle any potential errors
            console.error(err);
        }
    })

    return res.redirect('/')
}