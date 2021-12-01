const AuthorModel = require("../models/authorModel.js")
const jwt = require("jsonwebtoken") 

/*Author APIs /authors
Create an author - atleast 5 authors
Create a author document from request body. Endpoint: BASE_URL/authors*/

const createAuthor= async function (req, res) {
    var data= req.body
    let savedData= await AuthorModel.create(data)
    res.send({msg: savedData})    
}

/* POST /login
    Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId
    If the credentials are incorrect return a suitable error message with a valid HTTP status code*/

const login = async function (req, res) {
    let email = req.body.email
    let password = req.body.password
  
    let credentials = await AuthorModel.findOne({ email: email, password: password, isDeleted: false })
  
    if (credentials) {
      let payload = { _id: credentials._id }
      let token = jwt.sign(payload, "radium")
      res.header('x-api-key',token)
      res.send({ status: true, data: credentials._id, token: token })
    } else {
      res.send({ msg: "User not found!! Please use valid details" })
    }
  };

module.exports.createAuthor= createAuthor
module.exports.login = login