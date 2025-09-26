import React, { useEffect, useState } from "react";
import axios from "axios";
import PlantDataCard from "../components/PlantDataCard";
import Spinner from "../components/Spinner";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PlantData = () => {
  const [allPlantData, setAllPlantData] = useState([]);
  const [filteredPlantData, setFilteredPlantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    zones: [],
    origins: [],
    climates: [],
  });

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

    if (searchTerm) {
      filtered = filtered.filter(
        (plant) =>
          (plant["Common name"] &&
            plant["Common name"][0]
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (plant["Latin name"] &&
            plant["Latin name"]
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((plant) =>
        activeFilters.categories.includes(plant.Categories)
      );
    }

    if (activeFilters.zones.length > 0) {
      filtered = filtered.filter(
        (plant) =>
          plant.Zone &&
          plant.Zone.some((zone) => activeFilters.zones.includes(zone))
      );
    }

    if (activeFilters.origins.length > 0) {
      filtered = filtered.filter(
        (plant) =>
          plant.Origin &&
          plant.Origin.some((origin) => activeFilters.origins.includes(origin))
      );
    }

    if (activeFilters.climates.length > 0) {
      filtered = filtered.filter(
        (plant) => plant.Climat && activeFilters.climates.includes(plant.Climat)
      );
    }

    setFilteredPlantData(filtered);
  }, [searchTerm, allPlantData, activeFilters]);

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
    }
  };

  // Remaining code is the same as before...
  const uniqueCategories = [
    ...new Set(allPlantData.map((item) => item.Categories).filter(Boolean)),
  ].sort();
  const uniqueZones = [
    ...new Set(allPlantData.flatMap((item) => item.Zone).filter(Boolean)),
  ].sort();
  const uniqueOrigins = [
    ...new Set(allPlantData.flatMap((item) => item.Origin).filter(Boolean)),
  ].sort();
  const uniqueClimates = [
    ...new Set(allPlantData.map((item) => item.Climat).filter(Boolean)),
  ].sort();

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prevFilters) => {
      const currentFilters = prevFilters[filterType];
      if (currentFilters.includes(value)) {
        return {
          ...prevFilters,
          [filterType]: currentFilters.filter((item) => item !== value),
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: [...currentFilters, value],
        };
      }
    });
  };

  return (
    <div className="bg-[#f0f9f3] h-screen flex flex-col">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center py-4 text-[#1a382e] drop-shadow-sm border-b border-green-100">
        🪴 Household Plant Collection
      </h1>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* === Sidebar === */}
        <div
          className={`
          bg-white w-72 md:w-80
          flex-shrink-0
          z-50
          md:relative
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${
            filterOpen
              ? "translate-x-0 fixed inset-y-0 left-0 shadow-2xl"
              : "-translate-x-full fixed inset-y-0 left-0"
          }
          md:block
          `}
        >
          {filterOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setFilterOpen(false)}
            />
          )}

          {/* Scrollable Filters */}
          <div className="h-full max-h-screen overflow-y-auto p-6 space-y-6">
            {/* Filter Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1a382e]">Filters</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Bar within the filter column */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plants..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#3a684b] shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
              </div>
            </div>

            {/* Dynamic Filters */}
            {[
              ["Category", uniqueCategories, "categories"],
              ["Zone", uniqueZones, "zones"],
              ["Origin", uniqueOrigins, "origins"],
              ["Climate", uniqueClimates, "climates"],
            ].map(([label, list, key]) => (
              <div key={label}>
                <h4 className="font-semibold text-gray-700 mb-2">{label}</h4>
                <div className="flex flex-wrap gap-2">
                  {list.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleFilterChange(key, item)}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                        activeFilters[key].includes(item)
                          ? "bg-[#629c78] text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

        {/* === Scrollable Main Content === */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filter Button for Mobile */}
          <div className="pb-4 md:hidden">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex w-full items-center justify-center gap-2 px-6 py-2 bg-[#3a684b] text-white font-semibold rounded-full shadow-md hover:bg-[#2a4d3a] transition-all"
            >
              <SlidersHorizontal size={20} />
              Open Filters
            </button>
          </div>

          {/* Content Results */}
          {loading ? (
            <Spinner />
          ) : filteredPlantData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                {currentItems.map((item) => (
                  <PlantDataCard key={item.id} data={item} />
                ))}
              </div>
              {/* Pagination Controls */}
              {filteredPlantData.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => paginate(page + 1)}
                      className={`w-10 h-10 rounded-full font-bold transition-all ${
                        currentPage === page + 1
                          ? "bg-[#3a684b] text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-lg text-gray-600 mt-10">
              No plants found matching your search. Try a different query or
              filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantData;
