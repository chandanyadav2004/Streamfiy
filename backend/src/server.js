// Import necessary modules
import express from "express"; // Import the Express framework
import authRoutes from "./routes/auth_route.js"; // Import authentication routes
import userRoutes from "./routes/userRoutes.js"; // Import user-related routes
import dotenv from "dotenv"; // Import dotenv for environment variable management
import connectDB from "./lib/db.js"; // Import the database connection function
import cookieParser from "cookie-parser"; // Import cookie-parser middleware

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Define the port to run the server, using the PORT variable from the environment
const PORT = process.env.PORT;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Set up authentication routes under the /api/auth path
app.use("/api/auth", authRoutes);

// Set up user-related routes under the /api/users path
app.use("/api/users", userRoutes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
    connectDB(); // Call the function to connect to the database
});
