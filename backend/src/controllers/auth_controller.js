import { upsertStreamUser  } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // User existence check
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    // Avatar generating
    const idx = Math.floor(Math.random() * 100) + 1; // Generate a number between 1-100
    const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`;

    const newUser  = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar,
    });

    // Upsert user in Stream
    try {
      await upsertStreamUser ({
        userId: newUser._id.toString(), // Use _id instead of __id
        name: newUser.fullName,
        image: newUser.profilePic || ""
      });
      console.log(`Stream user created for ${newUser .fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
      // Optionally, you can choose to return a response here if needed
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser ._id.toString() }, // Use _id
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS attack
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    res.status(201).json({ success: true, user: newUser  });
  } catch (error) {
    console.log("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    // Call matchPassword on the user instance
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() }, // Use _id
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS attack
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout Successful" });
}

export async function onboard(req,res) {
  console.log(req.user);
  try {
    const userId = req.user._id;

    const {fullName,bio, nativeLanguage, learningLanguage, location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).json({ 
        message: "All fields are required" ,
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updateUser = await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnboarded: true,
    }, {new:true} )


    if(!updateUser) return res.status(404).json({ message: "User not found" });


    // TODO: UPDATE THE USER INFO IN STREAM
    try {
      // id: updateUser._id.toString(),
      await upsertStreamUser({
      userId: updateUser._id.toString(),
      name: updateUser.fullName,
      image: updateUser.profilePic || "",
       })
      console.log(`Stream user updated after onboarding for ${updateUser.fullName}`)
    } catch (streamError) {
      console.log(`Error updating Stream user during onboarding: `, streamError.message);

    }

    return res.status(200).json({ success: true, user: updateUser });

  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });

  }
}
