import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import plantRoutes from "./routes/plantRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Middleware
app.use(express.json()); // to parse JSON body

// Routes
app.use("/api/auth", authRoutes); //this is a middleware for auth routes

app.use("/api/plants", plantRoutes); //this is a middleware for plant routes

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
