// src/components/NavBar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PlantCareAILogo from "../assets/logo.svg.png";

import UserMenu from "./UserMenu";
import {
  Menu,
  X,
  Home,
  MessageCircle,
  Compass,
  Sprout,
  PlusCircle,
  LogIn,
  ChevronDown,
} from "lucide-react";

// --- Global Event Dispatcher ---
// EXPORT THIS so you can import it in your Login component
export const dispatchLoginEvent = () => {
  window.dispatchEvent(new CustomEvent("auth-status-changed"));
};
// -------------------------------

// --- Custom Hook for Scroll Effect (keep this) ---
const useScrollEffect = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
};
// -------------------------------------

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const navigate = useNavigate();

  const scrolled = useScrollEffect();

  // Function to retrieve user data from localStorage
  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem("userInfo");
    // Ensure that if userInfo is null/undefined, user state is set to null
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // 1. Initial check on mount
    checkAuthStatus();

    // 2. Add event listener to react to status changes from other components (Login/Logout)
    window.addEventListener("auth-status-changed", checkAuthStatus);

    // 3. Cleanup the listener
    return () => {
      window.removeEventListener("auth-status-changed", checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [navigate, isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    toast.success("Logged out successfully!");
    // Dispatch event after logout to ensure other components also update
    dispatchLoginEvent();
    navigate("/auth");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleExplore = () => setExploreOpen(!exploreOpen);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-green-700 text-white shadow-lg shadow-green-900/50"
        : "text-green-100 hover:bg-green-600/70 hover:text-white"
    }`;

  const dropdownLinkClass =
    "flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-green-50 transition-colors duration-200";

  const baseNavStyle = "bg-[#2a4d3a] transition-all duration-500 ease-in-out";
  const scrolledNavStyle =
    "bg-white/95 backdrop-blur-md shadow-xl text-gray-800 py-2";

  return (
    <nav
      className={`text-white py-3 flex items-center justify-between sticky top-0 w-full z-50 px-4 md:px-8 lg:px-12 ${baseNavStyle} ${
        scrolled ? scrolledNavStyle : ""
      }`}
    >
      {/* Logo: Circular Style */}
      <div
        onClick={() => navigate("/")}
        className={`flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105 ${
          scrolled ? "text-green-700" : "text-white"
        }`}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md bg-white transition-all duration-500 ease-in-out">
          <img
            src={PlantCareAILogo}
            alt="PlantCareAI Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        <span className="hidden sm:inline text-lg font-montserrat font-extrabold">
          PlantCareAI
        </span>
      </div>

      {/* Nav Links Container (Mobile Drawer / Desktop Row) */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 h-full w-64 bg-[#1e3c2c] transition-transform duration-500 ease-in-out flex flex-col pt-16
           md:static md:translate-x-0 md:flex md:w-auto md:bg-transparent md:h-auto md:flex-row md:items-center md:p-0`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5 p-4 md:p-0 w-full md:w-auto">
          {/* Close button for mobile menu */}
          <button
            className="md:hidden absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={toggleMenu}
          >
            <X size={26} />
          </button>

          {/* Navigation Links (Unchanged) */}
          <NavLink to="/" className={navItemClass}>
            <Home size={18} /> <span>Home</span>
          </NavLink>

          <NavLink to="/chat" className={navItemClass}>
            <MessageCircle size={18} /> <span>Chat</span>
          </NavLink>

          {/* Explore Dropdown (Unchanged) */}
          <div
            className="relative w-full md:w-auto"
            onMouseEnter={() =>
              window.innerWidth >= 768 && setExploreOpen(true)
            }
            onMouseLeave={() =>
              window.innerWidth >= 768 && setExploreOpen(false)
            }
          >
            <button
              onClick={toggleExplore}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-full md:w-auto justify-start md:justify-center transition-all duration-300 ${
                exploreOpen
                  ? "bg-green-700 text-white"
                  : "text-green-100 hover:bg-green-600/70 hover:text-white"
              }`}
            >
              <Compass size={18} /> Explore{" "}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  exploreOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {exploreOpen && (
              <div
                className={`absolute ${
                  scrolled
                    ? "md:bg-white text-gray-800"
                    : "md:bg-[#2a4d3a] text-white"
                } left-0 w-full md:w-60 rounded-xl shadow-2xl overflow-hidden z-50 mt-2 md:mt-0 md:border md:border-green-100/20`}
              >
                <NavLink to="/explore" className={dropdownLinkClass}>
                  🌿 Plant Diseases
                </NavLink>
                <NavLink to="/plantsdata" className={dropdownLinkClass}>
                  🪴 Household Plant Collection
                </NavLink>
                <NavLink to="/explore/plantsdata" className={dropdownLinkClass}>
                  🌱 Plant Data
                </NavLink>
              </div>
            )}
          </div>

          {/* Conditional links based on user status */}
          <NavLink to="/my-plants" className={navItemClass}>
            <Sprout size={18} /> <span>My Plants</span>
          </NavLink>

          {/* Add Plant Link only visible if user is logged in */}
          {user && (
            <NavLink to="/add-plant" className={navItemClass}>
              <PlusCircle size={18} /> <span>Add Plant</span>
            </NavLink>
          )}

          <div className="mt-4 md:mt-0 w-full md:w-auto">
            {!user ? (
              <NavLink to="/auth" className={navItemClass}>
                <LogIn size={18} /> <span>Sign In</span>
              </NavLink>
            ) : (
              // UserMenu only visible if user is logged in
              <UserMenu
                user={user}
                onLogout={handleLogout}
                isScrolled={scrolled}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className={`md:hidden p-2 rounded-full z-50 transition-colors duration-300 ${
          scrolled
            ? "text-green-700 hover:bg-green-100"
            : "text-white hover:bg-green-600/70"
        }`}
        onClick={toggleMenu}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
};

export default NavBar;
