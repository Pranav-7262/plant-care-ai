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
} from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
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
    `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-green-700/90 text-white shadow-inner font-semibold"
        : "text-gray-200 hover:bg-green-600/70 hover:text-white"
    }`;

  return (
    <nav className="bg-[#355e3b] text-gray-100 py-3 flex items-center justify-between sticky top-0 w-full z-50 px-[4vw] lg:px-[12vw] shadow-md">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold flex items-center gap-2 cursor-pointer"
      >
        🌱 <span className="hidden sm:inline">PlantBot</span>
      </div>

      {/* Nav Links */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-14 left-0 w-full bg-[#355e3b] md:static md:block md:w-auto md:bg-transparent`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-4 md:p-0">
          <NavLink to="/" className={navItemClass}>
            <Home size={18} /> <span>Home</span>
          </NavLink>
          <NavLink to="/chat" className={navItemClass}>
            <MessageCircle size={18} /> <span>Chat</span>
          </NavLink>
          <NavLink to="/explore" className={navItemClass}>
            <Compass size={18} /> <span>Explore</span>
          </NavLink>
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
