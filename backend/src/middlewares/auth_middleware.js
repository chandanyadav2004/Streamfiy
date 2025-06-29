// Import the jsonwebtoken library for handling JWTs
import jwt from "jsonwebtoken";
// Import the User model to interact with user data
import User from "../models/User.js";

// Middleware function to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the JWT from cookies
        const token = req.cookies.jwt;

        // Check if the token is provided
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify the token using the secret key
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the token is valid
        if (!decode) {
            return res.status(401).json({ message: "Unauthorized - Invalid token provided" });
        }

        // Find the user associated with the decoded userId from the token
        const user = await User.findById(decode.userId).select("-password"); // Exclude the password field

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        // Attach the user object to the request for use in subsequent middleware/routes
        req.user = user;
        // Call the next middleware function in the stack
        next();

    } catch (error) {
        // Log any errors that occur during the process
        console.log("Error in protectRoute middleware", error);
        // Respond with a 500 status code for internal server errors
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
