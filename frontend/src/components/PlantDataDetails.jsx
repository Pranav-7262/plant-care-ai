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
      const matched = allPlants.find((p) => String(p.id) === String(id));
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
        🌱 Plant not found.
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
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        to="/plantsdata"
        className="inline-flex items-center gap-2 text-[#3a684b] hover:underline font-medium mb-6"
      >
        ← Back to Plants
      </Link>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src={Img || "https://via.placeholder.com/500x350?text=No+Image"}
              alt={commonName?.[0] || latinName}
              className="w-full h-72 md:h-full object-cover"
            />
          </div>

          {/* Info Section */}
          <div className="p-6 md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-extrabold text-[#1a382e] mb-2">
              {commonName?.[0] || "Unknown Plant"}
            </h1>
            <p className="italic text-gray-600 mb-4 text-lg">
              {latinName || "Latin name unknown"}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Categories && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {Categories}
                </span>
              )}
              {Family && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {Family}
                </span>
              )}
              {Climat && (
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  {Climat}
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="space-y-3 text-gray-800 text-sm leading-relaxed">
              {commonFr && (
                <p>
                  <strong className="text-gray-900">Common Name (FR):</strong>{" "}
                  {commonFr}
                </p>
              )}
              {Origin && Origin.length > 0 && (
                <p>
                  <strong className="text-gray-900">Origin:</strong>{" "}
                  {Origin.join(", ")}
                </p>
              )}
              {Zone && Zone.length > 0 && (
                <p>
                  <strong className="text-gray-900">Zone:</strong>{" "}
                  {Zone.join(", ")}
                </p>
              )}
              {otherNames && (
                <p>
                  <strong className="text-gray-900">Other Names:</strong>{" "}
                  {otherNames}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        {Description && (
          <div className="px-6 py-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-[#1a382e] mb-3">
              🌱 Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{Description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDataDetails;
