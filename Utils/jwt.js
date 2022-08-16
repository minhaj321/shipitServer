const jwt = require('jsonwebtoken');

exports.generateAccessToken = (email,token) =>
{
    return jwt.sign({email},token,{expiresIn:"20h"});
}