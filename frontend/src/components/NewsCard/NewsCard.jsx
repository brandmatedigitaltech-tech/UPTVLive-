import { Link } from "react-router-dom";

const FALLBACK_IMG = "/no-image.jpg";

// ================= IMAGE =================
const getImage = (news) => {
  if (
    Array.isArray(news.images) &&
    news.images.length > 0 &&
    news.images[0] &&
    news.images[0].trim() !== ""
  ) {
    return news.images[0];
  }

  if (news.image && news.image.trim() !== "") {
    return news.image;
  }

  return FALLBACK_IMG;
};

const NewsCard = ({ news }) => {
  if (!news) return null;

  const imageUrl = getImage(news);

  const titleText = news.title
    ? news.title.length > 80
      ? news.title.slice(0, 80) + "..."
      : news.title
    : "No Title";

  const articleLink = news.slug ? `/article/${news.slug}` : "#";

  // ================= SIMPLE SHARE =================
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}${articleLink}`;

    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.title,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied ✅");
    }
  };

  return (
    <Link
      to={articleLink}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={card}>

        {/* 🔥 SIMPLE SHARE BUTTON */}
        <button style={shareBtn} onClick={handleShare}>
          <i className="fas fa-share"></i>
        </button>

        {/* IMAGE */}
        <img
          src={imageUrl}
          alt={titleText}
          style={image}
          loading="lazy"
          onError={(e) => (e.target.src = FALLBACK_IMG)}
        />

        {/* CONTENT */}
        <div style={body}>
          <span style={tag}>
            {news.categories?.[0] || "News"}
          </span>

          <h3 style={title}>{titleText}</h3>

          <div style={meta}>
            ⏰ {formatDate(news.createdAt)} • 👁 {news.views || 0}
          </div>
        </div>

      </div>
    </Link>
  );
};

// ================= DATE =================
const formatDate = (date) => {
  if (!date) return "Today";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "Today";
  }
};

// ================= STYLES =================
const card = {
  position: "relative",
  borderRadius: "10px",
  overflow: "hidden",
  background: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  transition: "0.3s",
  cursor: "pointer",
};

const image = {
  width: "100%",
  height: "170px",
  objectFit: "cover",
};

const body = {
  padding: "10px",
};

const tag = {
  fontSize: "12px",
  color: "#d60000",
  fontWeight: "bold",
};

const title = {
  fontSize: "15px",
  margin: "5px 0",
  lineHeight: "1.4",
};

const meta = {
  fontSize: "12px",
  color: "gray",
};

const shareBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
};

export default NewsCard;
