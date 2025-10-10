import React from "react";
import { Link } from "react-router-dom";

// Note: scientific_name is an array of strings from the API,
// so we will join it to display a single string.
const PlantCard = ({
  id,
  common_name,
  scientific_name, // This is an array: ["Scientific Name 1", "Scientific Name 2"]
  images,
  host,
}) => {
  // 1. Correctly determine the image URL
  // The API response for a single item often has a `default_image` object,
  // but if it's passed as an `images` array, we handle it this way.
  const imageUrl = images && images.length > 0 ? images[0].medium_url : null;

  // 2. Format the scientific name (The FIX for the "No scientific name" issue)
  const formattedScientificName =
    scientific_name &&
    Array.isArray(scientific_name) &&
    scientific_name.length > 0
      ? scientific_name.join(", ")
      : "No scientific name available";

  // 3. Format the hosts (Optional: Adds more detail to the card)
  const formattedHosts =
    host && Array.isArray(host) && host.length > 0
      ? host.slice(0, 2).join(", ") + (host.length > 2 ? "..." : "")
      : "Host info unavailable";

  return (
    <div
      className="group flex flex-col h-full max-w-sm rounded-2xl overflow-hidden 
                 shadow-md hover:shadow-xl bg-white border border-gray-100 
                 transition-all duration-300 ease-in-out hover:scale-[1.02]"
    >
      {/* Plant Image */}
      <img
        className="w-full h-56 object-cover rounded-t-2xl 
                     transition-all duration-300 ease-in-out group-hover:brightness-105"
        src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
        // Use the common name for alt text, with a fallback
        alt={common_name || "Unknown Pest/Disease"}
        // Add onerror for broken links
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://via.placeholder.com/400x300?text=Image+Not+Found";
        }}
      />

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Plant Name (FIXED: Added fallback) */}
        <h2 className="font-extrabold text-lg md:text-xl text-[#1a382e] mb-2 line-clamp-2">
          {common_name || "Unknown Pest/Disease"}
        </h2>

        {/* Scientific Name (FIXED: Using formatted string) */}
        <p
          className="text-gray-600 text-sm italic mb-2 line-clamp-1"
          title={formattedScientificName}
        >
          {formattedScientificName}
        </p>

        {/* Host Info (NEW: Added Host details) */}
        <p className="text-gray-500 text-xs mb-4 line-clamp-1">
          <span className="font-semibold text-[#3a684b]">Host(s):</span>{" "}
          {formattedHosts}
        </p>

        <Link
          to={`/plants/${id}`}
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

export default PlantCard;
