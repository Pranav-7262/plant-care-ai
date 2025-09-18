import React from "react";
import { Link } from "react-router-dom";

const PlantCard = ({ id, common_name, scientific_name, images }) => {
  // Safely access the image URL
  const imageUrl =
    images && images.length > 0 ? images[0].medium_url : "photo not found";

  return (
    <div
      className="group max-w-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl bg-white
                    transition-all duration-300 ease-in-out hover:scale-103 cursor-pointer border border-gray-100"
    >
      <img
        className="w-full h-56 object-cover rounded-t-xl
                   transition-all duration-300 ease-in-out group-hover:opacity-90 group-hover:brightness-105"
        src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"} // Fallback image
        alt={common_name || scientific_name || "Plant image"}
      />
      <div className="px-6 py-4">
        <div className="font-extrabold text-xl md:text-2xl mb-2 text-[#1a382e]">
          {common_name || "Unknown Plant"}
        </div>
        <p className="text-gray-600 text-base italic mb-3">
          {scientific_name || "No scientific name available"}
        </p>

        <Link
          to={`/plants/${id}`}
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

export default PlantCard;
