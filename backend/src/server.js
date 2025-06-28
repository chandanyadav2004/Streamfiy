import express from "express";
import dotenv from "dotenv"; // use this or this import "dotenv/config"

dotenv.config()


import authRoutes from "./routes/auth_route.js"

const app = express()
const PORT = process.env.PORT

// Authenication routing 


app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running in this port  ${PORT}`)
})