import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';


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


const generateUsername=async(email)=>{
    let username=email.split("@")[0];
    let isUsernameNotUnique=await User.exists({"personal_info.username": username}).then((result)=>{
        return result;
    })
    isUsernameNotUnique ? username+=nanoid().substring(0,5):"";
    return username;

}


// server.post("/signup", (req, res) => {
//   let {fullname,email,password} = req.body;

//     // validating the data from frontend
//     if(fullname.length <3){
//         return res.status(403).json({message: "Fullname must be at least 3 characters long"});
//     }
//     if(!email.length){
//         return res.status(403).json({message: "Enter Email"});
//     }
//     if(emailRegex.test(email) === false){
//         return res.status(403).json({message: "Invalid Email"});
//     }
//     if(passwordRegex.test(password) === false){
//         return res.status(403).json({message: "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"});
//     }
//     bcrypt.hash(password, 10, async (err, hash) => {
//         let userName=await generateUsername(email);

//         let user = new User({
//             personal_info: {fullname,email,password: hash,userName}
//         });

//         user.save()
//         .then((u) => {
//             return res.status(200).json({user: u});
//         })
//         .catch((err) => {
//            if(err.code === 11000){
//                 return res.status(403).json({message: "Email already exists"});
//             }
//             return res.status(500).json({message: err});
//         });
//     });
    

// });


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
          username: userName, // ✅ fixed key name
        },
      });
  
      user
        .save()
        .then((u) => {
          return res.status(200).json({ user: u });
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
  

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
