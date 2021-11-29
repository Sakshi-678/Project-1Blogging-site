let blogModel = require('../models/blogModel');
let authorModel = require('../models/authorModel');

/*
1: Create a blog document from request body. Get authorId in request body only.
2: Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
3: Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this
3: Create atleast 5 blogs for each author
4: Return HTTP status 400 for an invalid request with a response body like this*/


// let isPublish = blog.ispublished
//     if(isPublish == 'true'){
//         blog.publishedAt = Date()
//     }

let createBlogs = async function (req, res) {
    try {
        let data = req.body
        console.log(data)
        let authorId = data.author_id
        let authorReq = await authorModel.findById(authorId)

         let isPublish = data.isPublished
         console.log(isPublish)
             if (isPublish === true) {
                 data.publishedAt = Date.now()
             }

        if (authorReq) {
            let createBlog = await blogModel.create(data)
            res.status(201).send({ status: true, data: createBlog })
        } else {
            res.status(400).send({ status: false, msg: "Please enter valid authorId" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: 'somthing unexpected heppend!' })
    }
};

module.exports.createBlogs = createBlogs;