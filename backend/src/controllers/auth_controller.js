import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Users exit check
    const existingUser = await User.findOne({ email });
    if (existingUser == true) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a diffrent one" });
    }

    // Avatar genrating
    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar,
    });

    // TODO: CREATE THE USER IN STREAM AS WELL
    const token = jwt.sign(
      { userId: newUser.__id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //prevent XSS attack ,
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", //prevent HTTP requests
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller ", error);
    return res.status(500).json({ message: "Internal Server Error " });
  }
  // res.send("Signup Route");
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
    const isPasswordCorrect = await user.matchPassword(password); // Corrected this line

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id }, // Use user._id instead of newUser .__id
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS attack
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log("Error in login controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout Succesfull  " });
}
