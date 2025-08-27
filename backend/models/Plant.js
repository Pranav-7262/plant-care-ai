import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    user: {
      //this is for associating plants with specific users
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      //this is the name of the plant
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    lastWatered: {
      type: Date,
      required: true,
    },
    nextWatering: {
      type: Date,
    },
    health: {
      type: String,
      enum: ["Healthy", "Needs Attention", "Sick"],
      default: "Healthy",
    },
    notes: {
      type: String,
      default: "",
    },
    image: {
      type: String, // store image URL or file path
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plant", plantSchema); //this creates a model named "Plant" using the plantSchema
