import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const PlantDataDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlantData = async () => {
    const options = {
      method: "GET",
      url: "https://house-plants2.p.rapidapi.com/all-lite",
      headers: {
        "x-rapidapi-key": "c111e46814msh85fff7a26234c45p196911jsn584144cebbd2",
        "x-rapidapi-host": "house-plants2.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const allPlants = response.data || [];
      const matched = allPlants.find((p) => p.id === id);
      setPlant(matched);
    } catch (error) {
      console.error("Error fetching plant details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantData();
  }, [id]);

  if (loading) return <Spinner />;

  if (!plant) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Plant not found.
      </div>
    );
  }

  const {
    Img,
    "Common name": commonName,
    "Latin name": latinName,
    "Common name (fr.)": commonFr,
    Family,
    Categories,
    Origin,
    Climat,
    Zone,
    Description,
    "Other names": otherNames,
  } = plant;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <Link to="/explore" className="text-green-600 hover:underline block mb-4">
        ← Back to Plants
      </Link>

      <img
        src={Img || "https://via.placeholder.com/500x300?text=No+Image"}
        alt={commonName?.[0] || latinName}
        className="w-full max-h-[300px] object-cover rounded mb-4"
      />

      <h1 className="text-3xl font-bold mb-2">
        {commonName?.[0] || "Unknown Plant"}
      </h1>
      <p className="italic text-gray-700 mb-4">
        {latinName || "Latin name unknown"}
      </p>

      <div className="grid gap-2 text-sm text-gray-800">
        {commonFr && (
          <p>
            <strong>Common Name (FR):</strong> {commonFr}
          </p>
        )}
        {Family && (
          <p>
            <strong>Family:</strong> {Family}
          </p>
        )}
        {Categories && (
          <p>
            <strong>Category:</strong> {Categories}
          </p>
        )}
        {Origin && Origin.length > 0 && (
          <p>
            <strong>Origin:</strong> {Origin.join(", ")}
          </p>
        )}
        {Climat && (
          <p>
            <strong>Climate:</strong> {Climat}
          </p>
        )}
        {Zone && Zone.length > 0 && (
          <p>
            <strong>Zone:</strong> {Zone.join(", ")}
          </p>
        )}
        {otherNames && (
          <p>
            <strong>Other Names:</strong> {otherNames}
          </p>
        )}
        {Description && (
          <p>
            <strong>Description:</strong> {Description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlantDataDetails;
