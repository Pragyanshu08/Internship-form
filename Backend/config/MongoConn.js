require('dotenv').config(); 
const mongoose = require('mongoose');

const DBconnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    }
    catch(err){
        console.error("Database connection failed:", err);
        throw err;
    }
}

module.exports = {DBconnection};