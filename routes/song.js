const router = require("express").Router();
const passport = require("passport");
const SongModel = require("../models/SongModel");
const UserModel = require("../models/UserModel");

// Creating the song
router.post("/create", passport.authenticate("jwt", {session : false}), async(req, res)=>{
    try {
        const {name, thumbnail, track, duration} = req.body;
        const artist = req.user._id;

        if(!name || !thumbnail || !track || !duration)
            return res.status(400).json({
                message : "Please fill all the fields."
            })

        const song = await SongModel.create({name, thumbnail, track, duration, artist});

        return res.status(200).json({
            message : "Song created successfully.",
            song
        })

    } catch (error) {
        console.log("Error while creating song : ", error);
    }
})


// Fetching all the song of perticular user
router.get("/get/mysongs", passport.authenticate("jwt", {session : false}), async (req, res)=>{
    try {
        // const {id} = req.params;
        const currentUser = req.user._id;

        const songs = await SongModel.find({artist:currentUser}).populate("artist");

        return res.status(200).json({data : songs});
    } catch (error) {
        console.log("Error while fetching my songs : ", error);
    }
})


// Fetching all song of any perticular artist
router.get("/get/artist/:artistId", passport.authenticate("jwt", {session : false}), async (req, res)=>{
    try {
        const {artistId} = req.params;

        const artist = await UserModel.findOne({_id : artistId});
        if(!artist)  
            return res.status(400).json({message:"Artist not found"});

        const songs = await SongModel.find({artist : artistId});

        return res.status(200).json({data : songs});
    } catch (error) {
        console.log("Error while fetching my songs : ", error);
    }
})


// Fetching song by song name
router.get("/get/name/:songname", passport.authenticate("jwt", {session : false}), async (req, res)=>{
    try {
        let {songname} = req.params;
        // Making the search case-insensitive
        // The "i" flag makes the regular expression case-insensitive, meaning it will match both uppercase and lowercase letters
        songname = new RegExp(songname, "i");

        // Using a fuzzy search to match similar song names
        const songs = await SongModel.find({name: { $regex: songname }}).populate('artist');

        if (songs.length === 0) {
            return res.status(404).json({message: "No songs found"});
        }

        return res.status(200).json({data : songs});
    } catch (error) {
        console.log("Error while fetching my songs : ", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});


// Fetching all songs
router.get("/get/allsongs", passport.authenticate("jwt", {session : false}), async (req, res)=>{
    try {

        // Using a fuzzy search to match similar song names
        const songs = await SongModel.find({}).populate('artist').sort({ createdAt: -1 });

        if (songs.length === 0) {
            return res.status(404).json({message: "No songs found"});
        }

        return res.status(200).json({data : songs});
    } catch (error) {
        console.log("Error while fetching my songs : ", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.post('/addlikedsong', passport.authenticate("jwt", {session : false}), async (req, res) => {
    try {
        const {userId, songId} = req.body;

        const user = await UserModel.findOne({_id : userId});

        if(!user){
            return res.status(400).json("User not found !");
        }

        if (!user.likedSongs) {
            user.likedSongs = []; 
        }

        if (user.likedSongs.includes(songId)) {
            return res.status(400).json("Song already added to liked songs !");
        }

        user.likedSongs.push(songId);
        await user.save();
        return res.status(200).json("Song added to liked songs successfully");

    } catch (error) {
        console.log("Error while add liked song : ", error);
    }
})

router.post('/removeLikedsong', passport.authenticate("jwt", {session : false}), async (req, res) => {
    try {
        const { userId, songId } = req.body;

        const user = await UserModel.findOne({_id : userId});

        if (!user) {
            return res.status(400).json("User not found !");
        }

        user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId.toString());
        
        await user.save();

        return res.status(200).json("Song removed from liked songs successfully");

    } catch (error) {
        console.log("Error while removing liked song : ", error);
        return res.status(500).json("Internal Server Error");
    }
})


router.get('/getOneUser/:id', async (req, res) =>{
    const { id } = req.params;

    const user = await UserModel.findOne({_id : id}).populate({
        path: "likedSongs",
        populate: { path: "artist" }
    });

    if (!user) {
        return res.status(400).json("User not found !");
    }

    return res.status(200).json({message : "user Fetched.", user})

})

router.get('/getOneUserWithoutPopulate/:id', async (req, res) =>{
    const { id } = req.params;

    const user = await UserModel.findOne({_id : id});

    if (!user) {
        return res.status(400).json("User not found !");
    }

    return res.status(200).json({message : "user Fetched.", user})

})

module.exports = router;