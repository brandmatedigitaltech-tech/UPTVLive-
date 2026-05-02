import { Link } from "react-router-dom";

const FALLBACK_IMG = "/no-image.jpg";

// 🔥 SAFE IMAGE HANDLER (SUPPORTS MULTIPLE IMAGES)
// const getImage = (news) => {
//   // 1️⃣ check multiple images
//   if (Array.isArray(news.images) && news.images.length > 0) {
//     return news.images[0];
//   }

//   // 2️⃣ fallback to single image
//   if (news.image && news.image.trim() !== "") {
//     return news.image;
//   }

//   return FALLBACK_IMG;
// };


const getImage = (news) => {
  // 1️⃣ check multiple images (VALID URL only)
  if (
    Array.isArray(news.images) &&
    news.images.length > 0 &&
    news.images[0] &&
    news.images[0].trim() !== ""
  ) {
    return news.images[0];
  }

  // 2️⃣ fallback to single image
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

  // 🔥 SAFE SLUG
  const articleLink = news.slug ? `/article/${news.slug}` : "#";

  return (
    <Link
      to={articleLink}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={card}>

        {/* IMAGE */}
        <img
          src={imageUrl || FALLBACK_IMG}
          alt={titleText}
          style={image}
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_IMG;
          }}
        />

        {/* CONTENT */}
        <div style={body}>

          {/* CATEGORY */}
          <span style={tag}>
            {news.categories?.[0] || "News"}
          </span>

          {/* TITLE */}
          <h3 style={title}>{titleText}</h3>

          {/* META */}
          <div style={meta}>
            ⏰ {formatDate(news.createdAt)} • 👁 {news.views || 0}
          </div>

        </div>

      </div>
    </Link>
  );
};

// 📅 DATE FORMAT
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

/* 🔥 STYLES (UNCHANGED UI) */
const card = {
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

export default NewsCard;