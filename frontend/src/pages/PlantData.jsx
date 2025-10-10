import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PlantDataCard from "../components/PlantDataCard";
import Spinner from "../components/Spinner";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";

// Initial state for filters for easy reset
const initialActiveFilters = {
  categories: [],
  zones: [],
  origins: [],
  climates: [],
};

const PlantData = () => {
  const [allPlantData, setAllPlantData] = useState([]);
  const [filteredPlantData, setFilteredPlantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialActiveFilters);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = async () => {
    const options = {
      method: "GET",
      url: "https://house-plants2.p.rapidapi.com/all-lite",
      headers: {
        "x-rapidapi-key": "c111e46814msh85fff7a26234c45p196911jsn584144cebbd2",
        "x-rapidapi-host": "house-plants2.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setAllPlantData(response.data || []);
      setFilteredPlantData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch plant data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allPlantData];
    setCurrentPage(1); // Reset to first page on filter/search change

    // 1. Search Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (plant) =>
          (plant["Common name"] &&
            plant["Common name"][0]
              .toLowerCase()
              .includes(lowerCaseSearchTerm)) ||
          (plant["Latin name"] &&
            plant["Latin name"].toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // 2. Category Filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((plant) =>
        activeFilters.categories.includes(plant.Categories)
      );
    }

    // 3. Zone Filter
    if (activeFilters.zones.length > 0) {
      filtered = filtered.filter(
        (plant) =>
          plant.Zone &&
          plant.Zone.some((zone) => activeFilters.zones.includes(zone))
      );
    }

    // 4. Origin Filter
    if (activeFilters.origins.length > 0) {
      filtered = filtered.filter(
        (plant) =>
          plant.Origin &&
          plant.Origin.some((origin) => activeFilters.origins.includes(origin))
      );
    }

    // 5. Climate Filter
    if (activeFilters.climates.length > 0) {
      filtered = filtered.filter(
        (plant) => plant.Climat && activeFilters.climates.includes(plant.Climat)
      );
    }

    setFilteredPlantData(filtered);
  }, [searchTerm, allPlantData, activeFilters]);

  const { uniqueCategories, uniqueZones, uniqueOrigins, uniqueClimates } =
    useMemo(() => {
      const categories = [
        ...new Set(allPlantData.map((item) => item.Categories).filter(Boolean)),
      ].sort();
      const zones = [
        ...new Set(allPlantData.flatMap((item) => item.Zone).filter(Boolean)),
      ].sort();
      const origins = [
        ...new Set(allPlantData.flatMap((item) => item.Origin).filter(Boolean)),
      ].sort();
      const climates = [
        ...new Set(allPlantData.map((item) => item.Climat).filter(Boolean)),
      ].sort();

      return {
        uniqueCategories: categories,
        uniqueZones: zones,
        uniqueOrigins: origins,
        uniqueClimates: climates,
      };
    }, [allPlantData]);

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

  const handleClearFilters = () => {
    setActiveFilters(initialActiveFilters);
    setSearchTerm("");
  };

  const isFilterActive =
    searchTerm || Object.values(activeFilters).some((arr) => arr.length > 0);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlantData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPlantData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to the top of the main content area when changing pages
      document.querySelector(".main-content-scroll").scrollTo(0, 0);
    }
  };

  // Modern Pagination UI Logic
  const getPaginationGroup = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-[#f0f9f3] h-screen flex flex-col">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center py-4 sm:py-5 text-[#1a382e] drop-shadow-sm border-b border-green-200 sticky top-0 bg-white z-20 tracking-tight leading-snug">
        🌿 <span className="text-[#245c44]">Household Plant Collection</span>
      </h1>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed & Scrollable */}
        <div
          className={`
        bg-white w-72 lg:w-80
        flex-shrink-0
        border-r border-green-100
        z-30
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${
          filterOpen
            ? "translate-x-0 fixed inset-y-0 left-0 shadow-2xl"
            : "-translate-x-full fixed inset-y-0 left-0"
        }
        md:relative
      `}
        >
          {/* Backdrop for mobile */}
          {filterOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-20 md:hidden"
              onClick={() => setFilterOpen(false)}
            />
          )}

          <div className="h-full flex flex-col">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center py-4 px-4">
                <h3 className="text-xl font-semibold text-green-800">
                  Filter Options
                </h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="md:hidden text-gray-500 hover:text-green-600 p-1 rounded-full transition-colors"
                  aria-label="Close Filters"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-4 pb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Common or Latin name..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm text-gray-800 placeholder:text-gray-400 transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable filters body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-8">
              {/* Clear Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center justify-center w-full px-4 py-2 mb-6 text-sm font-semibold rounded-xl bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 transition-all shadow-sm"
                >
                  <RefreshCcw size={16} className="mr-2" />
                  Clear All Filters & Search
                </button>
              )}

              {/* Dynamic Filters */}
              {[
                ["Category", uniqueCategories, "categories"],
                ["Zone", uniqueZones, "zones"],
                ["Origin", uniqueOrigins, "origins"],
                ["Climate", uniqueClimates, "climates"],
              ].map(([label, list, key]) => (
                <div key={label} className="border-t border-gray-100 pt-4">
                  <h4 className="font-bold text-lg text-gray-800 mb-3">
                    {label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {list.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleFilterChange(key, item)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          activeFilters[key].includes(item)
                            ? "bg-[#3a684b] text-white shadow-md shadow-[#3a684b]/30"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filter Button (Mobile Only) */}
          <div className="pb-4 md:hidden sticky top-[73px] bg-[#f0f9f3] z-10 -mt-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-[#3a684b] text-white font-semibold rounded-xl shadow-lg hover:bg-[#2a4d3a] transition-all"
            >
              <SlidersHorizontal size={20} />
              Open Filters (
              {Object.values(activeFilters).flat().length +
                (searchTerm ? 1 : 0)}
              )
            </button>
          </div>

          {/* Results Header */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-xl font-medium text-gray-700">
              Showing{" "}
              <span className="font-bold text-[#1a382e]">
                {filteredPlantData.length}
              </span>{" "}
              results
            </p>
            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="hidden md:flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 transition-all"
              >
                <RefreshCcw size={16} className="mr-2" />
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <Spinner />
          ) : filteredPlantData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 xl:gap-8 place-items-stretch">
                {currentItems.map((item) => (
                  <PlantDataCard key={item.id} data={item} />
                ))}
              </div>

              {/* Pagination */}
              {filteredPlantData.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-1 mt-10 p-4 border-t border-green-200 bg-white rounded-xl shadow-lg">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 mx-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {getPaginationGroup().map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 rounded-full font-semibold text-lg mx-0.5 ${
                        currentPage === page
                          ? "bg-[#3a684b] text-white shadow-md ring-2 ring-[#3a684b]/50"
                          : "bg-transparent text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                      ...
                    </span>
                  )}
                  {totalPages > 5 &&
                    !getPaginationGroup().includes(totalPages) && (
                      <button
                        onClick={() => paginate(totalPages)}
                        className={`w-10 h-10 rounded-full font-semibold text-lg mx-0.5 ${
                          currentPage === totalPages
                            ? "bg-[#3a684b] text-white shadow-md ring-2 ring-[#3a684b]/50"
                            : "bg-transparent text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 mx-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-xl text-gray-600 mt-20 p-8 bg-white rounded-xl shadow-lg mx-auto max-w-lg">
              😔 No plants found matching your search. Try adjusting your query
              or filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantData;
