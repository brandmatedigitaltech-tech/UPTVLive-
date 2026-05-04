import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./ApprovedNews.css";


// ✅ SAME IMAGE HELPER (IMPORTANT)
const getImage = (item) => {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }

  if (item.image && item.image.trim() !== "") {
    return item.image;
  }

  return FALLBACK_IMG;
};

const getYouTubeEmbed = (url) => {
  if (!url) return null;

  const regExp =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;

  const match = url.match(regExp);

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const ApprovedNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // 🔥 MOVE HERE (INSIDE COMPONENT)
  const [imageFiles, setImageFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // ================= FETCH =================
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/news");
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ================= INIT QUILL =================
  useEffect(() => {
    if (editMode && editorRef.current) {
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

      if (editItem?.content) {
        quill.root.innerHTML = editItem.content;
      }
    }
  }, [editMode, editItem]);

  // ================= DELETE =================
  const deleteNews = async (id) => {
    if (!window.confirm("Delete this news?")) return;

    try {
      await API.delete(`/news/${id}`);
      fetchNews();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= OPEN EDIT =================
const openEdit = (item) => {
  setEditItem(item);
  setEditMode(true);
  setYoutubeUrl(item.youtubeUrl || "");

  // 🔥 SHOW OLD IMAGES IN PREVIEW
  setPreview(item.images || []);
};

  // ================= UPDATE =================
  const updateNews = async () => {
    if (!quillRef.current) return;

    const content = quillRef.current.root.innerHTML;

    if (!content.trim()) return alert("Content required ❌");

    try {
await API.put(`/news/${editItem._id}`, {
  content,
  youtubeUrl,
  images: editItem.images, // 🔥 ADD THIS
});


      alert("Updated ✅");

      quillRef.current = null;
      setEditItem(null);
      setEditMode(false);

      fetchNews();
    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  // ================= CLEAN PREVIEW =================
  const cleanHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").slice(0, 120);
  };
  // ================= IMAGE HANDLING =================
const handleFile = (files) => {
  const fileArray = Array.from(files);

  setImageFiles(fileArray);

  const previewUrls = fileArray.map((file) =>
    URL.createObjectURL(file)
  );

  setPreview(previewUrls);
};

const handleChange = (e) => handleFile(e.target.files);

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files);
  }
};

const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(
    e.type === "dragenter" || e.type === "dragover"
  );
};

// ================= UPLOAD =================
const uploadImage = async () => {
  if (!imageFiles.length) return alert("Select images ❌");

  try {
    const data = new FormData();

    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    const res = await API.post("/upload/upload-multiple", data);

    // 🔥 UPDATE EDIT ITEM
    setEditItem((prev) => ({
      ...prev,
      images: res.data.images,
      image: res.data.images[0],
    }));

    alert("Images uploaded ✅");

  } catch {
    alert("Upload failed ❌");
  }
};

  return (
    <div className="approved-container">

      <h2 className="heading">Approved News ✅</h2>

      {/* LOADING */}
      {loading && <p className="loading">Loading...</p>}

      <div className="news-list">
        {!loading && news.length === 0 ? (
          <p className="empty">No approved news</p>
        ) : (
          news.map((item) => (
            <div
              className="news-card"
              key={item._id}
              onClick={() =>
                navigate(`/article/${item.slug || item._id}`)
              }
            >

              {/* ✅ FIXED IMAGE */}
              <div className="image-box">
                <img
                  src={getImage(item)}
                  alt="news"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMG;
                  }}
                />
              </div>


              {/* CONTENT */}
              <div className="news-content">

                <h3 className="title">
                  {item.title || "No Title"}
                </h3>

                <p className="desc">
                  {cleanHtml(item.content)}...
                </p>

                {/* TAGS */}
                <div className="tags">
                  {item.categories?.map((cat, i) => (
                    <span key={i}>#{cat}</span>
                  ))}
                </div>

                {/* ACTIONS */}
                <div
                  className="actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="edit"
                    onClick={() => openEdit(item)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteNews(item._id)}
                  >
                    ❌ Delete
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editItem && (
        <div className="preview-modal">
          <div className="preview-box">

            {/* CLOSE */}
            <button
              className="close-btn"
              onClick={() => {
                setEditItem(null);
                setEditMode(false);
                quillRef.current = null;
              }}
            >
              ✖
            </button>

            {/* TITLE */}
            <h2>{editItem.title}</h2>

            

            {/* ================= YOUTUBE INPUT ================= */}
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Paste YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
              
            {/* ================= YOUTUBE PREVIEW ================= */}
            {getYouTubeEmbed(youtubeUrl) && (
              <div style={{ marginTop: "10px" }}>
                <iframe
                  src={getYouTubeEmbed(youtubeUrl)}
                  title="YouTube preview"
                  width="100%"
                  height="200"
                  style={{ borderRadius: "8px" }}
                  allowFullScreen
                />
              </div>
            )}
            {/* ================= IMAGE EDIT ================= */}
<div style={{ marginTop: "15px" }}>
  <label>Update Images / Thumbnail</label>

  <div
    className={`drop-zone ${dragActive ? "active" : ""}`}
    onDragEnter={handleDrag}
    onDragOver={handleDrag}
    onDragLeave={handleDrag}
    onDrop={handleDrop}
  >
    <input
      type="file"
      multiple
      onChange={handleChange}
    />

    {preview.length === 0 ? (
      <p>Drag & Drop or Click</p>
    ) : (
      <div>
        {preview.map((img, i) => (
          <img
            key={i}
            src={img}
            className="preview-img"
          />
        ))}
      </div>
    )}
  </div>

  <button
    style={{
      marginTop: "8px",
      padding: "6px 10px",
      borderRadius: "6px",
      background: "#2196f3",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    }}
    onClick={uploadImage}
  >
    Upload Images
  </button>
</div>
            {/* EDITOR */}
            <div
              ref={editorRef}
              style={{ height: "250px", marginTop: "10px" }}
            />

            {/* ACTIONS */}
            <div style={{ marginTop: "15px" }}>

              <button
                className="approve-btn"
                onClick={updateNews}
              >
                💾 Save
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  setEditItem(null);
                  setEditMode(false);
                  quillRef.current = null;
                }}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApprovedNews;
