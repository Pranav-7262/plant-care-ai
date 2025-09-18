import React from "react";
import { Link } from "react-router-dom";

const PlantDataCard = ({ data }) => {
  const { id, Img, "Common name": commonName, "Latin name": latinName } = data;

  const imageUrl = Img || "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div
      className="group max-w-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl bg-white
                    transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer border border-gray-100"
    >
      <img
        className="w-full h-56 object-cover rounded-t-xl
                   transition-all duration-300 ease-in-out group-hover:brightness-105"
        src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"} // Fallback image
        alt={commonName || latinName || "Plant image"}
      />
      <div className="px-6 py-4">
        <div className="font-extrabold text-xl md:text-2xl mb-2 text-[#1a382e]">
          {commonName || "Unknown Plant"}
        </div>
        <p className="text-gray-600 text-base italic mb-3">
          {latinName || "No scientific name available"}
        </p>

        <Link
          to={`/plantsdata/${id}`}
          className="inline-block mt-4 px-5 py-2 bg-[#3a684b] text-white text-base font-semibold
                     rounded-full shadow-md hover:shadow-lg hover:bg-[#2a4d3a]
                     transition-all duration-300 ease-in-out"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PlantDataCard;
