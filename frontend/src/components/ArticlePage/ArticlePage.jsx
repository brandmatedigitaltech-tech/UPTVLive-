import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import "./ArticlePage.css";
import AdBanner from "../AdBanner";


const FALLBACK_IMG = "/no-image.jpg";

const ArticlePage = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef(null);

  // ================= SAFE IMAGE =================
  const getImage = (img) => {
    if (!img || img.trim() === "") return FALLBACK_IMG;
    return img;
  };

  // ================= CLEAN HTML =================
  const decodeHtml = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const cleanHtml = (html) => {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("span").forEach((el) => {
      el.replaceWith(...el.childNodes);
    });

    doc.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("style");
      el.removeAttribute("class");
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-list");
    });

    return doc.body.innerHTML;
  };

  const formatContent = (html) => cleanHtml(decodeHtml(html));

  // ================= YOUTUBE =================
  const getYouTubeEmbed = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;

    const match = url.match(regExp);

    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // ================= FETCH ARTICLE =================
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/news/${slug}`);
        setArticle(res.data);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
  }, [slug]);

  // ================= AUTO SLIDER (IMPROVED) =================
  useEffect(() => {
    if (!article?.images?.length) return;

    stopSlider();

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === article.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return stopSlider;
  }, [article]);

  const stopSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // ================= RELATED =================
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await API.get("/news");

        const filtered = (Array.isArray(res.data) ? res.data : [])
          .filter((n) => n.slug !== slug)
          .slice(0, 4);

        setRelatedNews(filtered);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRelated();
  }, [slug]);

  if (!article) return <p className="loading">Loading...</p>;

  const images = Array.isArray(article.images) ? article.images : [];

  return (
    <div className="article-container">
    
      {/* BACK */}
      <Link to="/" className="back-link">← होम</Link>
  
      {/* CATEGORY */}
      <p className="article-category">
        {(article.categories?.[0] || "News")} |{" "}
        {article.tags?.join(", ")}
      </p>
  
      {/* TITLE */}
      <h1 className="article-title">{article.title}</h1>
  
      {/* META */}
      <p className="article-meta">
        ⏰ {new Date(article.createdAt).toLocaleString()} • 👁 {article.views}
      </p>
  
      {/* 🔥 TOP AD (BEST POSITION) */}
      <AdBanner position="article_top" />
  
      {/* ================= IMAGE ================= */}
      {images.length > 0 ? (
        <div
          className="slider"
          onMouseEnter={stopSlider}
          onMouseLeave={() => {
            if (images.length > 1) {
              intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                );
              }, 3000);
            }
          }}
        >
          <img
            src={getImage(images[currentIndex])}
            className="slide-img"
            alt="news"
            loading="lazy"
            onError={(e) => (e.target.src = FALLBACK_IMG)}
          />
  
          {images.length > 1 && (
            <>
              <button
                className="prev-btn"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
              >
                ‹
              </button>
              
              <button
                className="next-btn"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
              >
                ›
              </button>
            </>
          )}
        </div>
      ) : (
        <img
          src={getImage(article.image)}
          className="article-image"
          alt="news"
          loading="lazy"
        />
      )}
  
      {/* ================= CONTENT ================= */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{
          __html: formatContent(article.content),
        }}
      />
  
      {/* 🔥 MIDDLE AD (AFTER CONTENT - CLEAN UX) */}
      <AdBanner position="article_middle" />
      
      {/* ================= YOUTUBE ================= */}
      {article.youtubeUrl && getYouTubeEmbed(article.youtubeUrl) && (
        <div className="video-container">
          <iframe
            src={getYouTubeEmbed(article.youtubeUrl)}
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}
  
      {/* 🔥 BOTTOM AD */}
      <AdBanner position="article_bottom" />
    
      {/* ================= RELATED ================= */}
      <div className="related-section">
        <h3>🔥 संबंधित खबरें</h3>
    
        <div className="related-grid">
          {relatedNews.map((item) => {
            const img =
              (Array.isArray(item.images) && item.images[0]) ||
              (item.image && item.image.trim() !== "") ||
              "/no-image.jpg";
          
            return (
              <Link
                key={item._id}
                to={`/article/${item.slug}`}
                className="related-card"
              >
                <img
                  src={img}
                  alt="related"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/no-image.jpg")}
                />
  
                <div className="related-content">
                  <p>{item.title || "No Title"}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
        
    </div>
  );
};

export default ArticlePage;