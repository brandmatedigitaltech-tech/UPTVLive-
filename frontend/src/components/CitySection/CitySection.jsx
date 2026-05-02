import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CitySection.css";
import API from "../../services/api";

const FALLBACK_IMG = "/no-image.jpg";

const cities = [
  { name: "कानपुर", slug: "kanpur" },
  { name: "लखनऊ", slug: "lucknow" },
  { name: "अयोध्या", slug: "ayodhya" },
  { name: "आगरा", slug: "agra" },
  { name: "वाराणसी", slug: "varanasi" },
  { name: "गोरखपुर", slug: "gorakhpur" },
  { name: "प्रयागराज", slug: "prayagraj" },
  { name: "गाज़ियाबाद", slug: "ghaziabad" }
];

// 🔥 SAFE IMAGE FUNCTION (IMPORTANT)
const getImage = (item) => {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }

  if (item.image && item.image.trim() !== "") {
    return item.image;
  }

  return FALLBACK_IMG;
};

const CitySection = () => {
  const [activeCity, setActiveCity] = useState(cities[0]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchCityNews = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/news/city/${activeCity.slug}`);
        const data = Array.isArray(res.data) ? res.data : [];

        setNews(data.slice(0, 6));

      } catch (err) {
        console.log("CitySection Error:", err);
        setNews([]); // 🔥 prevent crash
      } finally {
        setLoading(false);
      }
    };

    fetchCityNews();
  }, [activeCity]);

  return (
    <div className="city-section">

      {/* ================= TABS ================= */}
      <div className="city-tabs">
        {cities.map((city) => (
          <span
            key={city.slug}
            className={`city-tab ${
              activeCity.slug === city.slug ? "active" : ""
            }`}
            onClick={() => setActiveCity(city)}
          >
            {city.name}
          </span>
        ))}
      </div>

      {/* ================= GRID ================= */}
      <div className="city-grid">

        {loading && <p className="loading">Loading...</p>}

        {!loading && news.length === 0 && (
          <p className="empty">No news available</p>
        )}

        {!loading &&
          news.map((item) => (
            <Link
              to={`/article/${item.slug || item._id}`}
              key={item._id}
              className="city-link"
            >
              <div className="list-card">

                {/* 🔥 FIXED IMAGE */}
                <img
                  src={getImage(item)}
                  alt={item.title || "news"}
                  className="list-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMG;
                  }}
                />

                <div className="list-card-body">

                  <div className="list-card-title">
                    {item.title || "No Title"}
                  </div>

                  <div className="list-card-meta">
                    {activeCity.name} •{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN")
                      : "Today"}
                  </div>

                </div>

              </div>
            </Link>
          ))}

      </div>

      {/* ================= BUTTON ================= */}
      <div className="city-btn-wrap">
        <Link to={`/city/${activeCity.slug}`} className="city-btn">
          {activeCity.name} News →
        </Link>
      </div>

    </div>
  );
};

export default CitySection;