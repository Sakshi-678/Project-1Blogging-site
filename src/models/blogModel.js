const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author_id: {
        type: ObjectId,
        ref: 'Author'
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subcategory: [String],
    deletedAt: {
        type : Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type : Date
    },
    ispublished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

module.exports = mongoose.model('blog', blogSchema)