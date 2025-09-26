import { Link } from "react-router-dom";
import { Leaf, Mail, Instagram, Twitter } from "lucide-react"; // Importing icons for a modern touch

const Footer = () => {
  return (
    // Updated background to a cleaner, darker emerald green
    <footer className="bg-gray-800 text-white mt-auto border-t border-emerald-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-y-8 md:gap-x-12">
        {/* Column 1: Logo and Brand Message */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-400">
            <Leaf className="w-6 h-6 fill-emerald-400" />
            PlantCareAI
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your smart plant care assistant. Track, explore, and get
            personalized advice to help your green friends thrive.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-1">
            Quick Links
          </h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2"
              >
                Explore Plants
              </Link>
            </li>
            <li>
              <Link
                to="/my-plants"
                className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2"
              >
                My Plants
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2"
              >
                AI Chat
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources (Added placeholder to balance layout) */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-1">
            Resources
          </h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link
                to="/help"
                className="text-gray-400 hover:text-emerald-400 transition"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-emerald-400 transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-emerald-400 transition"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Connect / Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-1">
            Connect
          </h3>
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4 text-emerald-400" />
              <a
                href="mailto:support@plantcareai.com"
                className="hover:text-emerald-400 transition"
              >
                support@plantcareai.com
              </a>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <Instagram className="w-4 h-4 text-emerald-400" />
              <a href="#" className="hover:text-emerald-400 transition">
                @plantcareai
              </a>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <Twitter className="w-4 h-4 text-emerald-400" />
              <a href="#" className="hover:text-emerald-400 transition">
                @plantcare\_ai
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-700">
        &copy; {new Date().getFullYear()} PlantCareAI. All rights reserved.
        Built with passion for plants.
      </div>
    </footer>
  );
};

export default Footer;
