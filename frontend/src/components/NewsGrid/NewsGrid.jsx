import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewsCard from "../NewsCard/NewsCard";
import API from "../../services/api";
import "./NewsGrid.css";

const NewsGrid = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchNewsGrid = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔥 TRY SECTION FIRST
        const res = await API.get("/news/section/newsgrid");

        let data = Array.isArray(res.data) ? res.data : [];

        // 🔥 FALLBACK IF EMPTY
        if (data.length === 0) {
          const fallback = await API.get("/news");
          data = Array.isArray(fallback.data) ? fallback.data : [];
        }

        setNews(data.slice(0, 12));

      } catch (err) {
        console.error("NewsGrid Error:", err);
        setError("Failed to load news");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsGrid();
  }, []);

  return (
    <div style={{ marginBottom: "24px" }}>

      {/* HEADER */}
      <div className="section-hdr">
        <div className="section-title">
          टॉप न्यूज़ <span className="count">आज की खबरें</span>
        </div>

        {/* 🔥 FIXED LINK */}
        <Link to="/" className="view-all">
          सभी देखें →
        </Link>
      </div>

      {/* LOADING */}
      {loading && <p style={{ padding: "10px" }}>Loading...</p>}

      {/* ERROR */}
      {!loading && error && (
        <p style={{ padding: "10px", color: "red" }}>{error}</p>
      )}

      {/* EMPTY */}
      {!loading && !error && news.length === 0 && (
        <p style={{ padding: "10px" }}>No news available</p>
      )}

      {/* GRID */}
      <div className="grid-3">
        {!loading &&
          !error &&
          news.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))}
      </div>

    </div>
  );
};

export default NewsGrid;