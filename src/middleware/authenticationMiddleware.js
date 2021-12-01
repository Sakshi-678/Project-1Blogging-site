const jwt = require("jsonwebtoken");

const checkAuthentication= function (req, res, next) {
    let token=req.headers["x-api-key"]
    if(token!= null){
        let decodedToken=jwt.verify(token,"radium")
        if(decodedToken){
                req.validToken=decodedToken
                next()
        }else{
            res.send({msg:"token is not verified"})
        }
    }else{
        res.send({msg:"request is missing a mandatory token header"})
    } 

}

module.exports.checkAuthentication= checkAuthentication