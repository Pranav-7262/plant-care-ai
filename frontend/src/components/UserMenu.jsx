import { useState, useRef, useEffect } from "react";
import { User, LogOut, PlusCircle, Leaf, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-white hover:bg-green-800 transition"
      >
        <User size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <ul className="text-gray-700">
            <li>
              <Link
                to="/my-plants"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <Leaf size={16} /> My Plants
              </Link>
            </li>
            <li>
              <Link
                to="/add-plant"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <PlusCircle size={16} /> Add Plant
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <Settings size={16} /> Settings
              </Link>
            </li>
          </ul>

          <div className="border-t">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
