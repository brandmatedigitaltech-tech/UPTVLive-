import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import API from "../../services/api";

const FALLBACK_IMG = "/no-image.jpg";

// 🔥 SAFE IMAGE HANDLER (SUPPORT MULTIPLE IMAGES)
const getImage = (news) => {
  if (Array.isArray(news.images) && news.images.length > 0) {
    return news.images[0];
  }

  if (news.image && news.image.trim() !== "") {
    return news.image;
  }

  return FALLBACK_IMG;
};

const Hero = () => {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef(null);

  // ================= FETCH =================
  useEffect(() => {
    const fetchHeroNews = async () => {
      try {
        setLoading(true);

        const res = await API.get("/news/section/hero");
        let data = Array.isArray(res.data) ? res.data : [];

        // 🔥 SAFE FALLBACK
        if (data.length === 0) {
          const fallback = await API.get("/news");
          data = Array.isArray(fallback.data) ? fallback.data : [];
        }

        setNews(data.slice(0, 5));
      } catch (err) {
        console.log("Hero API Error:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroNews();
  }, []);

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (news.length === 0) return;

    startAutoSlide();

    return () => stopAutoSlide(); // 🔥 CLEANUP FIX
  }, [news]);

  const startAutoSlide = () => {
    stopAutoSlide();

    intervalRef.current = setInterval(() => {
      setIndex((prev) =>
        prev === news.length - 1 ? 0 : prev + 1
      );
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // ================= CONTROLS =================
  const nextSlide = () => {
    setIndex((prev) =>
      prev === news.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? news.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="hero-loading">Loading news...</div>
      </div>
    );
  }

  if (news.length === 0) return null;

  const mainNews = news[index];
  const sideNews = news
    .filter((item) => item._id !== mainNews._id)
    .slice(0, 5);

  return (
    <div className="container">
      <div
        className="hero"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <div className="hero-grid">

          {/* MAIN */}
          <div className="hero-main">

            <Link to={`/article/${mainNews.slug}`}>
              <img
                src={getImage(mainNews)}
                alt={mainNews.title}
                className="hero-img fade"
                loading="lazy"
                onError={(e) => {
                  e.target.src = FALLBACK_IMG;
                }}
              />
            </Link>

            {/* CONTROLS */}
            <button className="nav prev" onClick={prevSlide}>❮</button>
            <button className="nav next" onClick={nextSlide}>❯</button>

            <div className="hero-overlay">

              <div className="hero-category">
                <span className="tag">🔴 BREAKING</span>

                <span className="tag tag-blue">
                  {mainNews.tags?.[0] || "UP"}
                </span>
              </div>

              <Link to={`/article/${mainNews.slug}`} className="hero-link">
                <div className="hero-title">
                  {mainNews.title}
                </div>
              </Link>

              <div className="hero-meta">
                <span>✍️ UPTV Desk</span>
                <span className="dot"></span>

                <span>
                  {mainNews.createdAt
                    ? new Date(mainNews.createdAt).toLocaleDateString("en-IN")
                    : "Today"}
                </span>

                <span className="dot"></span>
                <span>👁 {mainNews.views || 0}</span>
              </div>

            </div>
          </div>

          {/* SIDE */}
          <div className="hero-side">

            <div className="hero-side-header">
              Latest News
            </div>

            {sideNews.map((item) => (
              <Link
                to={`/article/${item.slug}`}
                key={item._id}
                className="side-link"
              >
                <div className="side-card">

                  <img
                    src={getImage(item)}
                    alt={item.title}
                    className="side-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMG;
                    }}
                  />

                  <div className="side-card-body">

                    <span className="tag small-tag">
                      {item.tags?.[0] || "UP"}
                    </span>

                    <div className="side-card-title">
                      {item.title}
                    </div>

                    <div className="side-card-meta">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN")
                        : "Today"}
                    </div>

                  </div>

                </div>
              </Link>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;