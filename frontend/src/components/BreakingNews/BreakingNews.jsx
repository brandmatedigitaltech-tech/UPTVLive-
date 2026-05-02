import "./BreakingNews.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

const BreakingNews = ({ newsData = [] }) => {
  const [news, setNews] = useState([]);

  // ================= FETCH (ONLY IF NO PROP) =================
  useEffect(() => {
    if (newsData.length > 0) {
      setNews(newsData);
      return;
    }

    const fetchBreakingNews = async () => {
      try {
        const res = await API.get("/news/section/breaking");
        const data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          const fallback = await API.get("/news");
          setNews(Array.isArray(fallback.data) ? fallback.data : []);
        } else {
          setNews(data);
        }
      } catch (err) {
        console.log("Breaking News Error:", err);
      }
    };

    fetchBreakingNews();
  }, [newsData]);

  // ================= FILTER =================
  const breakingItems =
    news.filter((n) => n.isBreaking)?.length > 0
      ? news.filter((n) => n.isBreaking)
      : news.slice(0, 8);

  if (breakingItems.length === 0) return null;

  return (
    <div className="breaking">

      {/* LABEL */}
      <div className="breaking-label">
        <span className="breaking-pulse"></span>
        ब्रेकिंग
      </div>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker">

          {[...breakingItems, ...breakingItems].map((item, i) => (
            <Link
              to={`/article/${item.slug || item._id}`}
              key={i}
              className="ticker-item"
            >
              {item.title || "No Title"}
              <span className="ticker-sep">●</span>
            </Link>
          ))}

        </div>
      </div>

    </div>
  );
};

export default BreakingNews;