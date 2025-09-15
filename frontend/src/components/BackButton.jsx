// src/components/BackButton.jsx

import React from "react";
// Or use react-router-dom or a simple window.history

const BackButton = () => {
  // We can use a router's history, or the native browser history.
  // For this example, let's use the native browser history, which is universal.
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="
        relative
        flex items-center justify-center
        px-6 py-2
        bg-white
        border border-gray-300
        rounded-full
        shadow-lg
        text-sm font-medium text-gray-700
        hover:scale-105
        hover:shadow-xl
        active:scale-95
        transition-all duration-300
        group
        overflow-hidden
      "
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>

      {/* Text */}
      <span>Back</span>

      {/* Hover Effect Layer */}
      <div
        className="
          absolute inset-0
          bg-gray-100
          rounded-full
          -z-10
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-300
        "
      ></div>
    </button>
  );
};

export default BackButton;
