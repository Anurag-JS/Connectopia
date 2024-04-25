const express = require("express");
const router = express.Router();

router.use('/posts',require("./posts"));

//route index => api index => v1 index => v1 posts =>refer to controllers api v1 posts
router.use('/users', require("./users"));


module.exports = router;