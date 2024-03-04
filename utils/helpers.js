const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getToken = async (email, user) =>{
    try {
        const token = await jwt.sign({identifier : user._id}, process.env.SECRETKEY);
        return token;
    } catch (error) {
        console.log(error);
    }
}