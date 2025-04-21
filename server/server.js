import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';


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




server.post("/signup", (req, res) => {
  let {fullname,email,password} = req.body;

    // validating the data from frontend
    if(fullname.length <3){
        return res.status(403).json({message: "Fullname must be at least 3 characters long"});
    }
    if(!email.length){
        return res.status(403).json({message: "Enter Email"});
    }
    if(emailRegex.test(email) === false){
        return res.status(403).json({message: "Invalid Email"});
    }
    if(passwordRegex.test(password) === false){
        return res.status(403).json({message: "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"});
    }
    bcrypt.hash(password, 10, (err, hash) => {
       console.log(hash)
    });
    return res.status(200).json({message: "Okay"});

});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
