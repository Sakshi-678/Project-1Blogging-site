const AuthorModel = require("../models/authorModel.js")

//To create Author
const createAuthor= async function (req, res) {
    var data= req.body
    let savedData= await AuthorModel.create(data)
    res.send({msg: savedData})    
}


module.exports.createAuthor= createAuthor