import "./TopBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TopBar = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // 📅 DATE
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // 🔥 LIVE UPDATE FIX (IMPORTANT)
  useEffect(() => {
    const updateAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    updateAuth();

    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    navigate("/");
  };

  const dashboardLink =
    role === "admin"
      ? "/dashboard?tab=pending"
      : "/dashboard?tab=add";

  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-inner">

          <div className="topbar-date">
            {formattedDate} | Hindi News | Uttar Pradesh
          </div>

          <div className="topbar-links">

            <Link to="/contact">📞 Contact</Link>
            <Link to="/about">About Us</Link>

            {token ? (
              <div className="user-actions">

                <span className="role-badge">
                  {role === "admin" ? "Admin" : "Writer"}
                </span>

                <Link to={dashboardLink} className="dashboard-link">
                  👤 Dashboard
                </Link>

                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>

              </div>
            ) : (
              <Link to="/admin" className="login-btn">
                ＋
              </Link>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;