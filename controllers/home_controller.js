const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (req, res) {
    try {
        //populater user for each
        const posts = await Post.find({})
        .sort("-createdAt")
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:"user likes",
            }
        }).populate('likes')
        // .exec();//
        const users = await User.find({})
        return res.render('home', {
            title: 'Connectopia | Home',
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log(err);
    }
}