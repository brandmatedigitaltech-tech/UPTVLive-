import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // 🔥 CATEGORY LIST (CLEAN + SCALABLE)
  const categories = [
    "nation",
    "state",
    "world",
    "special",
    "sports",
    "business",
    "tech",
    "auto",
    "lifestyle",
    "career",

  ];

  // 🔥 ACTIVE CHECK
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav>
      <div className="container">
        <div className="nav-inner">

          {/* HOME */}
          <Link
            to="/"
            className={`nav-item ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            Home
          </Link>

          <div className="nav-divider"></div>

          {/* 🔥 ALL CATEGORIES */}
          {categories.map((cat, index) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className={`nav-item ${
                isActive(`/category/${cat}`) ? "active" : ""
              }`}
            >
              {cat === "video" ? "📹 Video" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;