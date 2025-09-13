// src/pages/AddPlant.jsx
import { useEffect, useState } from "react";
import { addPlant, updatePlant, fetchPlantById } from "../api";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function AddPlant() {
  const { id } = useParams(); // check if editing
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    species: "",
    location: "Living Room",
    lastWatered: "",
    wateringFrequency: 7,
    health: "Healthy",
    notes: "",
    image: "",
    reminderEnabled: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultImage =
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80";

  // 🔹 If id exists → fetch plant details for edit
  useEffect(() => {
    const loadPlant = async () => {
      if (id) {
        try {
          const { data } = await fetchPlantById(id);
          setForm({
            name: data.name || "",
            species: data.species || "",
            location: data.location || "Living Room",
            lastWatered: data.lastWatered?.split("T")[0] || "",
            wateringFrequency: data.wateringFrequency || 7,
            health: data.health || "Healthy",
            notes: data.notes || "",
            image: data.image || "",
            reminderEnabled: data.reminderEnabled ?? true,
          });
        } catch (err) {
          console.error("Error loading plant:", err);
          setError("⚠️ Failed to load plant details.");
        }
      }
    };
    loadPlant();
  }, [id]);

  // 🔹 Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // 🔹 Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (id) {
        await updatePlant(id, form);
        toast.success("Plant updated successfully!");
      } else {
        await addPlant(form);
        toast.success("Plant added successfully!");
      }

      setTimeout(() => {
        navigate("/my-plants");
      }, 3500);
    } catch (err) {
      console.error("Save plant failed", err);
      toast.error("Failed to save plant");
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-center px-[3vw] md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        {id ? "✏️ Update Plant" : "🌱 Add a Plant"}
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-lg rounded-2xl p-6"
      >
        {/* Plant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plant Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="E.g. Tulsi"
          />
        </div>

        {/* Species */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species
          </label>
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="E.g. Ocimum tenuiflorum"
          />
        </div>

        {/* 🌿 Category - NEW FIELD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Flowering">Flowering</option>
            <option value="Succulent">Succulent</option>
            <option value="Herb">Herb</option>
            <option value="Tree">Tree</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Balcony</option>
            <option>Garden</option>
            <option>Office</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Watered
          </label>
          <input
            type="date"
            name="lastWatered"
            value={form.lastWatered}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Watering Frequency (days)
          </label>
          <input
            type="number"
            name="wateringFrequency"
            value={form.wateringFrequency}
            onChange={handleChange}
            min={1}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Health
          </label>
          <select
            name="health"
            value={form.health}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option>Healthy</option>
            <option>Needs Attention</option>
            <option>Sick</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            maxLength={300}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="E.g. Sacred plant, needs sunlight"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-green-500"
            placeholder="Enter image URL"
          />
          <img
            src={form.image || defaultImage}
            alt="Plant Preview"
            className="w-32 h-32 object-cover rounded-md shadow"
          />
        </div>

        <div className="col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            name="reminderEnabled"
            checked={form.reminderEnabled}
            onChange={handleChange}
          />
          <span>Enable watering reminders</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 py-2 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Saving..." : id ? "Update Plant" : "Add Plant"}
        </button>
      </form>
    </div>
  );
}
