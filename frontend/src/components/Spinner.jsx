import React from "react";

const Spinner = () => {
  return (
    // Centering the spinner in the middle of its container
    <div className="flex items-center justify-center h-full min-h-[200px] w-full">
      <svg
        // The core style: subtle animation, larger size (12/12), and use emerald color
        className="animate-spin h-12 w-12 text-emerald-600 drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label="Loading content"
      >
        {/* Background circle, slightly transparent white to give depth */}
        <circle
          className="opacity-10" // Reduced opacity
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        {/* Foreground path, highly visible with the vibrant color */}
        <path
          className="opacity-75 fill-current" // Changed to fill the path
          fill="currentColor"
          // This path creates the spinning quarter-circle effect
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
