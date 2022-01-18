const jwt = require("jsonwebtoken");

const checkAuthentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (token != null) {
            let decodedToken = jwt.verify(token, "radium")
            if (decodedToken) {
                req.validToken = decodedToken
                next()
            } else {
                res.status(403).send({ msg: "token is not verified" })
            }
        } else {
            res.status(400).send({ msg: "request is missing a mandatory token header" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message})
    }
}

module.exports.checkAuthentication = checkAuthentication