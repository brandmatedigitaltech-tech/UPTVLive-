import { useState } from "react";
import API from "../../../services/api";

const AddAd = () => {
  const [form, setForm] = useState({
    title: "",
    mediaUrl: "",
    redirectUrl: "",
    type: "image",
    position: "home_top",
  });

  const submit = async () => {
    try {
      await API.post("/ads", form);
      alert("Ad created ✅");
    } catch {
      alert("Error ❌");
    }
  };

  return (
    <div className="card">
      <h2>Add Advertisement</h2>

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Media URL"
        onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
      />

      <input
        placeholder="Redirect URL"
        onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>

      <select
        onChange={(e) => setForm({ ...form, position: e.target.value })}
      >
        <option value="home_top">Home Top</option>
        <option value="home_middle">Home Middle</option>
        <option value="sidebar">Sidebar</option>
        <option value="article_top">Article Top</option>
        <option value="article_bottom">Article Bottom</option>
      </select>

      <button onClick={submit}>Create Ad</button>
    </div>
  );
};

export default AddAd;