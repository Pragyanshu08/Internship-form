const JWT = require('jsonwebtoken');
const path = require("path");

const AdminAuth = async(req ,res , next)=>{
     try {
        
        const {adminToken} = req.cookies;
        if(!adminToken){
           throw new Error("no token found");
        }

        const decodedMessage = JWT.verify(adminToken , "JWT_SECRET");
        const {username , password} = decodedMessage;
        
         if(username !== 'admin' || password !== 'secret'){
               throw new Error("not authorized");
         }

        next();

     } catch (error) {
        res.send(error.message);
     }
}

module.exports =  AdminAuth;