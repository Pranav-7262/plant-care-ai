import React from "react";
import { Link } from "react-router-dom";

const PlantDataCard = ({ data }) => {
  const { id, Img, "Common name": commonName, "Latin name": latinName } = data;

  const imageUrl = Img || "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-48 object-cover"
        src={imageUrl}
        alt={commonName?.[0] || latinName || "Unknown Plant"}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {commonName?.[0] || "Unknown Plant"}
        </div>
        <p className="text-gray-700 text-base italic mb-2">
          {latinName || "Unknown"}
        </p>

        <Link
          to={`/plantsdata/${id}`}
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PlantDataCard;
