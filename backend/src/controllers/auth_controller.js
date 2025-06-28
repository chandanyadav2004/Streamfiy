import User from "../models/User.js";
import jwt from "jsonwebtoken";


export async function signup(req,res){
    const {email,password,fullName} = req.body;
    try {
        
        if(!email || !password || !fullName){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // check the email 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Users exit check
        const existingUser = await User.findOne({email});
        if(existingUser==true){
            return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
        }

        // Avatar genrating 
        const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
        const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePic : randomAvatar,
        })

        const token = jwt.sign({userId:newUser.__id},process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });
        
        // TODO: CREATE THE USER IN STREAM AS WELL

        res.cookie("jwt",token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attack ,
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production" , //prevent HTTP requests
        })

        res.status(201).json({success:true, user:newUser})

    } catch (error) {
        console.log("Error in signup controller ", error);
        return res.status(500).json({ message: "Internal Server Error " });
    }
    // res.send("Signup Route");
}

export async function login(req,res){
    res.send("Login Route");
}

export async function logout(req,res){
    res.send("Logout Route");
}

