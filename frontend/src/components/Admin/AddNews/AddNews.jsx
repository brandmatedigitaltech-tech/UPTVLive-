import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./AddNews.css";

const cities = [
  "कानपुर","लखनऊ","अयोध्या","आगरा",
  "वाराणसी","गोरखपुर","प्रयागराज","गाज़ियाबाद",
];

const sectionsList = ["hero", "breaking", "newsgrid", "sidebar", "special"];

const AddNews = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    categories: [],
    tags: [],
    sections: [],
    youtubeUrl: "",
    images: [],
  });

  const [categoriesList, setCategoriesList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // ================= INIT =================
  useEffect(() => {
    fetchMeta();

    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write news content...",
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

      quillRef.current.on("text-change", () => {
        let html = quillRef.current.root.innerHTML;

        html = html
          .replace(/<span class="ql-ui".*?<\/span>/g, "")
          .replace(/contenteditable="false"/g, "")
          .replace(/data-list="[^"]*"/g, "")
          .replace(/class="ql-[^"]*"/g, "")
          .replace(/style="[^"]*"/g, "")
          .replace(/<p><br><\/p>/g, "");

        setForm((prev) => ({
          ...prev,
          content: html,
        }));
      });
    }
  }, []);

  // ================= FETCH META =================
  const fetchMeta = async () => {
    try {
      const res = await API.get("/meta/categories");
      setCategoriesList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SUBMIT =================
  const submit = async () => {
    if (!form.title || !form.content) {
      return alert("Title & Content required ❌");
    }

    try {
      setLoading(true);

      await API.post("/news", form);

      alert("Submitted for approval ✅");

      setForm({
        title: "",
        content: "",
        categories: [],
        tags: [],
        sections: [],
        youtubeUrl: "",
        images: [],
      });

      setPreview([]);
      setImageFiles([]);

      if (quillRef.current) {
        quillRef.current.setText("");
      }

    } catch {
      alert("Submit failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE =================
  const handleFile = (files) => {
    const fileArray = Array.from(files);

    setImageFiles(fileArray);

    const previewUrls = fileArray.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview(previewUrls);
  };

  // 🔥 FIXED
  const handleChange = (e) => handleFile(e.target.files);

  // 🔥 FIXED DRAG
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
      setLoading(true);

      const data = new FormData();

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const res = await API.post("/upload/upload-multiple", data);

      setForm((prev) => ({
        ...prev,
        images: res.data.images,
      }));

      alert("Images uploaded ✅");

    } catch {
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= TAG =================
  const addTag = () => {
    if (!tagInput.trim()) return;

    const newTag = tagInput.trim();

    if (form.tags.includes(newTag)) return;

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));

    setTagInput("");
  };

  const removeItem = (type, index) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="cms-container">

      <div className="cms-header">
        <h2>📰 Create News</h2>
        <p>Professional News CMS Editor</p>
      </div>

      <div className="cms-grid">

        {/* LEFT */}
        <div className="cms-left">

          <div className="card">
            <label>Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className="card">
            <label>Content</label>
            <div className="editor" ref={editorRef}></div>
          </div>

          {/* CATEGORY */}
          <div className="card">
            <label>Categories</label>
            <div className="chip-container">
              {categoriesList.map((c) => {
                const selected = form.categories.includes(c.name);
                return (
                  <button
                    key={c._id}
                    className={`chip ${selected ? "active" : ""}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        categories: selected
                          ? form.categories.filter((x) => x !== c.name)
                          : [...form.categories, c.name],
                      })
                    }
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CITY */}
          <div className="card">
            <label>City</label>
            <div className="chip-container">
              {cities.map((city) => {
                const selected = form.tags.includes(city);
                return (
                  <button
                    key={city}
                    className={`chip ${selected ? "active" : ""}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        tags: selected
                          ? form.tags.filter((t) => t !== city)
                          : [...form.tags, city],
                      })
                    }
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTIONS */}
          <div className="card">
            <label>Show in Sections</label>
            <div className="chip-container">
              {sectionsList.map((sec) => {
                const selected = form.sections.includes(sec);
                return (
                  <button
                    key={sec}
                    className={`chip ${selected ? "active" : ""}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        sections: selected
                          ? form.sections.filter((s) => s !== sec)
                          : [...form.sections, sec],
                      })
                    }
                  >
                    {sec.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="cms-right">

          <div className="card">
            <label>YouTube Video Link</label>
            <input
              className="input"
              value={form.youtubeUrl}
              onChange={(e) =>
                setForm({ ...form, youtubeUrl: e.target.value })
              }
            />
          </div>

          <div className="card">
            <label>Upload Images</label>

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
                    <img key={i} src={img} className="preview-img" />
                  ))}
                </div>
              )}
            </div>

            <button className="upload-btn" onClick={uploadImage}>
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          </div>

          <button className="submit-btn" onClick={submit}>
            {loading ? "Publishing..." : "🚀 Publish News"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddNews;