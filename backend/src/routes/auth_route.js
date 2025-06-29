import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth_controller.js";
import { protectRoute } from "../middlewares/auth_middleware.js"; // Make sure this middleware exists

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route (requires authentication)
router.post("/onboarding", protectRoute, onboard);

// Check if user is logged in

router.get("/me", protectRoute, (req,res) => {
    res.status(200).json({success: true, user: req.user});
});

export default router;
