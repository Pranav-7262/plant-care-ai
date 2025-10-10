import React from "react";
import { Leaf, PlusCircle } from "lucide-react";

// This component displays a message when no plants match the criteria
// or when the user's plant list is empty.
const NoPlantsFound = ({ onAddPlantClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-16 lg:p-20 mt-10 w-full max-w-4xl mx-auto">
      <div
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 w-full text-center 
                   transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
      >
        {/* Decorative Icon */}
        <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <Leaf className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>

        {/* Primary Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          No Plants Found
        </h2>

        {/* Detailed Explanation */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          It looks like **no plants match your current search or filter
          criteria**. Try broadening your search terms or clearing your filters!
        </p>

        {/* Action Button */}
        <button
          onClick={onAddPlantClick}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold 
                     rounded-full shadow-md text-white bg-green-600 hover:bg-green-700 
                     transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add a Plant
        </button>
      </div>
    </div>
  );
};

export default NoPlantsFound;
