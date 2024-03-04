const router = require("express").Router();
const UserModel = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers.js");

router.post("/register", async (req, res)=>{
    try {
        const { firstname, lastname, username, email, password } = req.body;

        if(!firstname || !lastname || !username || !email || !password)
            return res.send({message : "please fill all the fields."});

        const exist = await UserModel.findOne({email});
        if(exist)
            return res.status(400).json({
                message : "Email already exist."
            })

        const hashedPass = await bcrypt.hash(password, 10);
    
        const user = await UserModel({
            firstname, 
            lastname, 
            username, 
            email, 
            password: hashedPass
        });

        console.log(user);

        const token = await getToken(email, user);
        await user.save();

        return res.status(200).json({
            message : "User registered successfully.",
            user,
            token
        })

    } catch (error) {
        console.log("Error from registration : ", error);
    }
})

router.post("/login", async(req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});
        if(!user)
            return res.status(400).json({message : "User not exist."});

        const isTrue = await bcrypt.compare(password, user.password);
        if(!isTrue)
            return res.status(400).json({message : "Password must be wrong."});

        const token = await getToken(email, user);
        return res.status(200).json({
            "message" : "User logged in successfully.", 
            user, 
            token
        });
        
    } catch (error) {
        console.log("Error While Login : ", error);
        return res.status(500).json({message: "Internal Server Error", error});
    }
})


module.exports = router;