import { Link } from "react-router-dom";

import {
  shareToWhatsApp,
} from "../../utils/shareArticle";

// =====================================================
// ================= FALLBACK IMAGE ====================
// =====================================================

const FALLBACK_IMG =
  "https://www.uptvlive.com/no-image.jpg";

// =====================================================
// ================= IMAGE =============================
// =====================================================

const getImage = (news) => {

  if (
    Array.isArray(news.images) &&
    news.images.length > 0 &&
    news.images[0] &&
    news.images[0].trim() !== ""
  ) {
    return news.images[0];
  }

  if (
    news.image &&
    news.image.trim() !== ""
  ) {
    return news.image;
  }

  return FALLBACK_IMG;
};

// =====================================================
// ================= DATE FORMAT =======================
// =====================================================

const formatDate = (date) => {

  if (!date) return "Today";

  try {

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );

  } catch {

    return "Today";
  }
};

// =====================================================
// ================= COMPONENT =========================
// =====================================================

const NewsCard = ({ news }) => {

  if (!news) return null;

  const imageUrl =
    getImage(news);

  const titleText =
    news.title
      ? news.title.length > 80
        ? news.title.slice(0, 80) + "..."
        : news.title
      : "No Title";

  const articleLink =
    news.slug
      ? `/article/${news.slug}`
      : "#";

  // =====================================================
  // ================= SHARE =============================
  // =====================================================

  const handleShare = (e) => {

    e.preventDefault();

    e.stopPropagation();

    shareToWhatsApp(news);
  };

  // =====================================================
  // ================= RETURN ============================
  // =====================================================

  return (
    <Link
      to={articleLink}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >

      <div style={card}>

        {/* SHARE BUTTON */}

        <button
          style={shareBtn}
          onClick={handleShare}
        >
          <i className="fab fa-whatsapp"></i>
        </button>

        {/* IMAGE */}

        <img
          src={imageUrl}
          alt={titleText}
          style={image}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              FALLBACK_IMG;
          }}
        />

        {/* BODY */}

        <div style={body}>

          <span style={tag}>
            {
              news.categories?.[0]
              || "News"
            }
          </span>

          <h3 style={title}>
            {titleText}
          </h3>

          <div style={meta}>

            ⏰ {
              formatDate(
                news.createdAt
              )
            }

            {" "}•{" "}

            👁 {
              news.views || 0
            }

          </div>

        </div>

      </div>

    </Link>
  );
};

// =====================================================
// ================= STYLES ============================
// =====================================================

const card = {
  position: "relative",

  borderRadius: "12px",

  overflow: "hidden",

  background: "#fff",

  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)",

  transition: "0.3s",

  cursor: "pointer",
};

const image = {
  width: "100%",

  height: "170px",

  objectFit: "cover",
};

const body = {
  padding: "12px",
};

const tag = {
  fontSize: "12px",

  color: "#d60000",

  fontWeight: "bold",

  textTransform: "capitalize",
};

const title = {
  fontSize: "15px",

  margin: "6px 0",

  lineHeight: "1.5",

  fontWeight: "700",
};

const meta = {
  fontSize: "12px",

  color: "gray",
};

const shareBtn = {
  position: "absolute",

  top: "10px",

  right: "10px",

  width: "38px",

  height: "38px",

  borderRadius: "50%",

  background: "#25D366",

  color: "#fff",

  border: "none",

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  zIndex: 2,

  fontSize: "18px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.2)",
};

export default NewsCard;