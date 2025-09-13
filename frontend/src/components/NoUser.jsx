import React from "react";

const NoUser = () => {
  return (
    <div className="text-center items-center px-[3vw] md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans mt-20">
      <p className="text-2xl font-semibold text-gray-800 mb-4">
        🔐 Please sign in to manage your plants
      </p>
      <p className="text-gray-600 mb-6">
        Access your personalized plant collection, reminders, and more.
      </p>
      <a
        href="/auth"
        className="inline-block px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-colors"
      >
        Sign In
      </a>
    </div>
  );
};

export default NoUser;
