import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import "./Ads.css";

const FALLBACK_IMG = "/no-image.jpg";

const positionsList = [
  "home_top","home_middle","home_bottom",
  "article_top","article_middle","article_bottom",
  "category_top","category_inline","category_bottom",
  "city_top","city_inline","city_bottom",
  "sidebar_top","sidebar_middle","sidebar_bottom"
];

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    title: "",
    mediaUrl: "",
    redirectUrl: "",
    type: "image",
    positions: [],
  });

  // ================= FETCH =================
  const fetchAds = async () => {
    try {
      const res = await API.get("/ads");
      setAds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Fetch Ads Error:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // ================= UPLOAD =================
const uploadFile = async (file) => {
  if (!file) return;

  const fileType = file.type.startsWith("video") ? "video" : "image";

  const formData = new FormData();
  formData.append("images", file); // 🔥 MUST MATCH BACKEND

  try {
    setUploading(true);

    const res = await API.post("/upload/upload-multiple", formData);

    const url = res.data.images[0]; // 🔥 FIX

    setForm((prev) => ({
      ...prev,
      mediaUrl: url,
      type: fileType,
    }));

    setPreview(url);

  } catch (err) {
    console.error(err);
    alert("Upload failed ❌");
  } finally {
    setUploading(false);
  }
};
  // ================= EVENTS =================
  const handleDrop = (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files[0]);
  };

  const togglePosition = (pos) => {
    setForm((prev) => ({
      ...prev,
      positions: prev.positions.includes(pos)
        ? prev.positions.filter((p) => p !== pos)
        : [...prev.positions, pos],
    }));
  };

  // ================= CREATE =================
  const createAd = async () => {
    if (!form.mediaUrl || form.positions.length === 0) {
      return alert("Upload media & select positions ❌");
    }

    try {
      await API.post("/ads", form);

      alert("Ad Created ✅");

      setForm({
        title: "",
        mediaUrl: "",
        redirectUrl: "",
        type: "image",
        positions: [],
      });

      setPreview(null);
      fetchAds();

    } catch {
      alert("Error creating ad ❌");
    }
  };

  // ================= DELETE =================
  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;

    await API.delete(`/ads/${id}`);
    fetchAds();
  };

  return (
    <div className="ads-container">

      <h2>📢 Ads Management</h2>

      {/* ================= UPLOAD ================= */}
      <div
        className="upload-box"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <p>📤 Drag & Drop OR Click to Upload</p>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={(e) => uploadFile(e.target.files[0])}
        />
      </div>

      {/* ================= PREVIEW ================= */}
      {preview && (
        <div className="preview-box">
          {form.type === "image" ? (
            <img src={preview} alt="preview" />
          ) : (
            <video src={preview} controls />
          )}
        </div>
      )}

      {uploading && <p className="uploading">Uploading...</p>}

      {/* ================= FORM ================= */}
      <div className="ads-form">

        <input
          placeholder="Ad Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Redirect URL (optional)"
          value={form.redirectUrl}
          onChange={(e) =>
            setForm({ ...form, redirectUrl: e.target.value })
          }
        />

        {/* POSITIONS */}
        <div className="card full">
          <label>Select Positions</label>

          <div className="chip-container">
            {positionsList.map((pos) => {
              const selected = form.positions.includes(pos);

              return (
                <button
                  key={pos}
                  type="button"
                  className={`chip ${selected ? "active" : ""}`}
                  onClick={() => togglePosition(pos)}
                >
                  {pos.replaceAll("_", " ").toUpperCase()}
                  {selected && " ✔"}
                </button>
              );
            })}
          </div>
        </div>

        <button className="create-btn" onClick={createAd}>
          ➕ Create Ad
        </button>

      </div>

      {/* ================= LIST ================= */}
      <div className="ads-list">

        {ads.length === 0 && (
          <p className="empty">No ads created yet</p>
        )}

        {ads.map((ad) => {
          const impressions = ad.impressions || 0;
          const clicks = ad.clicks || 0;
          const ctr = impressions
            ? ((clicks / impressions) * 100).toFixed(2)
            : 0;

          return (
            <div key={ad._id} className="ad-card">

              <div className="ad-media">
                {ad.type === "image" ? (
                  <img src={ad.mediaUrl || FALLBACK_IMG} alt="ad" />
                ) : (
                  <video src={ad.mediaUrl} controls />
                )}
              </div>

              <div className="ad-info">
                <h4>{ad.title || "No Title"}</h4>

                <p>📍 {ad.positions?.join(", ")}</p>

                {/* 🔥 ANALYTICS */}
                <div className="ad-stats">
                  <span>👁 {impressions}</span>
                  <span>🖱 {clicks}</span>
                  <span>📊 {ctr}% CTR</span>
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteAd(ad._id)}
              >
                ❌ Delete
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Ads;
