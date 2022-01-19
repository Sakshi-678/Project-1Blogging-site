const express = require('express');
const AuthorController = require("../controller/authorController")
const BlogController = require("../controller/blogController")
const AuthenticationMiddleware = require("../middleware/authenticationMiddleware")
const router = express.Router();

//PHASE-1
router.post('/createAuthor',AuthorController.createAuthor );
router.post('/createBlogs',AuthenticationMiddleware.checkAuthentication,BlogController.createBlogs);
router.get('/getBlogs',AuthenticationMiddleware.checkAuthentication,BlogController.getBlogs);
router.put('/updateBlogs/:blogId',AuthenticationMiddleware.checkAuthentication,BlogController.updateBlog);
router.delete('/deleteBlogs/:blogId',AuthenticationMiddleware.checkAuthentication,BlogController.deleteById);
router.delete('/deleteBlogsByQuery',AuthenticationMiddleware.checkAuthentication,BlogController.deleteByQuery);

//PHASE-2
router.post('/login',AuthorController.login)

module.exports = router;

