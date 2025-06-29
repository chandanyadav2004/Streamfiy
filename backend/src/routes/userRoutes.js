// Import Express framework
import express from "express";
// Import authentication middleware to protect routes
import { protectRoute } from "../middlewares/auth_middleware.js";
// Import controller functions for user operations
import {
  getMyFriends,
  getRecommendUsers,
  sendFriendRequest,
} from "../controllers/user_controller.js";

// Create a new router instance
const router = express.Router();

// Apply authentication middleware to ALL routes in this router
// This ensures only authenticated users can access these endpoints
router.use(protectRoute);

// Route: GET /api/users/
// Description: Get recommended users (potential friends)
router.get("/", getRecommendUsers);

// Route: GET /api/users/friends
// Description: Get current user's friends list
router.get("/friends", getMyFriends);

// Route: POST /api/users/friend-request/:id
// Description: Send friend request to another user
// :id = ID of the user to send request to
router.post("/friend-request/:id", sendFriendRequest);

// Export the router to be used in main application
export default router;
