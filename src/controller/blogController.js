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

/*1) Returns all blogs in the collection that aren't deleted and are published
  2) Return the HTTP status 200 if any documents are found. The response structure should be like this
  3) If no documents are found then return an HTTP status 404 with a response like this
  4) Filter blogs list by applying filters. Query param can have any combination of below filters.
            By author Id
            By category
            List of blogs that have a specific tag
            List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2*/

let getBlogs = async function (req, res) {
     try {
            let array = []
            let author_id = req.query.author_id
            let category = req.query.category
            let tags = req.query.tags
            let subcategory = req.query.subcategory
            let blogs = await blogModel.find({ $or: [{ author_id: author_id }, { category: category }, { tags: tags }, { subcategory: subcategory }] })
            console.log(blogs)
            if (blogs) {
                            console.log("hi")
                            for (let element of blogs) {
                            if (element.isDeleted === false && element.isPublished === true) {
                                array.push(element)
                            }
                    }   
                res.status(201).send({ status: true, data: array })
            }
            else {
                    res.status(400).send({ status: false, msg: "Element not found!!" })
                }
    } catch (error) {
        res.status(404).send({ status: false, msg: 'No documents are found!' })
        }
}

/*PUT /blogs/:blogId
    1) Updates a blog by changing its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
    2) Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
    3) Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like this
    4) Return an HTTP status 200 if updated successfully with a body like this
    5) Also make sure in the response you return the updated blog document*/

    const updateBlogs = async function (req, res) {
        // let userId = req.params.userId
        let email = req.body.email
        if (req.validToken._id == userId) {
          let userDetails = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { email: email }, { new: true })
          if (userDetails) {
            res.send({ status: true, msg: userDetails })
          } else {
            res.send({ status: false, msg: "userid not valid" })
          }
        } else {
          res.send({ msg: "invalid Token" })
        }
      };

module.exports.getBlogs = getBlogs;
module.exports.createBlogs = createBlogs;
module.exports.updateBlogs = updateBlogs;