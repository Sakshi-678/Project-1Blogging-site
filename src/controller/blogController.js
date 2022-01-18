let blogModel = require('../models/blogModel');
let authorModel = require('../models/authorModel');
const { TokenExpiredError } = require('jsonwebtoken');

/* POST /blogs
        1: Create a blog document from request body. Get authorId in request body only.
        2: Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
        3: Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this
        3: Create atleast 5 blogs for each author
        4: Return HTTP status 400 for an invalid request with a response body like this*/

let createBlogs = async function (req, res) {
    try {
        let data = req.body
        let authorId = data.author_id
        if (req.validToken._id == authorId) {
            let authorReq = await authorModel.findById(authorId)

            let isPublish = data.isPublished

            if (isPublish === true) {
                data.publishedAt = Date.now()
            }

            if (authorReq) {
                let createBlog = await blogModel.create(data)
                res.status(201).send({ status: true, data: createBlog })
            } else {
                res.status(400).send({ status: false, msg: "Please enter valid authorId" })
            }
        } else {
            res.status(403).send({ status: false, msg: "invalid token!!" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};

/* GET /blogs
        1) Returns all blogs in the collection that aren't deleted and are published
        2) Return the HTTP status 200 if any documents are found. The response structure should be like this
        3) If no documents are found then return an HTTP status 404 with a response like this
        4) Filter blogs list by applying filters. Query param can have any combination of below filters.
                    *By author Id
                    *By category
                    *List of blogs that have a specific tag
                    *List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2*/

let getBlogs = async function (req, res) {
    try {
        let getQuery = {
            isDeleted: false,
            isPublished: true
        }
        if (req.query.author_id) {
            getQuery.author_id = req.query.author_id
        }
        if (req.query.tags) {
            getQuery.tags = req.query.tags
        }
        if (req.query.category) {
            getQuery.category = req.query.category
        }
        if (req.query.subcategory) {
            getQuery.subcategory = req.query.subcategory
        }
        let block = await blogModel.find(getQuery)
        if (block.length == 0) {
            res.status(400).send({ status: false, data: "Element not found!!" })
        }
        else {
            res.status(200).send({ status: true, msg: block })
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

/* PUT /blogs/:blogId
        1) Updates a blog by changing its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
        2) Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
        3) Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like this
        4) Return an HTTP status 200 if updated successfully with a body like this
        5) Also make sure in the response you return the updated blog document*/

const updateBlog = async function (req, res) {
    try {
        let body = req.body;
        let authorid = body.author_id;
        let id = req.params.blogId
        if (req.validToken._id == authorid) {
            let getAuthorId = await blogModel.findOne({ _id: id })
            if (!getAuthorId) {
                res.status(400).send({ status: false, message: "invalid BlogId!!!" })
            }
            if (body.hasOwnProperty("isPublished") == true) {
                let updatedValue = await blogModel.findOneAndUpdate({ _id: id, isDeleted: false },
                    {
                        $set: {
                            title: req.body.title,
                            body: req.body.body,
                            category: req.body.category,
                            isPublished: req.body.isPublished,
                            publishedAt: Date.now(),
                            updatedAt: Date.now()
                        },
                        $push: {
                            tags: req.body.tags,
                            subcategory: req.body.subcategory
                        }
                    }, { new: true })
                console.log(updatedValue)
                res.status(200).send({ msg: updatedValue });
            }
            else {
                let updatedValue = await blogModel.findOneAndUpdate({ _id: id, isDeleted: false },
                    {
                        $set: {
                            title: req.body.title,
                            body: req.body.body,
                            category: req.body.category,
                            updatedAt: Date.now()
                        },
                        $push: {
                            tags: req.body.tags,
                            subcategory: req.body.subcategory
                        }
                    }, { new: true })

                res.status(200).send({ msg: updatedValue });
            }
        } else {
            res.status(404).send({ status: false, message: 'invalid token' })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

/*DELETE /blogs/:blogId
    1)Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
    2)If the blog document doesn't exist then return an HTTP status of 404 with a body like this*/

const deleteById = async function (req, res) {
    try {
        let id = req.params.blogId
        let getAuthorId = await blogModel.findOne({ _id: id })
        let aId = getAuthorId.author_id;
        if (!getAuthorId) {
            res.status(400).send({ status: false, message: "invalid BlogId!!!" })
        }
        if (req.validToken._id == aId) {
            let data = await blogModel.findOne({ _id: id, isDeleted: false })
            if (data) {

                let deleteData = await blogModel.findOneAndUpdate({ _id: id },
                    { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
                res.status(200).send({ msg: deleteData })

            } else {
                res.send({ msg: "invalid input of id or the document is already delete" })
            }
        } else {
            res.status(403).send({ status: false, message: 'invalid token' })
        }
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

/* DELETE /blogs?queryParams
        Delete blog documents by category, authorid, tag name, subcategory name, unpublished
        If the blog document doesn't exist then return an HTTP status of 404 with a body like this*/

const deleteByQuery = async function (req, res) {
    try {
        let getQuery = {
            isDeleted: false
        }
        if (req.query.author_id) {
            getQuery.author_id = req.query.author_id
        }
        if (req.query.tags) {
            getQuery.tags = req.query.tags
        }
        if (req.query.category) {
            getQuery.category = req.query.category
        }
        if (req.query.subcategory) {
            getQuery.subcategory = req.query.subcategory
        }
        if (req.query.isPublished) {
            getQuery.isPublished = req.query.isPublished
        }
        let getAuthorId = await blogModel.find(getQuery)
        if (!getAuthorId) {
            res.status(400).send({ status: false, message: "invalid BlogId!!!" })
        }
        if (req.query.author_id == req.validToken._id) {

            let blogsData = []
            for (let i = 0; i < getAuthorId.length; i++) {
                let deleteData = await blogModel.findOneAndUpdate(getQuery,
                    { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

                blogsData.push(deleteData)
            }
            res.status(200).send({ msg: blogsData })
        } else {
            res.status(403).send({ status: false, message: 'invalid token' })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports.getBlogs = getBlogs;
module.exports.createBlogs = createBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteById = deleteById;
module.exports.deleteByQuery = deleteByQuery;