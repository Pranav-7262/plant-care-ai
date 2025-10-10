import React from "react";
import { Link } from "react-router-dom";

const PlantDataCard = ({ data }) => {
  const { id, Img, "Common name": commonName, "Latin name": latinName } = data;

  const imageUrl = Img || "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div
      className="group flex flex-col h-full rounded-2xl overflow-hidden 
                 shadow-md hover:shadow-xl bg-white border border-gray-100 
                 transition-all duration-300 ease-in-out hover:scale-[1.02]"
    >
      {/* Image */}
      <img
        className="w-full h-56 object-cover rounded-t-2xl 
                   transition-all duration-300 ease-in-out group-hover:brightness-105"
        src={imageUrl}
        alt={commonName || latinName || "Plant image"}
      />

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Plant Name */}
        <h2 className="font-extrabold text-lg md:text-xl text-[#1a382e] mb-2 line-clamp-2">
          {commonName || "Unknown Plant"}
        </h2>

        {/* Latin Name */}
        <p className="text-gray-600 text-base italic mb-4 line-clamp-1">
          {latinName || "No scientific name available"}
        </p>

        {/* View Details Button (pushed to bottom) */}
        <Link
          to={`/plantsdata/${id}`}
          className="mt-auto inline-block px-5 py-2 bg-[#3a684b] text-white text-sm md:text-base font-semibold
                     rounded-full shadow-md hover:shadow-lg hover:bg-[#2a4d3a]
                     transition-all duration-300 ease-in-out text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PlantDataCard;
