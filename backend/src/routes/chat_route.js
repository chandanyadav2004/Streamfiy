// Import the express module to create an Express application
import express from "express";

// Import the protectRoute middleware to protect routes from unauthorized access
import { protectRoute } from "../middlewares/auth_middleware.js";

// Import the getStreamToken controller function to handle token generation
import { getStreamToken } from "../controllers/chat_controller.js";

// Create a new router instance from Express
const router = express.Router();

// Define a GET route for "/token" that uses the protectRoute middleware and the getStreamToken controller
router.get("/token", protectRoute, getStreamToken);

// Export the router instance for use in other parts of the application
export default router;
