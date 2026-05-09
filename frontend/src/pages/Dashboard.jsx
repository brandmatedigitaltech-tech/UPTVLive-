import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import API from "../services/api";

// ================= COMPONENTS =================
import AddNews from "../components/Admin/AddNews/AddNews";
import PendingNews from "../components/Admin/PendingNews/PendingNews";
import ApprovedNews from "../components/Admin/ApprovedNews/ApprovedNews";
import Users from "../components/Admin/Users/Users";
import Ads from "../components/Admin/Ads/Ads";
import MetaManager from "../components/Admin/MetaManager/MetaManager";

import "./Dashboard.css";

const Dashboard = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ================= USER ROLE =================
  const role =
    localStorage.getItem("role") ||
    "writer";

  // ================= STATES =================
  const [tab, setTab] =
    useState("add");

  const [loading, setLoading] =
    useState(false);

  // ======================================================
  // ================= AUTH PROTECT =======================
  // ======================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    // 🔒 NO TOKEN
    if (!token) {

      navigate("/admin");

      return;
    }

    // 🔒 WRITER RESTRICTION
    if (
      role !== "admin" &&
      location.search.includes("pending")
    ) {

      navigate(
        "/dashboard?tab=add"
      );
    }

  }, [navigate, location.search]);

  // ======================================================
  // ================= GET TAB ============================
  // ======================================================

  const getTabFromURL = () => {

    const params =
      new URLSearchParams(
        location.search
      );

    return (
      params.get("tab") ||
      "add"
    );
  };

  // ======================================================
  // ================= TAB SYNC ===========================
  // ======================================================

  useEffect(() => {

    const currentTab =
      getTabFromURL();

    // 🔒 WRITER ACCESS
    if (role !== "admin") {

      setTab("add");

      if (
        currentTab !== "add"
      ) {

        navigate(
          "/dashboard?tab=add"
        );
      }

      return;
    }

    // ✅ ALLOWED TABS
    const allowedTabs = [
      "add",
      "pending",
      "approved",
      "users",
      "ads",
      "meta",
    ];

    // ❌ INVALID TAB
    if (
      !allowedTabs.includes(
        currentTab
      )
    ) {

      setTab("add");

      return;
    }

    setTab(currentTab);

  }, [
    location.search,
    role,
    navigate,
  ]);

  // ======================================================
  // ================= LOGOUT ==============================
  // ======================================================

  const handleLogout =
    async () => {

      try {

        setLoading(true);

        await API.post(
          "/auth/logout"
        );

      } catch (err) {

        console.log(
          "Logout Error:",
          err
        );

      } finally {

        localStorage.clear();

        navigate("/admin");

        setLoading(false);
      }
    };

  // ======================================================
  // ================= CHANGE TAB =========================
  // ======================================================

  const handleTabChange = (
    newTab
  ) => {

    if (
      role !== "admin" &&
      newTab !== "add"
    ) {

      return;
    }

    navigate(
      `/dashboard?tab=${newTab}`
    );
  };

  // ======================================================
  // ================= RENDER =============================
  // ======================================================

  return (

    <div className="dashboard">

      {/* ====================================================== */}
      {/* ================= HEADER ============================== */}
      {/* ====================================================== */}

      <div className="dashboard-header">

        <div>

          <h2>
            📰 Dashboard{" "}

            <span className="role-text">

              (
              {role === "admin"
                ? "Admin"
                : "Writer"}
              )

            </span>
          </h2>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          {/* 🏠 HOMEPAGE BUTTON */}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="home-btn"
            style={{
              padding:
                "10px 18px",
              background:
                "#0b57d0",
              color: "#fff",
              borderRadius:
                "8px",
              textDecoration:
                "none",
              fontWeight:
                "600",
            }}
          >
            🏠 Homepage
          </a>

          {/* 🚪 LOGOUT */}

          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
            disabled={loading}
          >

            {loading
              ? "Logging out..."
              : "Logout"}

          </button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= TABS ================================ */}
      {/* ====================================================== */}

      <div className="tabs">

        {/* ADD NEWS */}

        <button
          className={`tab ${
            tab === "add"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleTabChange(
              "add"
            )
          }
        >
          ➕ Add News
        </button>

        {/* ADMIN ONLY */}

        {role === "admin" && (
          <>

            {/* PENDING */}

            <button
              className={`tab ${
                tab === "pending"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleTabChange(
                  "pending"
                )
              }
            >
              ⏳ Pending
            </button>

            {/* APPROVED */}

            <button
              className={`tab ${
                tab === "approved"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleTabChange(
                  "approved"
                )
              }
            >
              ✅ Approved
            </button>

            {/* USERS */}

            <button
              className={`tab ${
                tab === "users"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleTabChange(
                  "users"
                )
              }
            >
              👥 Users
            </button>

            {/* ADS */}

            <button
              className={`tab ${
                tab === "ads"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleTabChange(
                  "ads"
                )
              }
            >
              📢 Ads
            </button>

            {/* META */}

            <button
              className={`tab ${
                tab === "meta"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleTabChange(
                  "meta"
                )
              }
            >
              ⚙ Meta
            </button>

          </>
        )}

      </div>

      {/* ====================================================== */}
      {/* ================= TAB CONTENT ======================== */}
      {/* ====================================================== */}

      <div className="tab-content">

        {/* ADD */}
        {tab === "add" && (
          <AddNews />
        )}

        {/* PENDING */}
        {tab === "pending" &&
          role === "admin" && (
            <PendingNews />
          )}

        {/* APPROVED */}
        {tab === "approved" &&
          role === "admin" && (
            <ApprovedNews />
          )}

        {/* USERS */}
        {tab === "users" &&
          role === "admin" && (
            <Users />
          )}

        {/* ADS */}
        {tab === "ads" &&
          role === "admin" && (
            <Ads />
          )}

        {/* META */}
        {tab === "meta" &&
          role === "admin" && (
            <MetaManager />
          )}

      </div>

    </div>
  );
};

export default Dashboard;