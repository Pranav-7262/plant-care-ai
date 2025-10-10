import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PlantCareAILogo from "../assets/ai-plant-icon.jpg";
import UserMenu from "./UserMenu";
import {
  Menu,
  X,
  Home,
  Bot,
  Compass,
  Sprout,
  PlusCircle,
  LogIn,
  ChevronDown,
} from "lucide-react";

export const dispatchLoginEvent = () => {
  window.dispatchEvent(new CustomEvent("auth-status-changed"));
};
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

    window.addEventListener("auth-status-changed", checkAuthStatus);

    return () => {
      window.removeEventListener("auth-status-changed", checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    // Closes the menu on route change
    if (isOpen) {
      setIsOpen(false);
    }
  }, [navigate]); // Removed 'isOpen' from dependency array to prevent infinite loop

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    toast.success("Logged out successfully!");

    dispatchLoginEvent();
    navigate("/auth");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleExplore = () => setExploreOpen(!exploreOpen);

  // --- UPDATED: navItemClass ---
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-green-700 text-white shadow-lg shadow-green-900/50"
        : "text-green-100 hover:bg-green-600/70 hover:text-white"
    }`;
  const dropdownLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 w-full ${
      isActive
        ? "bg-green-800 text-white"
        : "hover:bg-green-600/50 md:hover:bg-green-50"
    } ${scrolled ? "md:text-gray-800 text-white" : "md:text-white text-white"}`;

  const baseNavStyle = "bg-[#2a4d3a] transition-all duration-500 ease-in-out";
  const scrolledNavStyle =
    "bg-white/95 backdrop-blur-md shadow-xl text-gray-800 py-2";

  return (
    <nav
      className={`text-white py-3 flex items-center justify-between sticky top-0 w-full z-50 px-4 md:px-8 lg:px-12 ${baseNavStyle} ${
        scrolled ? scrolledNavStyle : ""
      }`}
    >
      {/* Logo and Brand Name Group - Removed hover:scale-105 */}
      <div
        onClick={() => navigate("/")}
        className={`flex items-center gap-2 cursor-pointer transition-transform duration-300 ${
          scrolled ? "text-green-700" : "text-white"
        }`}
      >
        {/* Logo Image */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
          <img
            src={PlantCareAILogo}
            alt="PlantCareAI Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Improved text clarity and font size for better visual presence */}
          <span className="hidden sm:inline text-lg sm:text-xl font-montserrat font-extrabold tracking-tight">
            PlantCareAI
          </span>

          <span className="hidden sm:inline text-gray-400 text-base font-normal">
            |
          </span>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline text-sm font-medium transition-colors duration-300 opacity-80 hover:opacity-100 ${
              scrolled
                ? "text-green-700 hover:text-green-900"
                : "text-white hover:text-green-100"
            }`}
          >
            Docs
          </a>
        </div>
      </div>
      <div
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 h-full w-64 bg-[#1e3c2c] transition-transform duration-500 ease-in-out flex flex-col pt-16
            md:static md:translate-x-0 md:flex md:w-auto md:bg-transparent md:h-auto md:flex-row md:items-center md:p-0`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5 p-4 md:p-0 w-full md:w-auto">
          <button
            className="md:hidden absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={toggleMenu}
          >
            <X size={26} />
          </button>

          <NavLink to="/" className={navItemClass}>
            <Home size={18} /> <span>Home</span>
          </NavLink>

          <NavLink to="/chat" className={navItemClass}>
            <Bot size={18} /> <span>PlantBot</span>
          </NavLink>
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
              onClick={toggleExplore} // Click toggles on all screens
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
                className={`relative md:absolute ${
                  scrolled
                    ? "md:bg-[#2a4d3a]" // Scrolled desktop background
                    : "md:bg-[#2a4d3a]" // Unscrolled desktop background
                } left-0 w-full md:w-60 rounded-xl md:shadow-2xl overflow-hidden z-50 mt-2 md:mt-0 md:border md:border-green-100/20`}
              >
                {/* Wrapper for mobile indentation */}
                <div className="flex flex-col md:block py-1 md:py-0 pl-2 md:pl-0">
                  <NavLink to="/explore" className={dropdownLinkClass}>
                    🐛 Plant Disease
                  </NavLink>
                  <NavLink to="/plantsdata" className={dropdownLinkClass}>
                    🪴 Household Plant Collection
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/my-plants" className={navItemClass}>
            <Sprout size={18} /> <span>My Plants</span>
          </NavLink>
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
