import React, { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";

import AdBanner from "./components/AdBanner";

// ================= COMMON =================
import TopBar from "./components/TopBar/TopBar";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import BreakingNews from "./components/BreakingNews/BreakingNews";
import Footer from "./components/Footer/Footer";

// ================= HOME =================
import Hero from "./components/Hero/Hero";
import NewsGrid from "./components/NewsGrid/NewsGrid";
import CitySection from "./components/CitySection/CitySection";
import TopCitySection from "./components/TopCitySection/TopCitySection";
import SpecialSection from "./components/SpecialSection/SpecialSection";
import Sidebar from "./components/Sidebar/Sidebar";
import VideoSection from "./components/VideoSection/VideoSection";

// ================= PAGES =================
import ArticlePage from "./components/ArticlePage/ArticlePage";
import About from "./components/about/about";
import Contact from "./components/Contact/Contact";
import CityPage from "./components/CityPage/CityPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";

// ================= ADMIN =================
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReviewPage from "./pages/ReviewPage";

// ======================================================
// ================= SCROLL TO TOP ======================
// ======================================================

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [pathname]);

  return null;
};

// ======================================================
// ================= GLOBAL SEO =========================
// ======================================================

const GlobalSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/article/")) {
  return;
}

    // ✅ DEFAULT TITLE
    let pageTitle =
      "UPTV Live - Latest News Updates";

    // ✅ DEFAULT DESCRIPTION
    let description =
      "UPTV Live provides latest breaking news, politics, city news, videos and updates.";

    // ================= PAGE TITLE =================

    if (path === "/") {
      pageTitle =
        "UPTV Live - Breaking News & Latest Updates";

    } else if (path.includes("/about")) {
      pageTitle =
        "About Us | UPTV Live";

    } else if (path.includes("/contact")) {
      pageTitle =
        "Contact Us | UPTV Live";

    } else if (path.includes("/city/")) {
      pageTitle =
        "City News | UPTV Live";

    } else if (
      path.includes("/category/")
    ) {
      pageTitle =
        "Category News | UPTV Live";

    } 

    // ✅ TITLE
    document.title = pageTitle;

    // ================= META =================

    const updateMeta = (
      property,
      content,
      isName = false
    ) => {
      const attr = isName
        ? "name"
        : "property";

      let element =
        document.querySelector(
          `meta[${attr}="${property}"]`
        );

      if (!element) {
        element =
          document.createElement("meta");

        element.setAttribute(attr, property);

        document.head.appendChild(element);
      }

      element.setAttribute(
        "content",
        content
      );
    };

    // ✅ BASIC SEO
    updateMeta(
      "description",
      description,
      true
    );

    // ✅ OPEN GRAPH
    updateMeta(
      "og:title",
      pageTitle
    );

    updateMeta(
      "og:description",
      description
    );

    updateMeta(
      "og:type",
      "website"
    );

    updateMeta(
      "og:url",
      window.location.href
    );

    // ✅ TWITTER
    updateMeta(
      "twitter:card",
      "summary_large_image",
      true
    );

    updateMeta(
      "twitter:title",
      pageTitle,
      true
    );

    updateMeta(
      "twitter:description",
      description,
      true
    );

  }, [location]);

  return null;
};

// ======================================================
// ================= BASE LAYOUT ========================
// ======================================================

const BaseLayout = () => {
  return (
    <>
      <TopBar />

      <Header />

      <Navbar />

      <BreakingNews />

      <TopCitySection />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

// ======================================================
// ================= HOME PAGE ==========================
// ======================================================

const HomePage = () => {
  return (
    <>
      {/* TOP AD */}
      <div className="container">
        <AdBanner position="home_top" />
      </div>

      {/* HERO */}
      <Hero />

      {/* HERO AD */}
      <div className="container">
        <AdBanner position="home_after_hero" />
      </div>

      {/* MAIN */}
      <div className="container">
        <div className="main-layout">

          {/* LEFT */}
          <div className="main-content">

            <NewsGrid />

            <AdBanner position="home_inline_1" />

            <CitySection />

            <AdBanner position="home_inline_2" />

            <SpecialSection />

          </div>

          {/* RIGHT */}
          <div className="right-sidebar">

            <Sidebar />

            <AdBanner position="sidebar" />

          </div>

        </div>
      </div>

      {/* VIDEO AD */}
      <div className="container">
        <AdBanner position="home_before_video" />
      </div>

      {/* VIDEO */}
      <VideoSection />

      {/* FOOTER AD */}
      <div className="container">
        <AdBanner position="home_bottom" />
      </div>
    </>
  );
};

// ======================================================
// ================= PROTECTED ROUTE ====================
// ======================================================

const ProtectedRoute = ({
  children,
}) => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return children;
};

// ======================================================
// ================= 404 PAGE ===========================
// ======================================================

const NotFound = () => {
  useEffect(() => {
    document.title =
      "404 - Page Not Found | UPTV Live";
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1>404</h1>

      <p>
        Page not found ❌
      </p>

      <a
        href="/"
        style={{
          marginTop: "20px",
          display: "inline-block",
        }}
      >
        वापस होम जाएं
      </a>
    </div>
  );
};

// ======================================================
// ================= ROUTES =============================
// ======================================================

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <GlobalSeo />

      <Routes>

        {/* WEBSITE */}
        <Route
          path="/"
          element={<BaseLayout />}
        >
          {/* HOME */}
          <Route
            index
            element={<HomePage />}
          />

          {/* ARTICLE */}
          <Route
  path="article/:slug"
  element={<ArticlePage />}
/>

<Route
  path="s/:slug"
  element={<ArticlePage />}
/>

          

          {/* CITY */}
          <Route
            path="city/:city"
            element={<CityPage />}
          />

          {/* CATEGORY */}
          <Route
            path="category/:category"
            element={<CategoryPage />}
          />

          {/* ABOUT */}
          <Route
            path="about"
            element={<About />}
          />

          {/* CONTACT */}
          <Route
            path="contact"
            element={<Contact />}
          />
        </Route>


        {/* LOGIN */}
        <Route
          path="/admin"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* REVIEW */}
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
};

// ======================================================
// ================= ROOT APP ===========================
// ======================================================

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;