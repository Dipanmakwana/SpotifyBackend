const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,  
        required: true
    },
    lastname : {
        type : String,  
        required: true
    },
    username : {
        type : String,  
        required: true
    },
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String, 
        required : true
    },
    likedSongs : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Song"
        }
    ],
    likedPlaylists : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Song"
        }
    ],
    subscribeArtist : {
        type : String,
        default : ""
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;