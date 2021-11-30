const express = require('express');
const AuthorController = require("../controller/authorController")
const BlogController = require("../controller/blogController")
const router = express.Router();

//PHASE-1
router.post('/createAuthor',  AuthorController.createAuthor );
router.post('/createBlogs', BlogController.createBlogs);
router.get('/getBlogs', BlogController.getBlogs);
router.put('/updateBlogs/:blogId', BlogController.updateBlog);
router.delete('/deleteBlogs/:blogId', BlogController.deleteById);
router.delete('/deleteBlogsByQuery', BlogController.deleteByQuery);

module.exports = router;

