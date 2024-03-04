const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    name : {
        type : String,  
        required: true
    },
    thumbnail : {
        type : String,  
        required: true
    },
    track : {
        type : String,  
        required: true
    },
    duration : {
        type : String,
        required : true
    },
    artist : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    }
});

const SongModel = mongoose.model("Song", songSchema);

module.exports = SongModel;