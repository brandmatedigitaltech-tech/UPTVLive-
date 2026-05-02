import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

// ✅ FIXED IMPORT
import AddNews from "../components/Admin/AddNews/AddNews";
import PendingNews from "../components/Admin/PendingNews/PendingNews";
import ApprovedNews from "../components/Admin/ApprovedNews/ApprovedNews";
import Users from "../components/Admin/Users/Users";
import Ads from "../components/Admin/Ads/Ads";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "writer";

  const [tab, setTab] = useState("add");
  const [loading, setLoading] = useState(false);

  // 🔥 FINAL AUTH + ROLE PROTECT
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/admin");
      return;
    }

    // 🔒 writer ko restrict karo
    if (role !== "admin" && location.search.includes("pending")) {
      navigate("/dashboard?tab=add");
    }

  }, [navigate, location.search]);

  // ================= GET TAB =================
  const getTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "add";
  };

  // ================= SYNC TAB =================
  useEffect(() => {
    const currentTab = getTabFromURL();

    if (role !== "admin") {
      setTab("add");
      if (currentTab !== "add") {
        navigate("/dashboard?tab=add");
      }
      return;
    }

    const allowedTabs = ["add", "pending", "approved", "users", "ads"];

    if (!allowedTabs.includes(currentTab)) {
      setTab("add");
      return;
    }

    setTab(currentTab);
  }, [location.search, role, navigate]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      setLoading(true);
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout Error:", err);
    } finally {
      localStorage.clear();
      navigate("/admin");
      setLoading(false);
    }
  };

  // ================= CHANGE TAB =================
  const handleTabChange = (newTab) => {
    if (role !== "admin" && newTab !== "add") return;
    navigate(`/dashboard?tab=${newTab}`);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>
          📰 Dashboard{" "}
          <span className="role-text">
            ({role === "admin" ? "Admin" : "Writer"})
          </span>
        </h2>

        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* TABS */}
      <div className="tabs">

        <button
          className={`tab ${tab === "add" ? "active" : ""}`}
          onClick={() => handleTabChange("add")}
        >
          ➕ Add News
        </button>

        {role === "admin" && (
          <>
            <button
              className={`tab ${tab === "pending" ? "active" : ""}`}
              onClick={() => handleTabChange("pending")}
            >
              ⏳ Pending
            </button>

            <button
              className={`tab ${tab === "approved" ? "active" : ""}`}
              onClick={() => handleTabChange("approved")}
            >
              ✅ Approved
            </button>

            <button
              className={`tab ${tab === "users" ? "active" : ""}`}
              onClick={() => handleTabChange("users")}
            >
              👥 Users
            </button>

            <button
              className={`tab ${tab === "ads" ? "active" : ""}`}
              onClick={() => handleTabChange("ads")}
            >
              📢 Ads
            </button>
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="tab-content">

        {tab === "add" && <AddNews />}

        {tab === "pending" && role === "admin" && <PendingNews />}

        {tab === "approved" && role === "admin" && <ApprovedNews />}

        {tab === "users" && role === "admin" && <Users />}

        {tab === "ads" && role === "admin" && <Ads />}

      </div>

    </div>
  );
};

export default Dashboard;
