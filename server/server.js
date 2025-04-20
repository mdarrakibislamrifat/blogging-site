import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const server = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_LOCATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
