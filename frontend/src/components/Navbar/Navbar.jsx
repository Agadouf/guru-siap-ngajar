import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) => {
    const active =
      path === "/"
        ? location.pathname === "/"
        : location.pathname === path ||
          location.pathname.startsWith(`${path}/`);

    return `inline-block py-3 px-4 text-sm transition-colors ${
      active
        ? "text-white bg-blue-800"
        : "text-white hover:bg-blue-800"
    }`;
  };

  return (
    <header className="w-full bg-white border-b border-gray-300">
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Link to="/" className="inline-block">
            <span className="block text-2xl md:text-3xl font-bold">
              Guru Siap Ngajar
            </span>
            <span className="block text-sm mt-1 text-blue-100">
              English Learning Platform
            </span>
          </Link>
        </div>
      </div>

      <nav className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-2 flex flex-wrap items-center">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/modules" className={linkClass("/modules")}>
            Learning Modules
          </Link>

          <Link to="/about" className={linkClass("/about")}>
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
