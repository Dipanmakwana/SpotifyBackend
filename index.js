require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db.js");
const cors = require("cors");

// json web token for suthentication perpos.
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/UserModel.js");

connectDB();

// routes
const authRouter = require("./routes/auth.js");
const songRouter = require("./routes/song.js");
const playlistRouter = require("./routes/playlist.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", authRouter);
app.use("/song", songRouter);
app.use("/playlist", playlistRouter);

//  ------------- Setup for password-jwt -------------
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.identifier}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

const port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log("Server is running at port : ", port);
})