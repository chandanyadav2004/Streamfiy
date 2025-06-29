// Import Express framework
import express from "express";
// Import authentication controller functions
import { login, logout, onboard, signup } from "../controllers/auth_controller.js";
// Import authentication middleware to protect certain routes
import { protectRoute } from "../middlewares/auth_middleware.js"; // Ensure this middleware exists

// Create a new router instance
const router = express.Router();

// Public routes
// Route for user signup
router.post("/signup", signup); // Handles user registration

// Route for user login
router.post("/login", login); // Handles user authentication

// Route for user logout
router.post("/logout", logout); // Handles user logout

// Protected route (requires authentication)
// Route for onboarding a user
router.post("/onboarding", protectRoute, onboard); // Only accessible to authenticated users

// Route to check if the user is logged in
router.get("/me", protectRoute, (req, res) => {
    // Respond with the current user's information
    res.status(200).json({ success: true, user: req.user });
});

// Export the router to be used in the main application
export default router;
