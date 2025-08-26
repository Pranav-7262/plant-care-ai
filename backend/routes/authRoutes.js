import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route POST /api/auth/register
router.post("/register", registerUser);

// @route POST /api/auth/login
router.post("/login", loginUser);

// @route GET /api/auth/profile (protected)
router.get("/profile", protect, getUserProfile);

export default router;
