import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import API from "../../services/api";
import "./ArticlePage.css";
import AdBanner from "../AdBanner";


const FALLBACK_IMG = "/no-image.jpg";

const ArticlePage = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);

  const [relatedNews, setRelatedNews] = useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const intervalRef = useRef(null);

  // =====================================================
  // ================= SAFE IMAGE ========================
  // =====================================================

  const getImage = (img) => {
    if (!img || img.trim() === "") {
      return FALLBACK_IMG;
    }

    return img;
  };

  // =====================================================
  // ================= CLEAN HTML ========================
  // =====================================================

  const decodeHtml = (html) => {
    if (!html) return "";

    const txt =
      document.createElement("textarea");

    txt.innerHTML = html;

    return txt.value;
  };

  const cleanHtml = (html) => {
    if (!html) return "";

    const parser = new DOMParser();

    const doc = parser.parseFromString(
      html,
      "text/html"
    );

    // ✅ REMOVE SCRIPT TAGS
    doc
      .querySelectorAll("script")
      .forEach((el) => el.remove());

    // ✅ REMOVE IFRAME TAGS
    doc
      .querySelectorAll("iframe")
      .forEach((el) => el.remove());

    // ✅ REMOVE STYLES
    doc
      .querySelectorAll("*")
      .forEach((el) => {
        el.removeAttribute("style");

        el.removeAttribute("class");

        el.removeAttribute(
          "contenteditable"
        );

        el.removeAttribute("data-list");
      });

    return doc.body.innerHTML;
  };

  const formatContent = (html) => {
    return cleanHtml(decodeHtml(html));
  };

  // =====================================================
  // ================= YOUTUBE ===========================
  // =====================================================

  const getYouTubeEmbed = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;

    const match = url.match(regExp);

    return match
      ? `https://www.youtube.com/embed/${match[1]}`
      : null;
  };

  // =====================================================
  // ================= SHARE HELPERS =====================
  // =====================================================

  const articleUrl = article
    ? `${window.location.origin}/article/${article.slug}`
    : "";

  // ✅ NATIVE SHARE
  const handleShare = async () => {
    if (!article) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text:
            article.seoDescription ||
            article.title,
          url: articleUrl,
        });

      } else {
        await navigator.clipboard.writeText(
          articleUrl
        );

        alert("Link copied ✅");
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ COPY LINK
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        articleUrl
      );

      alert("Link copied ✅");

    } catch (err) {
      console.log(err);
    }
  };

  // =====================================================
  // ================= SEO META ==========================
  // =====================================================



  // =====================================================
  // ================= FETCH ARTICLE =====================
  // =====================================================

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(
          `/news/${slug}`
        );

        setArticle(res.data);

        setCurrentIndex(0);

      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();

  }, [slug]);

  // =====================================================
  // ================= AUTO SLIDER =======================
  // =====================================================

  const stopSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }
  };

  const startSlider = () => {
    stopSlider();

    if (
      !article?.images ||
      article.images.length <= 1
    ) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === article.images.length - 1
          ? 0
          : prev + 1
      );
    }, 3000);
  };

  useEffect(() => {
    startSlider();

    return () => stopSlider();

  }, [article]);

  // =====================================================
  // ================= RELATED NEWS ======================
  // =====================================================

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await API.get("/news");

        const allNews = Array.isArray(
          res.data
        )
          ? res.data
          : [];

        // ✅ BETTER RELATED FILTER
        const filtered = allNews
          .filter(
            (n) =>
              n.slug !== slug &&
              (
                n.categories?.some((c) =>
                  article?.categories?.includes(
                    c
                  )
                ) ||

                n.tags?.some((t) =>
                  article?.tags?.includes(
                    t
                  )
                )
              )
          )
          .slice(0, 4);

        setRelatedNews(filtered);

      } catch (err) {
        console.log(err);
      }
    };

    if (article) {
      fetchRelated();
    }

  }, [slug, article]);

  // =====================================================
  // ================= LOADING ===========================
  // =====================================================

  if (!article) {
    return (
      <p className="loading">
        Loading...
      </p>
    );
  }

  const images = Array.isArray(
    article.images
  )
    ? article.images
    : [];

  // =====================================================
  // ================= RENDER ============================
  // =====================================================

  return (
    <div className="article-container">
   

    <Helmet>
      <title>
        {article.title} | UPTV Live
      </title>

      <meta
        name="description"
        content={
          article.seoDescription ||
          article.title
        }
      />

      {/* OPEN GRAPH */}
      <meta
        property="og:title"
        content={article.title}
      />

      <meta
        property="og:description"
        content={
          article.seoDescription ||
          article.title
        }
      />

      <meta
        property="og:image"
        content={
          article.image ||
          article.images?.[0] ||
          FALLBACK_IMG
        }
      />

      <meta
        property="og:url"
        content={articleUrl}
      />

      <meta
        property="og:type"
        content="article"
      />

      {/* TWITTER */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={article.title}
      />

      <meta
        name="twitter:description"
        content={
          article.seoDescription ||
          article.title
        }
      />

      <meta
        name="twitter:image"
        content={
          article.image ||
          article.images?.[0] ||
          FALLBACK_IMG
        }
      />
    </Helmet>

      {/* BACK */}
      <Link
        to="/"
        className="back-link"
      >
        ← होम
      </Link>

      {/* CATEGORY */}
      <p className="article-category">
        {article.categories?.[0] ||
          "News"}{" "}
        |{" "}
        {article.tags?.join(", ")}
      </p>

      {/* TITLE */}
      <h1 className="article-title">
        {article.title}
      </h1>

      {/* META */}
      <div className="article-meta-row">
        <p className="article-meta">
          ⏰{" "}
          {new Date(
            article.createdAt
          ).toLocaleString()}{" "}
          • 👁 {article.views}
        </p>

        {/* SHARE */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="share-btn"
            onClick={handleShare}
          >
            🔗 Share
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              articleUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="share-btn"
          >
            WhatsApp
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              articleUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="share-btn"
          >
            Telegram
          </a>

          <button
            className="share-btn"
            onClick={copyLink}
          >
            Copy
          </button>
        </div>
      </div>

      {/* TOP AD */}
      <AdBanner position="article_top" />

      {/* ================================================= */}
      {/* ================= IMAGE SLIDER ================== */}
      {/* ================================================= */}

      {images.length > 0 ? (
        <div
          className="slider"
          onMouseEnter={stopSlider}
          onMouseLeave={startSlider}
        >
          <img
            src={getImage(
              images[currentIndex]
            )}
            className="slide-img"
            alt={article.title}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                FALLBACK_IMG;
            }}
          />

          {images.length > 1 && (
            <>
              <button
                className="prev-btn"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0
                      ? images.length - 1
                      : prev - 1
                  )
                }
              >
                ‹
              </button>

              <button
                className="next-btn"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev ===
                    images.length - 1
                      ? 0
                      : prev + 1
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
          alt={article.title}
          loading="lazy"
        />
      )}

      {/* CONTENT */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{
          __html: formatContent(
            article.content
          ),
        }}
      />

      {/* MIDDLE AD */}
      <AdBanner position="article_middle" />

      {/* YOUTUBE */}
      {article.youtubeUrl &&
        getYouTubeEmbed(
          article.youtubeUrl
        ) && (
          <div className="video-container">
            <iframe
              src={getYouTubeEmbed(
                article.youtubeUrl
              )}
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

      {/* BOTTOM AD */}
      <AdBanner position="article_bottom" />

      {/* ================================================= */}
      {/* ================= RELATED ======================= */}
      {/* ================================================= */}

      <div className="related-section">
        <h3>
          🔥 संबंधित खबरें
        </h3>

        <div className="related-grid">
          {relatedNews.map((item) => {
            const img =
              item.image ||
              item.images?.[0] ||
              FALLBACK_IMG;

            return (
              <Link
                key={item._id}
                to={`/article/${item.slug}`}
                className="related-card"
              >
                <img
                  src={img}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      FALLBACK_IMG;
                  }}
                />

                <div className="related-content">
                  <p>
                    {item.title ||
                      "No Title"}
                  </p>
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