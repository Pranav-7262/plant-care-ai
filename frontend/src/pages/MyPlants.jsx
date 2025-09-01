// src/pages/MyPlants.jsx
import { useEffect, useState } from "react";
import { fetchPlants } from "../api";

export default function MyPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPlants = async () => {
      try {
        const { data } = await fetchPlants();
        // ✅ backend should return { plants: [...] }
        setPlants(data.plants || []);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("Failed to load plants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getPlants();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌱 My Plants</h1>
      {plants.length === 0 ? (
        <p>No plants found. Add one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div
              key={plant._id}
              className="p-4 rounded-xl shadow-md border bg-white"
            >
              <h2 className="text-xl font-semibold">{plant.name}</h2>
              <p className="text-gray-600 italic">{plant.species}</p>
              <p>📍 {plant.location}</p>
              {plant.nextWatering && (
                <p>💧 Next Watering: {plant.nextWatering.split("T")[0]}</p>
              )}
              {plant.reminder && (
                <p className="text-red-600 font-medium">{plant.reminder}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
