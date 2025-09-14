import { useEffect, useState } from "react";
import { fetchPlants } from "../api";
import { motion } from "framer-motion";
import { Heart, Sprout, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FavouritePlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const { data } = await fetchPlants();
        // filter only favourites
        setPlants(data.plants.filter((p) => p.favourite));
      } catch (err) {
        setError("⚠️ Failed to load favourite plants.");
      } finally {
        setLoading(false);
      }
    };
    loadPlants();
  }, []);

  if (loading)
    return (
      <p className="text-center text-green-700 mt-10 animate-pulse">
        Loading favourite plants...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">{error}</p>
    );

  if (plants.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500 italic">
        No favourite plants yet 🌱
      </p>
    );

  return (
    <div className="items-center px-[3vw] md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans">
      <h1 className="text-3xl font-bold mb-6 text-green-800 flex items-center gap-2">
        <Heart className="w-8 h-8 text-red-500" /> Favourite Plants
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant, index) => (
          <motion.div
            key={plant._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition overflow-hidden"
          >
            {/* Favourite Icon */}
            <div className="absolute top-3 right-3">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>

            {/* Plant Image */}
            <img
              src={
                plant.image ||
                "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80"
              }
              alt={plant.name}
              className="w-full h-40 object-cover rounded-t-2xl"
            />

            {/* Plant Info */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-green-700">
                {plant.name}
              </h2>
              <p className="text-sm text-gray-500 italic">{plant.species}</p>
              <p className="text-sm text-gray-600 mt-2">
                📍 {plant.location} | 💧 every {plant.wateringFrequency} days
              </p>
              <button
                onClick={() => navigate(`/view-plant/${plant._id}`)}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Eye size={16} /> View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
