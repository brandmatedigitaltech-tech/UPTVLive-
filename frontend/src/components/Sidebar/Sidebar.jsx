import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import AdBanner from "../AdBanner";

const Sidebar = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchSidebarNews = async () => {
      try {
        setLoading(true);

        const res = await API.get("/news/section/sidebar");
        let data = Array.isArray(res.data) ? res.data : [];

        // 🔥 FALLBACK → TRENDING
        if (data.length === 0) {
          const fallback = await API.get("/news");

          data = [...fallback.data]
            .sort((a, b) => (b?.views || 0) - (a?.views || 0))
            .slice(0, 5);
        }

        setNews(data.slice(0, 5));

      } catch (err) {
        console.error("Sidebar error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarNews();
  }, []);

  return (
    <div className="sidebar">

      {/* 🔥 TOP AD */}
      <AdBanner position="sidebar_top" />

      {/* 🔥 TRENDING */}
      <div className="sidebar-section">
        <div className="sidebar-title">🔥 ट्रेंडिंग</div>

        {loading && <p>Loading...</p>}

        {!loading && news.length === 0 && (
          <p>No trending news</p>
        )}

        {!loading &&
          news.map((item, index) => (
            <Link
              to={`/article/${item.slug || item._id}`}
              key={item._id}
              className="numbered-link"
            >
              <div className="numbered-card">

                {/* NUMBER */}
                <div className="num">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="numbered-title">
                    {item.title || "No Title"}
                  </div>

                  <div className="numbered-meta">
                    👁 {item.views || 0} •{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "Today"}
                  </div>
                </div>

              </div>
            </Link>
          ))}

      </div>

      {/* 🔥 MIDDLE AD */}
      <AdBanner position="sidebar_middle" />

      {/* 🌦️ WEATHER */}
      <div className="weather-box">
        <div className="weather-city">☁️ लखनऊ, उत्तर प्रदेश</div>

        <div className="weather-main">
          <div className="temp">22°</div>
          <div>
            <div className="desc">बादल छाए</div>
            <div className="range">अधिकतम 27° | न्यूनतम 16°</div>
          </div>
        </div>

        <div className="weather-details">
          <span>💧 68%</span>
          <span>💨 12km/h</span>
          <span>👁️ 8km</span>
        </div>
      </div>

      {/* 🔥 BOTTOM AD */}
      <AdBanner position="sidebar_bottom" />

    </div>
  );
};

export default Sidebar;