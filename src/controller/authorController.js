const AuthorModel = require("../models/authorModel.js")

/*Author APIs /authors
Create an author - atleast 5 authors
Create a author document from request body. Endpoint: BASE_URL/authors*/

const createAuthor= async function (req, res) {
    var data= req.body
    let savedData= await AuthorModel.create(data)
    res.send({msg: savedData})    
}

module.exports.createAuthor= createAuthor