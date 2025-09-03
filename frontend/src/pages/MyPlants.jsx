import { useEffect, useState } from "react";
import { fetchPlants, deletePlant } from "../api";
import { motion } from "framer-motion";
import { Search, Trash2, Edit, Eye, Bell } from "lucide-react";

const defaultPlantImg =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80";
export default function MyPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getPlants = async () => {
      try {
        const { data } = await fetchPlants();
        setPlants(data.plants || []);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("⚠️ Failed to load plants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getPlants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;
    try {
      await deletePlant(id);
      setPlants((prev) => prev.filter((plant) => plant._id !== id));
    } catch (err) {
      console.error("Error deleting plant:", err);
      alert("❌ Failed to delete plant");
    }
  };

  const handleView = (plant) => {
    alert(`Viewing details for "${plant.name}" 🌿`);
  };

  const filteredPlants = plants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.species.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <p className="text-center text-lg animate-pulse text-green-700 mt-10">
        Loading your plants...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-800 flex items-center gap-2">
        🌿 My Plants
      </h1>

      {/* 🔍 Search Bar */}
      <div className="flex items-center bg-white rounded-xl shadow-sm px-4 py-2 mb-8 max-w-md border border-gray-300 focus-within:ring-2 ring-green-300">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search plants..."
          className="ml-3 w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🌱 Plant Cards */}
      {filteredPlants.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 italic mt-10"
        >
          No plants found. Try adding one!
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant, index) => (
            <motion.div
              key={plant._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.02 }}
              className="relative group bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all"
            >
              {/* Hover action buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleView(plant)}
                  className="p-1 rounded-full bg-blue-100 hover:bg-blue-200"
                  title="View"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() =>
                    alert(`Update feature coming soon for ${plant.name}`)
                  }
                  className="p-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-yellow-600" />
                </button>
                <button
                  onClick={() => handleDelete(plant._id)}
                  className="p-1 rounded-full bg-red-100 hover:bg-red-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* ✅ Default image fallback */}
              <img
                src={plant.image || defaultPlantImg}
                alt={plant.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />

              <h2 className="text-xl font-semibold text-green-700 mb-1">
                {plant.name}
              </h2>
              <p className="text-gray-500 italic text-sm">{plant.species}</p>
              <p className="mt-1 text-sm">📍 {plant.location}</p>

              {/* 💧 Next watering */}
              {plant.nextWatering && (
                <p className="mt-2 text-sm">
                  💧 Next Watering:{" "}
                  <span className="font-medium text-green-600">
                    {plant.nextWatering.split("T")[0]}
                  </span>
                </p>
              )}

              {/* 🌱 Health */}
              {plant.health && (
                <p
                  className={`mt-1 text-sm font-medium ${
                    plant.health === "Healthy"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  🌱 {plant.health}
                </p>
              )}

              {/* 📝 Notes */}
              {plant.notes && (
                <p className="mt-2 text-sm text-gray-600">{plant.notes}</p>
              )}

              {/* 🔔 Reminder */}
              {plant.reminder && (
                <p className="mt-3 flex items-center gap-1 text-sm text-indigo-600 font-medium">
                  <Bell className="w-4 h-4" /> Reminder: {plant.reminder}
                </p>
              )}

              {/* 🕒 Last Updated */}
              {plant.updatedAt && (
                <p className="mt-2 text-xs text-gray-500 italic">
                  Last updated:{" "}
                  {new Date(plant.updatedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
