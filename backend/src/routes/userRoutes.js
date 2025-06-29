import expres from "express";
import { protectRoute } from "../middlewares/auth_middleware.js";
import { getMyFriends, getRecommendUsers } from "../controllers/user_controller.js";

const router = expres.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendUsers);
router.get("/friends", getMyFriends);



export default router;
