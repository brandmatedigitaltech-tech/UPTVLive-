import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Sidebar/Sidebar.css";
import API from "../../services/api";

const Trending = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH NEWS
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const res = await API.get("/news");

        const data = Array.isArray(res.data) ? res.data : [];

        // ✅ SORT BY VIEWS
        const trending = data
          .sort((a, b) => (b?.views || 0) - (a?.views || 0))
          .slice(0, 5);

        setNews(trending);

      } catch (err) {
        console.log("Trending Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="sidebar-section">

      <div className="sidebar-section-title">🔥 ट्रेंडिंग</div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading && news.length === 0 && (
        <p>No trending news</p>
      )}

      {/* DATA */}
      {!loading &&
        news.map((item, index) => (
          <Link
            to={`/article/${item.slug || item._id}`} // ✅ fallback
            key={item._id}
            className="numbered-link"
          >
            <div className="numbered-card">

              {/* NUMBER */}
              <div className="num-badge">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* TITLE */}
              <div className="numbered-card-title">
                {item.title || "No Title"}
              </div>

            </div>
          </Link>
        ))}

    </div>
  );
};

export default Trending;