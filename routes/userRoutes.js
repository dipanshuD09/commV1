import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/signup").post(registerUser);
router.post("/signout", logoutUser);
router.post("/signin", authUser);
router.route("/me").get(protect, getUserProfile);

export default router;
