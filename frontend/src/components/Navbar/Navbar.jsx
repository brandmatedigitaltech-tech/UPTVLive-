import "./Navbar.css";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

const Navbar = () => {

  const location = useLocation();

  // ================= STATE =================
  const [categories, setCategories] =
    useState([]);

  // ================= FETCH =================
  useEffect(() => {

    const fetchCategories =
      async () => {
        try {

          const res =
            await API.get(
              "/meta/categories"
            );

          const data =
            Array.isArray(
              res.data
            )
              ? res.data
              : [];

          setCategories(data);

        } catch (err) {

          console.log(
            "Navbar Error:",
            err
          );

        }
      };

    fetchCategories();

  }, []);

  // ================= ACTIVE =================
  const isActive = (path) => {
    return location.pathname.startsWith(
      path
    );
  };

  // ================= LABEL =================
  const formatLabel = (text) => {

    if (!text) return "";

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1)
    );
  };

  return (
    <nav>
      <div className="container">

        <div className="nav-inner">

          {/* ================= HOME ================= */}
          <Link
            to="/"
            className={`nav-item ${
              location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Home
          </Link>

          <div className="nav-divider"></div>

          {/* ================= DYNAMIC CATEGORY ================= */}
          {categories.map((cat) => (

            <Link
              key={cat._id}
              to={`/category/${cat.name}`}
              className={`nav-item ${
                isActive(
                  `/category/${cat.name}`
                )
                  ? "active"
                  : ""
              }`}
            >

              {cat.name === "video"
                ? "📹 Video"
                : formatLabel(cat.name)}

            </Link>

          ))}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;