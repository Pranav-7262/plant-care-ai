import Plant from "../models/Plant.js";
import asyncHandler from "express-async-handler";

// Helper: calculate next watering date
const calculateNextWatering = (lastWatered, frequency) => {
  if (!lastWatered || !frequency) return null;
  const nextDate = new Date(lastWatered);
  nextDate.setDate(nextDate.getDate() + frequency);
  return nextDate;
};

// @desc    Add new plant
// @route   POST /api/plants
// @access  Private
export const addPlant = asyncHandler(async (req, res) => {
  const {
    name,
    species,
    location,
    image,
    lastWatered,
    wateringFrequency,
    health,
    notes,
    reminderEnabled,
  } = req.body;

  if (!name || !species) {
    res.status(400);
    throw new Error("Please provide both name and species");
  }

  // inside addPlant
  const plant = new Plant({
    user: req.user._id,
    name,
    species,
    location,
    image,
    lastWatered,
    wateringFrequency,
    health,
    notes,
    reminderEnabled,
  });

  // auto calculate nextWatering
  if (plant.lastWatered && plant.wateringFrequency) {
    plant.nextWatering = new Date(
      new Date(plant.lastWatered).getTime() +
        plant.wateringFrequency * 24 * 60 * 60 * 1000
    );
  }

  // Auto-calc next watering
  if (lastWatered && wateringFrequency) {
    plant.nextWatering = calculateNextWatering(lastWatered, wateringFrequency);
  }

  const createdPlant = await plant.save();
  res.status(201).json(createdPlant);
});

// @desc    Get all plants with pagination & reminder
// @route   GET /api/plants
// @access  Private
export const getPlants = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Plant.countDocuments({ user: req.user._id, ...keyword });

  let plants = await Plant.find({ user: req.user._id, ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Add watering reminders
  plants = plants.map((plant) => {
    let reminder = null;
    if (plant.nextWatering) {
      const daysLeft = Math.ceil(
        (new Date(plant.nextWatering) - new Date()) / (1000 * 60 * 60 * 24)
      );
      if (daysLeft <= 1) {
        reminder =
          daysLeft === 1
            ? "💧 Water tomorrow"
            : daysLeft === 0
            ? "💧 Water today!"
            : "⚠️ Overdue for watering!";
      }
    }
    return { ...plant.toObject(), reminder };
  });

  res.json({
    plants,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Private
export const getPlantById = asyncHandler(async (req, res) => {
  //
  const plant = await Plant.findById(req.params.id);

  if (!plant || plant.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Plant not found");
  }

  res.json(plant);
});

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Private
export const updatePlant = asyncHandler(async (req, res) => {
  //this is for updating plant details
  const plant = await Plant.findById(req.params.id);

  if (!plant || plant.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Plant not found");
  }

  const {
    name,
    species,
    location,
    image,
    lastWatered,
    wateringFrequency,
    health,
    notes,
    reminderEnabled,
  } = req.body;

  // Update fields if provided
  if (name) plant.name = name;
  if (species) plant.species = species;
  if (location) plant.location = location;
  if (image) plant.image = image;
  if (lastWatered) plant.lastWatered = lastWatered;
  if (wateringFrequency) plant.wateringFrequency = wateringFrequency;
  if (health) plant.health = health;
  if (notes) plant.notes = notes;
  if (reminderEnabled !== undefined) plant.reminderEnabled = reminderEnabled;

  // Recalculate next watering
  if (plant.lastWatered && plant.wateringFrequency) {
    plant.nextWatering = calculateNextWatering(
      plant.lastWatered,
      plant.wateringFrequency
    );
  }

  const updatedPlant = await plant.save();
  res.json(updatedPlant);
});

// @desc    Delete plant
// @route   DELETE /api/plants/:id
// @access  Private
export const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant || plant.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Plant not found");
  }

  await plant.deleteOne();
  res.json({ message: "Plant removed" });
});
