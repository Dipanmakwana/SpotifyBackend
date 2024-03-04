const router = require("express").Router();
const passport = require("passport");
const PlaylistModel = require("../models/PlaylistModel.js");
const UserModel = require("../models/UserModel.js");
const SongModel = require("../models/SongModel.js");

// creation the playlist
router.post("/create", passport.authenticate("jwt", {session : false}),async(req, res)=>{
    try {
        const currentUser = req.user;
        const {name, thumbnail, songs} = req.body; 

        if(!name || !thumbnail || !songs)
            return res.status(400).json({
                message : "Please fill all the fields."
            })

        const playlist = await PlaylistModel.create({name, thumbnail, songs, owner : currentUser, colleborater : []});

        return res.status(200).json({
            message : "Playlist created succcessfully.",
            playlist
        })
    } catch (error) {
        console.log("Error in create playlist: ", error);
    }
})


// get all playlist made by me
router.get("/get/myPlaylist", passport.authenticate("jwt", {session : false}), async(req, res)=>{
    try {
        const artistId = req.user._id;

        const playlist = await PlaylistModel.find({owner : artistId}).populate("owner");
        if(!playlist)
            return res.status(400).json({message : "User Don't have any Playlist."});

        return res.status(200).json({message : "Playlist fetched successfully.", playlist});

    } catch (error) {
        console.log("Error while fetching the artist's playlists : ", error);
        return res.status(500).json({message : "Internal server error"});
    }
})

// Get all playlist
router.get("/get/allPlaylists/limit", async(req, res)=>{
    const playlistData = await PlaylistModel.find({}).limit(5);

    if(!playlistData)
        return res.status(400).json({"message" : "Playlist not found."})

    return res.status(200).send({data : playlistData});
})

router.get("/get/allPlaylists", async(req, res)=>{
    const playlistData = await PlaylistModel.find({});

    if(!playlistData)
        return res.status(400).json({"message" : "Playlist not found."})

    return res.status(200).send({data : playlistData});
})

// getting the playlist using id.
router.get(
    "/get/playlist/:playlistId", 
    passport.authenticate("jwt", {session : false}), 
    async (req, res)=>{
        const playlistId = req.params.playlistId;

        const playlist = await PlaylistModel.findOne({_id : playlistId}).populate({
            path: "songs",
            populate: { path: "artist" }
        })
        .populate("owner");
        
        if(!playlist)
            return res.status(400).json({
                message : "Playlist not found."
            })

        return res.status(200).json({
            message : "Song created successfully.",
            playlist
        })
    }
)


// add song to a playlist.
router.post("/add/song", passport.authenticate("jwt", {session : false}), async(req, res)=>{
    try {
        const currentUser = req.user;
        const {playlistId, songId} = req.body;

        const playlist = await PlaylistModel.findOne({_id : playlistId});

        if (!playlist) {
            return res.status(400).json({ message: "Playlist does not exist." });
        }

        if (!playlist.owner || !currentUser || !currentUser._id) {
            return res.status(400).json({ message: "User or playlist owner not found." });
        }
        
        if (!playlist.owner.equals(currentUser._id) && 
            !playlist.colleborater.includes(currentUser._id)) {
            return res.status(400).json({ 
                message: "User does not have permission to add songs to this playlist." 
            });
        }

        const song = await SongModel.findOne({_id : songId});
        if(!song)
            return res.status(400).json({message : "Song doen't Exist."});
        
        playlist.songs.push(songId);
        await playlist.save();

        return res.status(200).json({message : "Song added successfully.", playlist});

    } catch (error) {
        console.log("Error while adding song : ", error);
        return res.status(500).json({message : "Internal server error."});
    }
})

module.exports = router;