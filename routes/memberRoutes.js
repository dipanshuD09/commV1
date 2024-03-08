import express from "express";
import { addMember, removeMember } from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(protect, addMember);
router.route("/:id").delete(protect, removeMember);

export default router;
