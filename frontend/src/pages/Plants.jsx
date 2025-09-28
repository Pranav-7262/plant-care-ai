import React, { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";
import Spinner from "../components/Spinner";
import { Search, SlidersHorizontal, X } from "lucide-react";

const Plants = () => {
  const [plantData, setPlantData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    hosts: [],
  });

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://perenual.com/api/pest-disease-list?key=sk-aKMV689377cf14f2e11719&page=1"
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPlantData(data.data || []);
      setFilteredData(data.data || []);
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

    // Filter by search term
    if (searchTerm) {
      newFilteredData = newFilteredData.filter(
        (item) =>
          item.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by hosts
    if (activeFilters.hosts.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        item.host?.some((host) => activeFilters.hosts.includes(host))
      );
    }

    setFilteredData(newFilteredData);
  }, [plantData, searchTerm, activeFilters]);

  const uniqueHosts = [
    ...new Set(plantData.flatMap((item) => item.host).filter(Boolean)),
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
      <h1 className="text-3xl font-bold text-center py-4 text-[#1a382e] drop-shadow-sm border-b border-green-100">
        🐛 Common Plant Diseases & Pests
      </h1>

      <div className="flex flex-1 overflow-hidden">
        {/* Filter Sidebar */}
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
            md:block md:h-full md:overflow-y-auto
          `}
        >
          {/* Backdrop (Mobile only) */}
          {filterOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setFilterOpen(false)}
            />
          )}

          {/* Scrollable Filters */}
          <div className="h-full p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1a382e]">Filters</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search diseases..."
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

            {/* Advanced Filters */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Host Plants</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueHosts.map((host) => (
                  <button
                    key={host}
                    onClick={() => handleFilterChange("hosts", host)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                      activeFilters.hosts.includes(host)
                        ? "bg-[#629c78] text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {host}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mobile Filter Button */}
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
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
              {filteredData.map((item) => (
                <PlantCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600 mt-10">
              No pests or diseases found matching your search. Try a different
              query or filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plants;
