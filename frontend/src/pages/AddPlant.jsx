import { useState } from "react";
import { addPlant } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddPlant() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPlant(form);
      setForm({
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
      toast.success("Plant added successfully! 🌿");
    } catch (err) {
      console.error("Add plant failed", err);
      toast.error("Failed to add plant");
    } finally {
      setLoading(false);
    }
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-green-700">🌱 Add a Plant</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
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
            className="w-full p-2 border rounded-lg"
            placeholder="E.g. Tulsi"
          />
        </div>

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
            className="w-full p-2 border rounded-lg"
            placeholder="E.g. Ocimum tenuiflorum"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
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
            className="w-full p-2 border rounded-lg"
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
            className="w-full p-2 border rounded-lg"
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
            className="w-full p-2 border rounded-lg"
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
            className="w-full p-2 border rounded-lg"
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
            className="w-full p-2 border rounded-lg mb-2"
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
          {loading ? "Adding Plant..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
}
