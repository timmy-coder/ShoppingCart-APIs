// Creating api requests and response
const router = require('express').Router();
const User = require("../models/User");
// Hashong or encrpting password
const CryptoJS = require("crypto-js");
// Json web token
const jwt = require("jsonwebtoken")
//Register
router.post("/register", async (req,res)=>{
    if(req.body.username == ''){
        res.status(400).json("Please enter a username");
    }
    else if (req.body.email == ''){
        res.status(400).json("please enter an email");
    }
    else if (req.body.password = ''){
        res.status(400).json("please enter a password")
    }
    else{
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            //Hasing password for protection
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        });
    
        try{
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }catch(err){
            res.status(500).json(err);
        }
    }
})

//LOGIN
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({ username:req.body.username});
        if(!user){
            res.status(401).json("Wrong credentials!");
            return
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString();

        console.log(hashedPassword);
        
        //if(hashedPassword !== req.body.password){
           // res.status(401).json("Wrong password!");
           // return
        //}

        //Json web token
        const accessToken = jwt.sign({
            id: user._id, 
            isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn: "3d"}
        )

        //If you want to remove your password from the api set
        const {password, ...others } = user._doc;
         
        
        res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err)
        
    }
    
});

module.exports = router