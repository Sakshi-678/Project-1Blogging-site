const AuthorModel = require("../models/authorModel.js")
const jwt = require("jsonwebtoken")

/*Author APIs /authors
Create an author - atleast 5 authors
Create a author document from request body. Endpoint: BASE_URL/authors*/

const createAuthor = async function (req, res) {
  try {
    var data = req.body
    let savedData = await AuthorModel.create(data)
    res.status(201).send({ msg: savedData })
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}

/* POST /login
    Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId
    If the credentials are incorrect return a suitable error message with a valid HTTP status code*/

const login = async function (req, res) {
  try {
    let email = req.body.email
    let password = req.body.password

    let credentials = await AuthorModel.findOne({ email: email, password: password, isDeleted: false })

    if (credentials) {
      let payload = { _id: credentials._id }
      let token = jwt.sign(payload, "radium")
      res.header('x-api-key', token)
      res.status(200).send({ status: true, data: {_id:credentials._id, token: token }})
    } else {
      res.status(401).send({ msg: "User not found!! Please use valid details" })
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
};

module.exports.createAuthor = createAuthor
module.exports.login = login