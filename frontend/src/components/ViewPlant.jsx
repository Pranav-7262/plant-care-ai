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
      className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-72">
        <img
          src={
            plant.image ||
            "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"
          }
          alt={plant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 font-sans">
        <h1 className="text-3xl font-bold text-green-700">{plant.name}</h1>
        <p className="text-gray-500 italic mb-4">{plant.species}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={plant.location}
          />
          {plant.category && (
            <InfoItem
              icon={<Tag className="w-4 h-4" />}
              label="Category"
              value={plant.category}
            />
          )}
          <InfoItem
            icon={<Droplet className="w-4 h-4" />}
            label="Water Every"
            value={`${plant.wateringFrequency} days`}
          />
          {plant.lastWatered && (
            <InfoItem
              icon={<Droplet className="w-4 h-4 text-blue-500" />}
              label="Last Watered"
              value={plant.lastWatered.split("T")[0]}
            />
          )}
          {plant.nextWatering && (
            <InfoItem
              icon={<Calendar className="w-4 h-4" />}
              label="Next Watering"
              value={plant.nextWatering.split("T")[0]}
            />
          )}
          <InfoItem
            icon={<Heart className="w-4 h-4" />}
            label="Health"
            value={plant.health}
          />

          {plant.reminderEnabled && (
            <InfoItem
              icon={<Bell className="w-4 h-4" />}
              label="Reminder"
              value={plant.reminderEnabled ? "Enabled" : "Disabled"}
            />
          )}
        </div>

        {/* Notes */}
        {plant.notes && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg text-green-600 flex items-center gap-2">
              <NotebookPen className="w-5 h-5" /> Notes
            </h2>
            <p className="text-gray-700 mt-1">{plant.notes}</p>
          </div>
        )}

        {/* Meta info */}
        <div className="text-xs text-gray-500 flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Added:{" "}
            {new Date(plant.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Last updated:{" "}
            {new Date(plant.updatedAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate(`/add-plant/${plant._id}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={() => navigate("/my-plants")}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* Small reusable component for displaying info */
function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
      <p className="text-xs text-gray-500 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  );
}
