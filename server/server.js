import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';


// schema below
import User from './Schema/User.js'; 

dotenv.config(); 

const server = express();
const PORT = process.env.PORT || 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


mongoose.connect(process.env.DB_LOCATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

server.use(express.json());
server.use(cors())


const formatDatatoSend=(user)=>{

    const access_token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
return {
    access_token,
    profile_img:user.personal_info.profile_img,
    username:user.personal_info.username,
    fullname:user.personal_info.fullname,   
}}



const generateUsername=async(email)=>{
    let username=email.split("@")[0];
    let isUsernameNotUnique=await User.exists({"personal_info.username": username}).then((result)=>{
        return result;
    })
    isUsernameNotUnique ? username+=nanoid().substring(0,5):"";
    return username;

}




server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;
  
    // validating the data from frontend
    if (fullname.length < 3) {
      return res.status(403).json({ message: "Fullname must be at least 3 characters long" });
    }
    if (!email.length) {
      return res.status(403).json({ message: "Enter Email" });
    }
    if (emailRegex.test(email) === false) {
      return res.status(403).json({ message: "Invalid Email" });
    }
    if (passwordRegex.test(password) === false) {
      return res.status(403).json({
        message:
          "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }
  
    bcrypt.hash(password, 10, async (err, hash) => {
      let userName = await generateUsername(email);
  
      let user = new User({
        personal_info: {
          fullname,
          email,
          password: hash,
          username: userName, 
        },
      });
  
      user
        .save()
        .then((u) => {
          return res.status(200).json(formatDatatoSend(u));
        })
        .catch((err) => {
          if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            let msg = "Duplicate value";
            if (field.includes("email")) msg = "Email already exists";
            else if (field.includes("username")) msg = "Username already taken";
            return res.status(403).json({ message: msg });
          }
          return res.status(500).json({ message: err });
        });
    });
  });


 server.post("/signin",(req,res)=>{
    let {email,password}=req.body;
    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if (!user) {
            return res.status(403).json({ message: "Email not found" });
        }
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (result) {
               
                return res.status(200).json(formatDatatoSend(user));
            } else {
                return res.status(403).json({ message: "Incorrect password" });
            }
        });
    })
 })
  

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
