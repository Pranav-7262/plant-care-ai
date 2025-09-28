import express from "express";
import {
  addPlant,
  getPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  toggleFavourite, // ✅ import new controller
} from "../controllers/plantController.js";

import { protect } from "../middleware/authMiddleware.js"; // ensure user is logged in

const router = express.Router();

// CRUD Routes
router.post("/", protect, addPlant);
router.get("/", protect, getPlants);
router.get("/:id", protect, getPlantById);
router.put("/:id", protect, updatePlant);
router.delete("/:id", protect, deletePlant);

// Extra Route
router.patch("/:id/favourite", protect, toggleFavourite); // ✅ Toggle favourite

export default router;
