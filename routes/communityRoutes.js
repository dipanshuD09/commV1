import express from "express";
import {
  createCommunity,
  getCommunities,
  getAllMembers,
  getMyCommunities,
  getAllCommunities,
} from "../controllers/communityController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(protect, createCommunity).get(getCommunities);
router.route("/:id/members").get(protect, getAllMembers);
router.route("/me/owner").get(protect, getMyCommunities);
router.route("/me/member").get(protect, getAllCommunities);

export default router;
