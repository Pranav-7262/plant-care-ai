import express from "express";
import {
  addPlant,
  getPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";

import { protect } from "../middleware/authMiddleware.js"; // ensure user is logged in

const router = express.Router();

router.post("/", protect, addPlant); // Create
router.get("/", protect, getPlants); // Read All
router.get("/:id", protect, getPlantById); // Read One
router.put("/:id", protect, updatePlant); // Update
router.delete("/:id", protect, deletePlant); // Delete

export default router;
