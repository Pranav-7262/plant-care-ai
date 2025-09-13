import { useEffect, useState } from "react";
import { fetchPlants, deletePlant, toggleFavourite } from "../api";
import { motion } from "framer-motion";

import {
  Search,
  Trash2,
  Edit,
  Eye,
  Bell,
  Tag,
  Droplet,
  MapPin,
  Sprout,
  CalendarCheck,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoUser from "../components/NoUser";

const defaultPlantImg =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80";

export default function MyPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

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
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;

    try {
      await deletePlant(id);
      setPlants((prev) => prev.filter((plant) => plant._id !== id));
      toast.success("Plant deleted successfully!");
    } catch (err) {
      console.error("Error deleting plant:", err);
      toast.error("❌ Failed to delete plant");
    }
  };
  const handleFavourite = async (plantId) => {
    // Optimistic update
    setPlants((prevPlants) =>
      prevPlants.map((p) =>
        p._id === plantId ? { ...p, isFavourite: !p.isFavourite } : p
      )
    );

    try {
      await toggleFavourite(plantId); // confirm with backend
    } catch (error) {
      console.error("❌ Error updating favourite:", error);
      // rollback on failure
      setPlants((prevPlants) =>
        prevPlants.map((p) =>
          p._id === plantId ? { ...p, isFavourite: !p.isFavourite } : p
        )
      );
    }
  };

  const handleView = (id) => {
    navigate(`/view-plant/${id}`);
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

  if (!user) {
    <NoUser />;
  }

  if (error) {
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );
  }

  return (
    <div className="items-center px-[3vw] md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans">
      <h1 className="text-3xl font-bold mb-6 text-green-800 flex items-center gap-2">
        <Sprout className="w-8 h-8 text-green-700" /> My Plants
      </h1>

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

      {filteredPlants.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 italic mt-10"
        >
          No plants found. Try adding one!
        </motion.p>
      ) : (
        <div className="flex flex-col gap-6">
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
              whileHover={{ scale: 1.01 }}
              className="relative group flex flex-col sm:flex-row bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Hover Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {/* Favourite */}
                <button
                  className="p-1 rounded-full bg-white shadow hover:bg-red-50 transition"
                  onClick={() => handleFavourite(plant._id)}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      plant.favourite
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* View */}
                <button
                  onClick={() => handleView(plant._id)}
                  className="p-1 rounded-full bg-blue-100 hover:bg-blue-200"
                  title="View"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>

                {/* Edit */}
                <button
                  onClick={() => navigate(`/add-plant/${plant._id}`)}
                  className="p-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-yellow-600" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(plant._id)}
                  className="p-1 rounded-full bg-red-100 hover:bg-red-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="flex-shrink-0 w-full sm:w-48 h-40 sm:h-auto">
                <img
                  src={plant.image || defaultPlantImg}
                  alt={plant.name}
                  className="w-full h-full object-cover sm:rounded-l-2xl sm:rounded-r-none rounded-t-2xl sm:rounded-t-none"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-green-700 mb-1">
                    {plant.name}
                  </h2>
                  <p className="text-gray-500 italic text-sm">
                    {plant.species}
                  </p>
                  {plant.category && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      <Tag size={12} className="stroke-[2.5]" />
                      {plant.category}
                    </div>
                  )}

                  {/* Location */}
                  {plant.location && (
                    <p className="mt-1 text-sm flex items-center gap-1 text-gray-700">
                      <MapPin size={14} className="text-green-600" />{" "}
                      {plant.location}
                    </p>
                  )}

                  {/* Next Watering */}
                  {plant.nextWatering && (
                    <p className="mt-2 text-sm flex items-center gap-1 text-green-700 font-medium">
                      <Droplet size={14} /> Next Watering:{" "}
                      {plant.nextWatering.split("T")[0]}
                    </p>
                  )}

                  {/* Last Watered */}
                  {plant.lastWatered && (
                    <p className="mt-1 text-sm flex items-center gap-1 text-blue-600 font-medium">
                      <CalendarCheck size={14} /> Last Watered:{" "}
                      {new Date(plant.lastWatered).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </p>
                  )}

                  {/* Health */}
                  {plant.health && (
                    <p
                      className={`mt-1 text-sm font-medium flex items-center gap-1 ${
                        plant.health === "Healthy"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      <Sprout size={14} /> {plant.health}
                    </p>
                  )}

                  {/* Notes */}
                  {plant.notes && (
                    <p className="mt-2 text-sm text-gray-600">{plant.notes}</p>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  {plant.reminder && (
                    <p className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
                      <Bell className="w-4 h-4" /> Reminder: {plant.reminder}
                    </p>
                  )}

                  {plant.updatedAt && (
                    <p className="text-xs text-gray-500 italic">
                      Last updated:{" "}
                      {new Date(plant.updatedAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
