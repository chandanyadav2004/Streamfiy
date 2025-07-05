// Import necessary modules and functions
import { upsertStreamUser  } from "../lib/stream.js"; // Function to manage user data in Stream
import User from "../models/User.js"; // User model for database operations
import jwt from "jsonwebtoken"; // Library for creating and verifying JSON Web Tokens

// Signup function to register a new user
export async function signup(req, res) {
  const { email, password, fullName } = req.body; // Destructure the request body
  try {
    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check the email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email already exists in the database
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    // Generate a random avatar for the user
    const idx = Math.floor(Math.random() * 100) + 1; // Generate a number between 1-100
    const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`;

    // Create a new user in the database
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
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
      // Optionally, you can choose to return a response here if needed
    }

    // Create JWT token for the new user
    const token = jwt.sign(
      { userId: newUser ._id.toString() }, // Use _id
      process.env.JWT_SECRET_KEY, // Secret key from environment variables
      { expiresIn: "7d" } // Token expiration time
    );

    // Set the JWT as a cookie in the response
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    // Respond with the newly created user
    res.status(201).json({ success: true, user: newUser  });
  } catch (error) {
    console.log("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Login function to authenticate a user
export async function login(req, res) {
  try {
    const { email, password } = req.body; // Destructure the request body
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    // Call matchPassword on the user instance to verify the password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user._id.toString() }, // Use _id
      process.env.JWT_SECRET_KEY, // Secret key from environment variables
      { expiresIn: "7d" } // Token expiration time
    );

    // Set the JWT as a cookie in the response
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    // Respond with the authenticated user
    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Logout function to clear the user's session
export async function logout(req, res) {
  res.clearCookie("jwt"); // Clear the JWT cookie
  res.status(200).json({ success: true, message: "Logout Successful" });
}

// Onboarding function to complete user profile setup
export async function onboard(req, res) {
  console.log(req.user); // Log the current user
  try {
    const userId = req.user._id; // Get the user ID from the request

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body; // Destructure the request body

    // Validate required fields
    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean), // Filter out undefined values
      });
    }

    // Update the user in the database
    const updateUser  = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true, // Set onboarding status to true
    }, { new: true }); // Return the updated user

    if (!updateUser ) return res.status(404).json({ message: "User  not found" });

    // Update the user info in Stream
    try {
      await upsertStreamUser ({
        userId: updateUser ._id.toString(),
        name: updateUser .fullName,
        image: updateUser .profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updateUser .fullName}`);
    } catch (streamError) {
      console.log(`Error updating Stream user during onboarding: `, streamError.message);
    }

    // Respond with the updated user
    return res.status(200).json({ success: true, user: updateUser  });

  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
