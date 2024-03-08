import express from "express";
import { createRole, getAllRoles } from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(protect, createRole).get(protect, getAllRoles);

export default router;
