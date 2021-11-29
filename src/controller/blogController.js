const BlogModel = require("../models/blogModel.js")
const AuthorModel = require("../models/authorModel.js")
const blogModel = require("../models/blogModel.js")

/*
1: Create a blog document from request body. Get authorId in request body only.
2: Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
3: Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this
3: Create atleast 5 blogs for each author
4: Return HTTP status 400 for an invalid request with a response body like this*/

const createBlog = async function (req, res) {
    try {
        const blog = req.body
        let authorId = blog.author_id
            let isPublish = blog.ispublished
            let setPublish
            if(isPublish == 'true'){
                setPublish = Date()
            }
        let getBlogById = await AuthorModel.findById(authorId)
        if (getBlogById) {
            let OrderObj ={
                title : blog.title,
                body : blog.body,
                author_id : blog.author_id,
                tags : blog.tags,
                category : blog.category,
                subcategory : blog.subcategory,
                deletedAt : blog.deletedAt,
                isDeleted : blog.isDeleted,
                publishedAt : setPublish,
                ispublished : blog.ispublished
            }
            let blogCreated = await BlogModel.create(OrderObj)
            res.status(201).send({ status: true, msg: "Success", blog: blogCreated })
        } else {
            res.status(400).send({ status: false, msg: "Enter a valid authorId" })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    
}
}

module.exports.createBlog = createBlog