import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./ReviewPage.css";

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ================= DECODE HTML =================
  const decodeHtml = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // ================= CLEAN HTML =================
  const cleanHtml = (html) => {
    if (!html) return "";

    // 🔥 STEP 1: Decode if encoded
    let decoded = html.includes("&lt;") ? decodeHtml(html) : html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(decoded, "text/html");

    // ❌ remove span but keep inner content
    doc.querySelectorAll("span").forEach((el) => {
      el.replaceWith(...el.childNodes);
    });

    // ❌ remove unwanted attributes
    doc.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("style");
      el.removeAttribute("class");
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-list");
    });

    // ❌ remove empty paragraphs
    doc.querySelectorAll("p").forEach((p) => {
      if (!p.textContent.trim()) p.remove();
    });

    return doc.body.innerHTML;
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get(`/news/id/${id}`);

        // 🔥 DEBUG (you can remove later)
        console.log("CONTENT:", res.data.content);

        setNews(res.data);
      } catch (err) {
        console.log("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // ================= APPROVE =================
  const approve = async () => {
    try {
      setProcessing(true);
      await API.put(`/news/approve/${id}`, { comment });

      alert("Approved ✅");
      navigate("/dashboard");
    } catch {
      alert("Approval failed ❌");
    } finally {
      setProcessing(false);
    }
  };

  // ================= DELETE =================
  const deleteNews = async () => {
    if (!window.confirm("Delete this news?")) return;

    try {
      setProcessing(true);
      await API.delete(`/news/${id}`);

      alert("Deleted ❌");
      navigate("/dashboard");
    } catch {
      alert("Delete failed ❌");
    } finally {
      setProcessing(false);
    }
  };

  // ================= STATES =================
  if (loading) return <p className="loading">Loading...</p>;
  if (!news) return <p className="empty">News not found</p>;

  return (
    <div className="review-container">

      {/* HEADER */}
      <div className="review-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>📝 Review News</h2>
      </div>

      {/* CARD */}
      <div className="review-card">

        {/* TITLE */}
        <h1 className="review-title">{news.title}</h1>

        {/* META */}
        <div className="review-meta">
          ✍️ {news.author || "Writer"} •{" "}
          {news.categories?.join(", ") || "General"}
        </div>

        {/* TAGS */}
        <div className="review-tags">
          {news.tags?.map((tag, i) => (
            <span key={i}>#{tag}</span>
          ))}
        </div>

        {/* IMAGE */}
        <img
          src={news.image || "/no-image.jpg"}
          alt="news"
          className="review-image"
        />

        {/* 🔥 CLEAN CONTENT */}
        <div
          className="review-content"
          dangerouslySetInnerHTML={{
            __html: cleanHtml(news.content),
          }}
        />

      </div>

      {/* COMMENT */}
      <div className="review-comment-box">
        <h3>Admin Comment</h3>

        <textarea
          placeholder="Write feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="review-actions">

        <button
          className="approve-btn"
          onClick={approve}
          disabled={processing}
        >
          {processing ? "Processing..." : "✅ Approve"}
        </button>

        <button
          className="delete-btn"
          onClick={deleteNews}
          disabled={processing}
        >
          {processing ? "Processing..." : "❌ Delete"}
        </button>

      </div>

    </div>
  );
};

export default ReviewPage;