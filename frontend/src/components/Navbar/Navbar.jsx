import { Link, useLocation } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold text-blue-600"
        >
          <FaBookOpen className="text-3xl" />
          Guru Siap Ngajar
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className={`transition font-medium ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Home
          </Link>

          <Link
            to="/modules"
            className={`transition font-medium ${
              isActive("/modules")
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Modules
          </Link>

          <Link
            to="/about"
            className={`transition font-medium ${
              isActive("/about")
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            About
          </Link>

        </div>

      </div>
    </motion.nav>
  );
}