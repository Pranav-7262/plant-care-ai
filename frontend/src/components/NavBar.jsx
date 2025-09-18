// src/components/NavBar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-900/40"
        : "text-gray-300 hover:bg-green-500/80 hover:text-white"
    }`;

  return (
    <nav className="bg-[#2a4d3a] text-white py-3 flex items-center justify-between sticky top-0 w-full z-50 px-[4vw] lg:px-[12vw] shadow-2xl shadow-gray-950/50">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-extrabold flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        <Sprout size={28} className="text-green-300" />
        <span className="hidden sm:inline font-montserrat">PlantBot</span>
      </div>

      {/* Nav Links */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-14 left-0 w-full bg-[#2a4d3a] md:static md:block md:w-auto md:bg-transparent transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5 p-4 md:p-0">
          <NavLink to="/" className={navItemClass}>
            <Home size={18} /> <span>Home</span>
          </NavLink>

          <NavLink to="/chat" className={navItemClass}>
            <MessageCircle size={18} /> <span>Chat</span>
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-green-500/80 hover:text-white transition-all duration-300">
              <Compass size={18} /> Explore <ChevronDown size={16} />
            </button>

            {exploreOpen && (
              <div className="absolute left-0 mt-2 w-60 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
                <NavLink
                  to="/explore"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  🌿 Plant Diseases
                </NavLink>
                <NavLink
                  to="/plantsdata"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  🪴 Household Plant Collection
                </NavLink>
                <NavLink
                  to="/explore/plantsdata"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  🌱 Plant Data
                </NavLink>
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

          {!user ? (
            <NavLink to="/auth" className={navItemClass}>
              <LogIn size={18} /> <span>Sign In</span>
            </NavLink>
          ) : (
            <UserMenu user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="ml-auto md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </nav>
  );
};

export default NavBar;
