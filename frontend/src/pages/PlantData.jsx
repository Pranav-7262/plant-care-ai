import React, { useEffect, useState } from "react";
import axios from "axios";
import PlantDataCard from "../components/PlantDataCard";
import Spinner from "../components/Spinner";

const PlantData = () => {
  const [plantData, setPlantData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const options = {
      method: "GET",
      url: "https://house-plants2.p.rapidapi.com/all-lite",
      headers: {
        "x-rapidapi-key": "c111e46814msh85fff7a26234c45p196911jsn584144cebbd2", // ⚠️ Use env var in prod
        "x-rapidapi-host": "house-plants2.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setPlantData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch plant data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        🌿 House Plants Collection
      </h1>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
          {plantData.map((item) => (
            <PlantDataCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantData;
