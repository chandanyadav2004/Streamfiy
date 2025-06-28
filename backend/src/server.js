import express from "express";
import authRoutes from "./routes/auth_route.js";
import dotenv from "dotenv"; // use this or this import "dotenv/config"
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config()




const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
// Authenication routing 
app.use("/api/auth",authRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running in this port  ${PORT}`)
    connectDB();
   
})