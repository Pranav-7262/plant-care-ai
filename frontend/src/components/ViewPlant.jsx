import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlantById } from "../api.js";
import { motion } from "framer-motion";

export default function ViewPlant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlant = async () => {
      try {
        const { data } = await fetchPlantById(id);
        setPlant(data);
      } catch (err) {
        console.error("Error fetching plant:", err);
        setError("⚠️ Failed to load plant details.");
      } finally {
        setLoading(false);
      }
    };
    loadPlant();
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-lg text-green-700 mt-10 animate-pulse">
        Loading plant details...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">{error}</p>
    );

  if (!plant) return <p className="text-center mt-10">No plant found 🌱</p>;

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={
          plant.image ||
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80"
        }
        alt={plant.name}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
      />

      <h1 className="text-3xl font-bold text-green-700 mb-2">{plant.name}</h1>
      <p className="text-gray-600 italic mb-4">{plant.species}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <span className="font-semibold">📍 Location:</span> {plant.location}
        </p>
        <p>
          <span className="font-semibold">💧 Water Every:</span>{" "}
          {plant.wateringFrequency} days
        </p>
        <p>
          <span className="font-semibold">❤️ Health:</span> {plant.health}
        </p>
        <p>
          <span className="font-semibold">🔔 Reminder:</span>{" "}
          {plant.reminderEnabled ? "Enabled" : "Disabled"}
        </p>
      </div>

      {plant.notes && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg text-green-600">📝 Notes</h2>
          <p className="text-gray-700">{plant.notes}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        ⏱️ Last updated:{" "}
        {new Date(plant.updatedAt || plant.createdAt).toLocaleString()}
      </p>

      <button
        onClick={() => navigate("/my-plants")}
        className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        ← Back to My Plants
      </button>
    </motion.div>
  );
}
