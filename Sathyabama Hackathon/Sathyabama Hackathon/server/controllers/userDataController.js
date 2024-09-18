const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET;

const userData=async(req,res)=>{
    const email = req.user.email;
    console.log("Email" + email);
    try{
        const Fuser=await User.findOne({email});
        if(!Fuser){
            res.status(401).json({Msg:"User Not Found"});
        }
        res.status(200).json({Msg:Fuser});
    }catch(err){
        res.status(500).json({Msg:"Server Error"});
    }
}
module.exports = {userData};