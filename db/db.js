require("dotenv").config();
const mongoose = require("mongoose");

const ConnectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        console.log("Database Connected Successfully.");
    } catch (error) {
        console.log("Error from DB Connection : ", error);
    }
} 

module.exports = ConnectDB;