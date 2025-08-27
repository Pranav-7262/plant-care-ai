import Plant from "../models/Plant.js";
import asyncHandler from "express-async-handler";

// @desc    Add new plant
// @route   POST /api/plants
// @access  Private
export const addPlant = asyncHandler(async (req, res) => {
  const {
    name,
    species,
    location,
    lastWatered,
    nextWatering,
    health,
    notes,
    image,
  } = req.body;

  const plant = new Plant({
    user: req.user._id, // from auth middleware
    name,
    species,
    location,
    lastWatered,
    nextWatering,
    health,
    notes,
    image,
  });

  const savedPlant = await plant.save();
  res.status(201).json(savedPlant);
});

// @desc    Get all plants with filters, search, pagination + reminders
// @route   GET /api/plants?search=&page=&limit=
// @access  Private
export const getPlants = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // 🔍 Search filter
  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: "i" },
      }
    : {};
  ``;

  // ✅ Debug log to verify request user
  console.log("Fetching plants for user:", req.user._id);

  // 🔎 Count total docs for pagination
  const count = await Plant.countDocuments({
    user: req.user._id,
    ...keyword,
  });

  // 📌 Fetch plants
  let plants = await Plant.find({
    user: req.user._id,
    ...keyword,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // 🌱 Add watering reminder
  plants = plants.map((plant) => {
    let reminder = null;
    if (plant.nextWatering) {
      const daysLeft = Math.ceil(
        (new Date(plant.nextWatering) - new Date()) / (1000 * 60 * 60 * 24)
      );
      if (daysLeft <= 1) {
        reminder =
          daysLeft === 1
            ? "Water tomorrow"
            : daysLeft === 0
            ? "Water today!"
            : "Overdue for watering!";
      }
    }

    return {
      ...plant.toObject(),
      reminder,
    };
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
  const plant = await Plant.findById(req.params.id);

  if (!plant || plant.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Plant not found");
  }

  Object.assign(plant, req.body);
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
