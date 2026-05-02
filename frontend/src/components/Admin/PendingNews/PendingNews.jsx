import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./PendingNews.css";

const FALLBACK_IMG = "/no-image.jpg";

// ✅ FIXED IMAGE HELPER
const getImage = (item) => {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }

  if (item.image && item.image.trim() !== "") {
    return item.image;
  }

  return FALLBACK_IMG;
};

const PendingNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewItem, setPreviewItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // ================= FETCH =================
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/news/pending");
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Pending Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ================= QUILL INIT =================
  useEffect(() => {
    if (!editMode || !editorRef.current) return;

    editorRef.current.innerHTML = "";
    quillRef.current = null;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Edit news content...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image", "link"],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;

    if (previewItem?.content) {
      quill.root.innerHTML = previewItem.content;
    }
  }, [editMode, previewItem]);

  // ================= APPROVE =================
  const approveNews = async (id) => {
    if (!window.confirm("Approve this news?")) return;

    try {
      await API.put(`/news/approve/${id}`);
      alert("Approved ✅");
      setPreviewItem(null);
      fetchNews();
    } catch {
      alert("Approve failed ❌");
    }
  };

  // ================= DELETE =================
  const deleteNews = async (id) => {
    if (!window.confirm("Delete this news?")) return;

    try {
      await API.delete(`/news/${id}`);
      alert("Deleted ❌");
      setPreviewItem(null);
      fetchNews();
    } catch {
      alert("Delete failed ❌");
    }
  };

  // ================= UPDATE =================
  const updateNews = async () => {
    if (!quillRef.current) {
      alert("Editor not ready ❌");
      return;
    }

    const content = quillRef.current.root.innerHTML;

    if (!content || content === "<p><br></p>") {
      return alert("Content required ❌");
    }

    try {
      setSaving(true);

      await API.put(`/news/${previewItem._id}`, { content });

      alert("Updated ✅");

      setEditMode(false);
      setPreviewItem(null);

      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

      quillRef.current = null;

      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  // ================= PREVIEW TEXT =================
  const getTextPreview = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").slice(0, 120);
  };

  return (
    <div className="pending-container">
      <h2 className="heading">Pending News ⏱</h2>

      {loading && <p className="loading">Loading...</p>}

      {!loading && news.length === 0 && (
        <p className="empty">No pending news</p>
      )}

      <div className="news-list">
        {news.map((item) => (
          <div key={item._id} className="news-card">

            {/* ✅ FIXED IMAGE */}
            <div className="image-box">
              <img
                src={getImage(item)}   // 🔥 FIXED HERE
                alt="news"
                loading="lazy"
                onError={(e) => {
                  e.target.src = FALLBACK_IMG;
                }}
              />
            </div>

            <div className="news-content">
              <h3>{item.title}</h3>

              <p>{getTextPreview(item.content)}...</p>

              <div className="actions">
                <button onClick={() => setPreviewItem(item)}>
                  👁 Preview
                </button>

                <button onClick={() => approveNews(item._id)}>
                  ✅ Approve
                </button>

                <button onClick={() => deleteNews(item._id)}>
                  ❌ Delete
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {previewItem && (
        <div className="preview-modal">
          <div className="preview-box">

            <button
              className="close-btn"
              onClick={() => {
                setPreviewItem(null);
                setEditMode(false);
                if (editorRef.current) editorRef.current.innerHTML = "";
                quillRef.current = null;
              }}
            >
              ✖
            </button>

            <h2>{previewItem.title}</h2>

            {/* ✅ FIXED IMAGE */}
            <img
              src={getImage(previewItem)}  // 🔥 FIXED HERE
              alt="preview"
              loading="lazy"
              onError={(e) => {
                e.target.src = FALLBACK_IMG;
              }}
            />

            {!editMode ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: previewItem.content,
                }}
              />
            ) : (
              <div
                key={previewItem?._id + "-" + editMode}
                ref={editorRef}
                style={{ height: "250px" }}
              />
            )}

            <div className="modal-actions">
              {!editMode ? (
                <>
                  <button onClick={() => setEditMode(true)}>✏️ Edit</button>
                  <button onClick={() => approveNews(previewItem._id)}>✅ Approve</button>
                  <button onClick={() => deleteNews(previewItem._id)}>❌ Delete</button>
                </>
              ) : (
                <>
                  <button onClick={updateNews} disabled={saving}>
                    {saving ? "Saving..." : "💾 Save"}
                  </button>

                  <button
                    onClick={() => {
                      setPreviewItem(null);
                      setEditMode(false);
                      if (editorRef.current) editorRef.current.innerHTML = "";
                      quillRef.current = null;
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PendingNews;