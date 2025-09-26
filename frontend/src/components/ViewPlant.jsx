import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlantById, deletePlant } from "../api.js";
import { motion } from "framer-motion";
import {
  MapPin,
  Droplet,
  Calendar,
  Bell,
  Heart,
  NotebookPen,
  Clock,
  Tag,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function DetailBox({ icon, label, value, colorClass = "text-emerald-600" }) {
  if (!value) return null; // Don't render if value is null/empty

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg hover:border-emerald-200">
      <div className={`p-3 rounded-full bg-emerald-50 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-bold text-gray-800 break-words leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

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
        setError("⚠️ Failed to load plant details. The plant might not exist.");
      } finally {
        setLoading(false);
      }
    };
    loadPlant();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;
    try {
      await deletePlant(id);
      toast.success("Plant deleted successfully!");
      navigate("/my-plants");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("❌ Failed to delete plant.");
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-20 font-semibold text-xl p-6 bg-red-50 rounded-lg max-w-lg mx-auto shadow">
        {error}
      </p>
    );

  if (!plant)
    return (
      <p className="text-center mt-20 text-xl text-gray-500">
        No plant found 🌱
      </p>
    );

  const getHealthStyle = (health) => {
    switch (health) {
      case "Healthy":
        return "bg-green-100 text-green-800 ring-green-500";
      case "Needs Attention":
        return "bg-yellow-100 text-yellow-800 ring-yellow-500";
      case "Sick":
        return "bg-red-100 text-red-800 ring-red-500";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-500";
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto my-12 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-96">
        <img
          src={
            plant.image ||
            "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&h=400&q=80"
          }
          alt={plant.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {plant.name}
            </h1>
            <span
              className={`text-xl font-bold ring-2 px-3 py-1 rounded-full whitespace-nowrap ${getHealthStyle(
                plant.health
              )}`}
              title="Current Health Status"
            >
              {plant.health}
            </span>
          </div>
          <p className="text-gray-300 italic text-lg mt-1">{plant.species}</p>
        </div>

        {plant.favourite && (
          <div className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg border border-red-200">
            <Heart
              className="w-6 h-6 text-red-500 fill-red-500"
              title="Favorite Plant"
            />
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 font-sans">
        {/* KEY INFO GRID */}
        <h2 className="text-2xl font-bold text-gray-700 mb-5 border-b pb-2">
          Plant Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* Location */}
          <DetailBox
            icon={<MapPin className="w-5 h-5" />}
            label="Location"
            value={plant.location}
          />

          {/* Watering Frequency */}
          <DetailBox
            icon={<Droplet className="w-5 h-5" />}
            label="Water Cycle"
            value={`${plant.wateringFrequency || "N/A"} days`}
            colorClass="text-blue-600"
          />

          {/* Next Watering */}
          <DetailBox
            icon={<Calendar className="w-5 h-5" />}
            label="Next Water"
            value={
              plant.nextWatering
                ? new Date(plant.nextWatering).toLocaleDateString()
                : "Set soon"
            }
            colorClass="text-indigo-600"
          />

          {/* Last Watered */}
          <DetailBox
            icon={<Clock className="w-5 h-5" />}
            label="Last Watered"
            value={
              plant.lastWatered
                ? new Date(plant.lastWatered).toLocaleDateString()
                : "N/A"
            }
            colorClass="text-sky-600"
          />

          {/* Category */}
          {plant.category && (
            <DetailBox
              icon={<Tag className="w-5 h-5" />}
              label="Category"
              value={plant.category}
              colorClass="text-purple-600"
            />
          )}

          {/* Custom Reminder */}
          {plant.reminder && (
            <DetailBox
              icon={<Bell className="w-5 h-5" />}
              label="Smart Reminder"
              value={plant.reminder}
              colorClass="text-orange-600"
            />
          )}
        </div>

        {/* NOTES SECTION */}
        {plant.notes && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
            <h2 className="font-semibold text-xl text-emerald-700 flex items-center gap-2 mb-2">
              <NotebookPen className="w-5 h-5" /> Care Notes
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {plant.notes}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
          {/* Back Button (Primary) */}
          <button
            onClick={() => navigate("/my-plants")}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition font-semibold shadow-lg shadow-emerald-200"
          >
            <ArrowLeft size={18} /> Back to My Plants
          </button>

          {/* Edit Button (Secondary) */}
          <button
            onClick={() => navigate(`/add-plant/${plant._id}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 transition font-semibold shadow-lg shadow-yellow-200"
          >
            <Pencil size={18} /> Edit Plant
          </button>

          {/* Delete Button (Danger) */}
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold shadow-lg shadow-red-200"
          >
            <Trash2 size={18} /> Delete Plant
          </button>
        </div>

        {/* META INFO (Footer) */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-3 h-3" />
            <p>
              **Added:**{" "}
              {new Date(plant.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              &nbsp;|&nbsp; **Last Updated:**{" "}
              {new Date(plant.updatedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
