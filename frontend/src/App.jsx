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

// ===== COMMON =====
import TopBar from "./components/TopBar/TopBar";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import BreakingNews from "./components/BreakingNews/BreakingNews";
import Footer from "./components/Footer/Footer";

// ===== HOME =====
import Hero from "./components/Hero/Hero";
import NewsGrid from "./components/NewsGrid/NewsGrid";
import CitySection from "./components/CitySection/CitySection";
import TopCitySection from "./components/TopCitySection/TopCitySection";
import SpecialSection from "./components/SpecialSection/SpecialSection";
import Sidebar from "./components/Sidebar/Sidebar";
import VideoSection from "./components/VideoSection/VideoSection";

// ===== PAGES =====
import ArticlePage from "./components/ArticlePage/ArticlePage";
import About from "./components/about/about";
import Contact from "./components/Contact/Contact";
import CityPage from "./components/CityPage/CityPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";

// ===== ADMIN =====
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReviewPage from "./pages/ReviewPage";

/* ================= SCROLL ================= */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

/* ================= BASE LAYOUT ================= */
const BaseLayout = () => {
  return (
    <>
      <TopBar />
      <Header />
      <Navbar />
      <BreakingNews />
      <TopCitySection/>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

/* ================= HOME ================= */
const HomePage = () => {
  return (
    <>
      {/* 🔥 TOP STICKY AD (BEST CPM POSITION) */}
      <div className="container">
        <AdBanner position="home_top" />
      </div>

      <Hero />

      {/* 🔥 AFTER HERO (HIGH VISIBILITY) */}
      <div className="container">
        <AdBanner position="home_after_hero" />
      </div>

      <div className="container">
        <div className="main-layout">

          {/* ================= LEFT CONTENT ================= */}
          <div className="main-content">

            <NewsGrid />

            {/* 🔥 INLINE AD (BEST ENGAGEMENT) */}
            <AdBanner position="home_inline_1" />

            <CitySection />

            {/* 🔥 SECOND INLINE AD */}
            <AdBanner position="home_inline_2" />

            <SpecialSection />

          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="right-sidebar">

            <Sidebar />

            {/* 🔥 SIDEBAR AD */}
            <AdBanner position="sidebar" />

          </div>

        </div>
      </div>

      {/* 🔥 BEFORE VIDEO */}
      <div className="container">
        <AdBanner position="home_before_video" />
      </div>

      <VideoSection />

      {/* 🔥 FOOTER AD */}
      <div className="container">
        <AdBanner position="home_bottom" />
      </div>
    </>
  );
};

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

/* ================= 404 ================= */
const NotFound = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>404</h1>
      <p>Page not found ❌</p>
    </div>
  );
};

/* ================= ROUTES ================= */
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* 🌐 WEBSITE */}
        <Route path="/" element={<BaseLayout />}>

          <Route index element={<HomePage />} />

          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="city/:city" element={<CityPage />} />
          <Route path="category/:category" element={<CategoryPage />} />

          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

        </Route>

        {/* 🔐 LOGIN */}
        <Route path="/admin" element={<Login />} />

        {/* ✅ SINGLE DASHBOARD FOR ALL */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔍 REVIEW PAGE */}
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
};

/* ================= ROOT ================= */
const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;