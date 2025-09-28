import { useEffect, useState, useMemo } from "react";
import { fetchPlants, deletePlant, toggleFavourite } from "../api";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";

import {
  Search,
  Trash2,
  Edit,
  Eye,
  Bell,
  Tag,
  Droplet,
  MapPin,
  Sprout,
  Heart,
  Filter,
  X,
  ChevronLeft, // Icon for Previous
  ChevronRight, // Icon for Next
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoUser from "../components/NoUser";

// --- Constants for Dropdown/Filter Options ---
const healthOptions = ["Healthy", "Needs Attention", "Sick"];
const locationOptions = [
  "Living Room",
  "Bedroom",
  "Balcony",
  "Garden",
  "Office",
  "Other",
];
const categoryOptions = [
  "Indoor",
  "Outdoor",
  "Flowering",
  "Succulent",
  "Herb",
  "Tree",
  "Other",
];

const defaultPlantImg =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80";

// --- PAGINATION CONSTANTS ---
const ITEMS_PER_PAGE = 6; // Set to 6 plants per page

export default function MyPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    health: "",
    location: "",
    category: "",
    showFavourites: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // ... (User and Data Fetching Logic)
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const getPlants = async () => {
        try {
          const { data } = await fetchPlants();
          setPlants(data.plants || []);
        } catch (err) {
          console.error("Error fetching plants:", err);
          setError("⚠️ Failed to load plants. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      getPlants();
    } else {
      setLoading(false);
    }
    // Reset to page 1 whenever search/filters change in the effect
    // NOTE: This effect runs only on mount, but resetting the page here is fine.
  }, []);

  // Effect to reset page when search or filters change outside of the initial mount
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  // --- FILTERING LOGIC ---
  const filteredPlants = useMemo(() => {
    const list = plants.filter((p) => {
      const searchMatch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.species.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());

      const healthMatch = filters.health ? p.health === filters.health : true;
      const locationMatch = filters.location
        ? p.location === filters.location
        : true;
      const categoryMatch = filters.category
        ? p.category === filters.category
        : true;
      const favouriteMatch = filters.showFavourites ? p.favourite : true;

      return (
        searchMatch &&
        healthMatch &&
        locationMatch &&
        categoryMatch &&
        favouriteMatch
      );
    });
    // The pagination logic for setting the correct page after filtering is now
    // handled within the useMemo to ensure it runs *before* slice.
    const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
    return list;
  }, [plants, search, filters]); // Removed currentPage from dependency array to prevent infinite loop

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPlants = filteredPlants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  // Create an array of page numbers for the pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;

    try {
      await deletePlant(id);
      setPlants((prev) => prev.filter((plant) => plant._id !== id));
      toast.success("Plant deleted successfully!");
    } catch (err) {
      console.error("Error deleting plant:", err);
      toast.error("❌ Failed to delete plant");
    }
  };

  const handleFavourite = async (plantId) => {
    setPlants((prevPlants) =>
      prevPlants.map((p) =>
        p._id === plantId ? { ...p, favourite: !p.favourite } : p
      )
    );

    try {
      await toggleFavourite(plantId); // confirm with backend
      toast.success("Favourite status updated!");
    } catch (error) {
      console.error("❌ Error updating favourite:", error);
      toast.error("❌ Failed to update favourite");

      // rollback on failure
      setPlants((prevPlants) =>
        prevPlants.map((p) =>
          p._id === plantId ? { ...p, favourite: !p.favourite } : p
        )
      );
    }
  };

  const handleView = (id) => {
    navigate(`/view-plant/${id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Removed setCurrentPage(1) here as it's now handled by the useEffect above
  };

  const handleClearFilters = () => {
    setFilters({
      health: "",
      location: "",
      category: "",
      showFavourites: false,
    });
    // Removed setCurrentPage(1) here as it's now handled by the useEffect above
  };

  // --- Render Conditionals ---
  if (loading) return <Spinner />;
  if (!user) return <NoUser />;
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );
  return (
    <div className="min-h-screen bg-gray-50 items-center px-[3vw] md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans">
      {/* HEADER SECTION (Centered and Modern) */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-800 flex items-center justify-center gap-3">
          <Sprout className="w-10 h-10 text-emerald-600" />
          <span>Your Plant Collection</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
          Track, manage, and care for your favorite plants{" "}
          <span className="inline-block animate-pulse">💚</span>
        </p>

        <div className="max-w-xl h-1 bg-emerald-500 rounded-full mt-4 mx-auto" />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-10 gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, species, or location..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm text-base placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 bg-white hover:shadow-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(true)}
          className={`flex items-center justify-center px-4 py-3 rounded-xl shadow-md transition-all duration-300 whitespace-nowrap text-base font-semibold border-2 ${
            Object.values(filters).some((f) => f) // Check if any filter is active
              ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:shadow-lg"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
          title="Open Advanced Filters"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {Object.values(filters).some((f) => f) && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
              !
            </span>
          )}
        </button>
        <div className="min-w-max text-right self-end sm:self-center">
          <span className="text-3xl font-extrabold text-emerald-700">
            {filteredPlants.length}
          </span>
          <span className="block text-sm text-gray-500 leading-none">
            Total {filteredPlants.length === 1 ? "Plant" : "Plants"}
          </span>
        </div>
      </div>

      {/* FILTER MODAL / DROPDOWN (Remains the same as previous) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 bg-black/10 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-emerald-100 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Filter className="w-6 h-6 text-emerald-600" /> Advanced Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                >
                  <option value="">All Locations</option>
                  {locationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Health Filter */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Status
                </label>
                <select
                  name="health"
                  value={filters.health}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                >
                  <option value="">All Statuses</option>
                  {healthOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Favourites Checkbox */}
              <div className="sm:col-span-2 flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showFavourites"
                  name="showFavourites"
                  checked={filters.showFavourites}
                  onChange={handleFilterChange}
                  className="h-5 w-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="showFavourites"
                  className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Show Only Favourites{" "}
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </label>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleClearFilters}
                className="py-2 px-4 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="py-2 px-4 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* PLANTS LIST */}
      {filteredPlants.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 italic mt-10 p-10 bg-white rounded-xl shadow-lg"
        >
          No plants match your search and filter criteria. Try broadening your
          search!
        </motion.p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentPlants.map((plant, index) => (
              <motion.div
                key={plant._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 150,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
                className="relative group flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 transition-all overflow-hidden"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={plant.image || defaultPlantImg}
                    alt={plant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-emerald-800 mb-1 leading-tight">
                        {plant.name}
                      </h2>
                      {/* Favourite badge (visual indicator only, kept for quick glance) */}
                      {plant.favourite && (
                        <Heart
                          className="w-6 h-6 text-red-500 fill-red-500 flex-shrink-0"
                          title="Favorite Plant"
                        />
                      )}
                    </div>

                    <p className="text-gray-500 italic text-sm mb-3">
                      {plant.species}
                    </p>

                    <div className="space-y-2">
                      {/* Category & Location Flex */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {plant.category && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            <Tag size={12} className="stroke-[2.5]" />
                            {plant.category}
                          </span>
                        )}
                        {plant.location && (
                          <p className="text-sm flex items-center gap-1 text-gray-700">
                            <MapPin size={14} className="text-gray-500" />
                            {plant.location}
                          </p>
                        )}
                      </div>
                      <p
                        className={`text-sm font-semibold flex items-center gap-1 ${
                          plant.health === "Healthy"
                            ? "text-green-600"
                            : plant.health === "Needs Attention"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        <Sprout size={14} /> Health: {plant.health}
                      </p>
                      {plant.reminder && (
                        <p className="text-sm flex items-center gap-1 font-medium text-indigo-600 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                          <Bell size={16} className="text-indigo-500" />{" "}
                          Reminder: {plant.reminder}
                        </p>
                      )}
                      {plant.nextWatering && (
                        <p className="text-sm flex items-center gap-1 text-sky-600">
                          <Droplet size={14} /> Needs water on:{" "}
                          <span className="font-semibold">
                            {plant.nextWatering.split("T")[0]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Always Visible) */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                    {/* View Button (Primary Action) */}
                    <button
                      onClick={() => handleView(plant._id)}
                      className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition"
                      title="View Plant Details"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFavourite(plant._id)}
                        className={`p-2 rounded-full transition ${
                          plant.favourite
                            ? "text-red-500 hover:bg-red-100 fill-red-500"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                        title={
                          plant.favourite
                            ? "Remove from Favourites"
                            : "Add to Favourites"
                        }
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/add-plant/${plant._id}`)}
                        className="p-2 rounded-full text-yellow-600 hover:bg-yellow-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(plant._id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center space-x-2 mt-12"
              aria-label="Pagination"
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-full transition-all duration-300 ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-10 w-10 text-sm font-semibold rounded-full transition-all duration-300 ${
                    page === currentPage
                      ? "bg-emerald-600 text-white shadow-lg border border-emerald-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-full transition-all duration-300 ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
