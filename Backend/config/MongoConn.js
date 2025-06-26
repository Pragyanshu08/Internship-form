const mongoose = require('mongoose');

const DBconnection = async()=>{
    try{
         await mongoose.connect('mongodb://localhost:27017/Internship');
    }
    catch(err){
        console.error("Database connection failed:", err);
    }
}

module.exports = {DBconnection};