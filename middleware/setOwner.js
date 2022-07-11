 const jwt = require('jsonwebtoken');
 const config = require('config');
 
 
 module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    req.body.owner = jwt.verify(token, config.get('jwtPrivateKey'))._id;
    next();
 }