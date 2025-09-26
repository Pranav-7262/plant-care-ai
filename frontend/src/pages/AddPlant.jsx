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
        navigate("/my-plants");
      } else {
        await addPlant(form);
        toast.success("Plant added successfully!");
        navigate("/my-plants");
      }
    } catch (err) {
      console.error("Save plant failed", err);
      toast.error("Failed to save plant");
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // UPDATED CONTAINER: Applied your requested sizing/padding
    <div className="flex justify-center items-center px-[3vw] md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans bg-amber-50 min-h-screen">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            {id ? "✏️ Update Your Green Buddy" : "🌿 Add a New Plant"}
          </h1>
          <p className="mt-2 text-xl text-emerald-700 font-medium">
            Keep track of your precious greenery.
          </p>
        </header>

        {error && (
          <div className="p-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Plant Name */}
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Plant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm placeholder:text-gray-400"
              placeholder="E.g. Peace Lily"
            />
          </div>

          {/* Species */}
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Species <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm placeholder:text-gray-400"
              placeholder="E.g. Spathiphyllum wallisii"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm bg-white appearance-none"
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
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Location
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm bg-white appearance-none"
            >
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Balcony">Balcony</option>
              <option value="Garden">Garden</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Last Watered */}
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Last Watered <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="lastWatered"
              value={form.lastWatered}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm bg-white"
            />
          </div>

          {/* Watering Frequency (days) */}
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Watering Frequency (days)
            </label>
            <input
              type="number"
              name="wateringFrequency"
              value={form.wateringFrequency}
              onChange={handleChange}
              min={1}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm placeholder:text-gray-400"
              placeholder="E.g. 7"
            />
          </div>

          {/* Health */}
          <div className="space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Health Status
            </label>
            <select
              name="health"
              value={form.health}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm bg-white appearance-none"
            >
              <option value="Healthy">💚 Healthy</option>
              <option value="Needs Attention">💛 Needs Attention</option>
              <option value="Sick">💔 Sick</option>
            </select>
          </div>

          {/* Reminder Checkbox */}
          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              id="reminderEnabled"
              name="reminderEnabled"
              checked={form.reminderEnabled}
              onChange={handleChange}
              className="h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label
              htmlFor="reminderEnabled"
              className="text-base font-semibold text-gray-700"
            >
              Enable watering reminders
            </label>
          </div>

          {/* Notes (Full Width) */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-base font-semibold text-gray-700">
              Notes (Max 300 chars)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={300}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm placeholder:text-gray-400"
              placeholder="E.g. Sacred plant, needs bright, indirect sunlight. Repotted last month."
            />
          </div>

          {/* Image URL & Preview (Full Width) */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-base font-semibold text-gray-700">
              Image URL (optional)
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition duration-150 shadow-sm placeholder:text-gray-400"
              placeholder="Enter image URL"
            />
            <div className="pt-2">
              <img
                src={form.image || defaultImage}
                alt="Plant Preview"
                className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
              />
            </div>
          </div>

          {/* Submit Button (Full Width) */}
          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-2 mt-4 w-full py-3 rounded-xl text-lg font-bold transition duration-300 ease-in-out transform ${
              loading
                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : id ? (
              "Update Plant"
            ) : (
              "Add Plant to Collection"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
