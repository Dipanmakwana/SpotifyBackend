const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    name : {
        type : String,  
        required: true
    },
    thumbnail : {
        type : String,  
        required: true
    },
    owner : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    songs : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Song"
        }
    ],
    colleborater : [
        {
            type : mongoose.Types.ObjectId,
            ref : "User"
        }
    ]
});

const PlaylistModel = mongoose.model("Playlist", playlistSchema);

module.exports = PlaylistModel;