import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SpecialSection.css";
import API from "../../services/api";

const SpecialSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get("/news/section/special");

        const data = Array.isArray(res.data) ? res.data : [];

        setNews(data.slice(0, 4)); // ✅ limit to 4
      } catch (err) {
        console.log("SpecialSection Error:", err);
        setNews([]); // ✅ prevent crash
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="special-section">

      {/* HEADER */}
      <div className="section-hdr">
        <div className="section-title">🔥 स्पेशल रिपोर्ट</div>
      </div>

      {/* LOADING */}
      {loading && <p className="loading">Loading...</p>}

      {/* EMPTY */}
      {!loading && news.length === 0 && (
        <p className="empty">No special news available</p>
      )}

      {/* GRID */}
      <div className="grid-2 special-grid">

        {!loading &&
          news.map((item) => (
            <Link
              to={`/article/${item.slug}`}
              className="special-card"
              key={item._id}
            >

              {/* LABEL */}
              <div className="special-card-label">
                SPECIAL
              </div>

              {/* TITLE */}
              <div className="special-card-title">
                {item.title || "No Title"}
              </div>

              {/* META */}
              <div className="special-meta">
                {item.author || "UPTV"} •{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "Today"}
              </div>

            </Link>
          ))}
      </div>

    </div>
  );
};

export default SpecialSection;