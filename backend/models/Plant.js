import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Plant name is required"],
      trim: true,
      minlength: [2, "Plant name must be at least 2 characters"],
    },
    species: {
      type: String,
      required: [true, "Species is required"],
      trim: true,
    },
    location: {
      type: String,
      required: true,
      enum: ["Living Room", "Bedroom", "Balcony", "Garden", "Office", "Other"],
      default: "Other",
    },
    category: {
      type: String,
      enum: [
        "Indoor",
        "Outdoor",
        "Flowering",
        "Succulent",
        "Herb",
        "Tree",
        "Other",
      ],
      default: "Other",
    },
    image: {
      type: String, // URL for plant image
      default: "",
    },
    lastWatered: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextWatering: {
      type: Date,
    },
    wateringFrequency: {
      type: Number, // days between watering
      required: true,
      default: 7,
      min: [1, "Watering frequency must be at least 1 day"],
    },
    health: {
      type: String,
      enum: ["Healthy", "Needs Attention", "Sick"],
      default: "Healthy",
    },
    notes: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
    favourite: {
      type: Boolean,
      default: false, // toggle when user clicks ❤️ icon
    },
  },
  { timestamps: true }
);

// 🔹 Middleware: auto-calculate nextWatering before saving
plantSchema.pre("save", function (next) {
  if (this.lastWatered && this.wateringFrequency) {
    const nextDate = new Date(this.lastWatered);
    nextDate.setDate(nextDate.getDate() + this.wateringFrequency);
    this.nextWatering = nextDate;
  }
  next();
});

export default mongoose.model("Plant", plantSchema);
