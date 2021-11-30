const express = require('express');
const AuthorController = require("../controller/authorController")
const BlogController = require("../controller/blogController")
const router = express.Router();

router.post('/createAuthor',  AuthorController.createAuthor );
router.post('/createBlogs', BlogController.createBlogs);
router.get('/getBlogs', BlogController.getBlogs);
router.get('/updateBlogs', BlogController.updateBlogs);

module.exports = router;

