import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin'; // Import Firebase Admin SDK
import { readFileSync } from 'fs';

const serviceAccountKey = JSON.parse(
  readFileSync('./blog-site-b1a5c-firebase-adminsdk-fbsvc-581085e51b.json', 'utf8')
);

import { getAuth } from 'firebase-admin/auth';

// schema below
import User from './Schema/User.js'; 

dotenv.config(); 

const server = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
credential: admin.credential.cert(serviceAccountKey)
})

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




server.post("/signup", async (req, res) => {
  let { fullname, email, password } = req.body;

  // Validation
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

  // ✅ Check if email already exists before hashing or saving
  const existingUser = await User.findOne({ "personal_info.email": email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" }); // 409 = Conflict
  }

  // Now hash and save
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

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
        console.error("Saving user failed:", err);
        return res.status(500).json({ message: "Internal server error" });
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
        
        if (!user.google_auth) {
          bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (result) {
               
                return res.status(200).json(formatDatatoSend(user));
            } else {
                return res.status(403).json({ message: "Incorrect password" });
            }
        })
        }
        else{
            return res.status(403).json({ message: "This user is signed up through google. Please login through google" });
        }


        
    })
 })


 server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, picture, name } = decodedUser;
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select("personal_info.fullname personal_info.username personal_info.profile_img goggle_auth")
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err });
        });

      if (user) {
        if (!user.google_auth) {
          return res.status(403).json({"error":"This user is signed up through email and password.Please login through email and password"});
        }
      }
      else{
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            username
          },
          google_auth: true,
        });

        await user.save().then((u)=>{
          user=u
        }).catch((err) => {
          return res.status(500).json({ "error": err.message });
        })
      }
      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      
      return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other google account" });
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
