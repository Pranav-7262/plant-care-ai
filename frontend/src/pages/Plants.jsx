import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, Leaf } from "lucide-react";

import PlantCard from "../components/PlantCard";

// Placeholder for Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center h-48">
    <svg
      className="animate-spin h-8 w-8 text-green-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

// --- No Results Component ---
// This component is self-contained and uses the imported 'Leaf' icon
const NoResultsFound = () => (
  <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 mt-10 w-full max-w-xl mx-auto">
    <div
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full text-center 
                 transform transition-all duration-300 hover:shadow-2xl"
    >
      <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-red-100 flex items-center justify-center">
        <Leaf className="w-8 h-8 text-red-600" aria-hidden="true" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Nothing Matches Your Search
      </h2>

      <p className="text-lg text-gray-600 max-w-md mx-auto">
        We couldn't find any pests or diseases that match your current **search
        terms or active filters**. Try clearing your selections or checking your
        spelling!
      </p>
    </div>
  </div>
);

const Plants = () => {
  const [plantData, setPlantData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ hosts: [] });

  // Placeholder key and endpoint, should be replaced with actual working logic
  const PEST_DISEASE_API_URL =
    "https://perenual.com/api/pest-disease-list?key=sk-aKMV689377cf14f2e11719&page=1";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(PEST_DISEASE_API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      // Ensure we handle the potentially empty 'data' array gracefully
      const pestsAndDiseases = Array.isArray(data.data) ? data.data : [];
      setPlantData(pestsAndDiseases);
      setFilteredData(pestsAndDiseases);
    } catch (error) {
      console.error("Failed to fetch pest & disease data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let newFilteredData = [...plantData];

    // 1. Search Filtering
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      newFilteredData = newFilteredData.filter(
        (item) =>
          item.common_name?.toLowerCase().includes(lowerCaseSearch) ||
          item.scientific_name?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. Host Filter
    if (activeFilters.hosts.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        item.host?.some((host) => activeFilters.hosts.includes(host))
      );
    }

    setFilteredData(newFilteredData);
  }, [plantData, searchTerm, activeFilters]);

  // Extract and sort unique host names for filter buttons
  const uniqueHosts = [
    ...new Set(plantData.flatMap((item) => item.host).filter(Boolean)),
  ].sort();

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prevFilters) => {
      const currentFilters = prevFilters[filterType];
      if (currentFilters.includes(value)) {
        // Remove filter
        return {
          ...prevFilters,
          [filterType]: currentFilters.filter((item) => item !== value),
        };
      } else {
        // Add filter
        return {
          ...prevFilters,
          [filterType]: [...currentFilters, value],
        };
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters({ hosts: [] });
    setSearchTerm("");
    setFilterOpen(false);
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col">
      {/* Sticky Header */}
      <h1 className="text-3xl font-extrabold text-center py-6 text-gray-800 bg-white border-b border-green-100 shadow-sm sticky top-0 z-20">
        🐛 Plant Disease & Pest Library
      </h1>

      {/* Content Wrapper (takes full remaining height) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (Filters) */}
        <aside
          className={`bg-white w-72 lg:w-80 border-r border-gray-200 flex-shrink-0
        transform transition-all duration-300 ease-in-out z-30 flex flex-col
        ${
          filterOpen
            ? "translate-x-0 fixed inset-y-0 left-0 shadow-2xl"
            : "-translate-x-full fixed inset-y-0 left-0"
        }
        lg:translate-x-0 lg:relative
      `}
        >
          {/* Mobile backdrop */}
          {filterOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-20 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
          )}

          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Filters header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-2xl font-bold text-green-700 flex items-center">
                <SlidersHorizontal size={20} className="mr-2" />
                Filters
              </h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="lg:hidden text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full bg-gray-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search diseases & pests..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-500 shadow-inner text-gray-700 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Host Filter */}
            <div>
              <h4 className="font-bold text-lg text-gray-800 mb-3 border-b border-gray-100 pb-2">
                Host Plants
              </h4>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
                {uniqueHosts.map((host) => (
                  <button
                    key={host}
                    onClick={() => handleFilterChange("hosts", host)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
                  ${
                    activeFilters.hosts.includes(host)
                      ? "bg-green-600 text-white shadow-green-300/50 hover:bg-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }`}
                  >
                    {host}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || activeFilters.hosts.length > 0) && (
              <button
                onClick={clearFilters}
                className="mt-6 w-full py-2 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center gap-2 border border-red-300"
              >
                <X size={18} />
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8">
          {/* Mobile Filter Button */}
          <div className="pb-6 lg:hidden sticky top-0 bg-gray-50 z-10">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-300/50 hover:bg-green-700 transition-all transform hover:scale-[1.005]"
            >
              <SlidersHorizontal size={20} />
              Filter Options
            </button>
          </div>

          {/* Loading / Content */}
          {loading ? (
            <Spinner />
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {filteredData.map((item) => (
                <PlantCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <NoResultsFound />
          )}
        </main>
      </div>
    </div>
  );
};

export default Plants;
