const express = require('express');
const AuthorController = require("../controller/authorController")
const BlogController = require("../controller/blogController")
const router = express.Router();

router.post('/createAuthor',  AuthorController.createAuthor );
router.post('/createBlogs', BlogController.createBlogs);

module.exports = router;

