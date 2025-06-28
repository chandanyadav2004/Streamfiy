import express from "express";
import dotenv from "dotenv"; // use this or this import "dotenv/config"

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Authenication routing 
app.get("/api/auth/signup" , (req,res)=>{
    res.send("Signup Route");
})

app.get("/api/auth/login" , (req,res)=>{
    res.send("Login Route");
})

app.get("/api/auth/logout" , (req,res)=>{
    res.send("Logout Route");
})

app.listen(PORT,()=>{
    console.log(`Server is running in this port  ${PORT}`)
})