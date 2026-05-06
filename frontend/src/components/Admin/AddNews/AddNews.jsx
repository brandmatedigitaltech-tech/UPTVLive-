import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../../../services/api";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import "./AddNews.css";

// =====================================================
// ================= COMPONENT =========================
// =====================================================

const AddNews = () => {
  const navigate = useNavigate();

  // =====================================================
  // ================= FORM ==============================
  // =====================================================

  const [form, setForm] = useState({
    title: "",
    content: "",
    youtubeUrl: "",
    images: [],
  });

  // =====================================================
  // ================= STATES ============================
  // =====================================================

  const [imageFiles, setImageFiles] =
    useState([]);

  const [preview, setPreview] =
    useState([]);

  const [dragActive, setDragActive] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  // =====================================================
  // ================= EDITOR ============================
  // =====================================================

  const editorRef = useRef(null);

  const quillRef = useRef(null);

  // =====================================================
  // ================= QUILL INIT ========================
  // =====================================================

  useEffect(() => {
    if (
      editorRef.current &&
      !quillRef.current
    ) {
      quillRef.current = new Quill(
        editorRef.current,
        {
          theme: "snow",

          placeholder:
            "Write news content...",

          modules: {
            toolbar: [
              [
                {
                  header: [
                    1,
                    2,
                    3,
                    false,
                  ],
                },
              ],

              [
                "bold",
                "italic",
                "underline",
              ],

              [
                {
                  list: "ordered",
                },

                {
                  list: "bullet",
                },
              ],

              [
                "image",
                "link",
              ],

              ["clean"],
            ],
          },
        }
      );

      // ================= CONTENT CHANGE =================

      quillRef.current.on(
        "text-change",
        () => {
          let html =
            quillRef.current.root.innerHTML;

          // ✅ CLEAN QUILL GARBAGE
          html = html
            .replace(
              /<span class="ql-ui".*?<\/span>/g,
              ""
            )

            .replace(
              /contenteditable="false"/g,
              ""
            )

            .replace(
              /data-list="[^"]*"/g,
              ""
            )

            .replace(
              /class="ql-[^"]*"/g,
              ""
            )

            .replace(
              /style="[^"]*"/g,
              ""
            )

            .replace(
              /<p><br><\/p>/g,
              ""
            );

          setForm((prev) => ({
            ...prev,
            content: html,
          }));
        }
      );
    }

    // ================= CLEANUP =================

    return () => {
      preview.forEach((img) => {
        if (
          typeof img === "string" &&
          img.startsWith("blob:")
        ) {
          URL.revokeObjectURL(img);
        }
      });
    };

  }, []);

  // =====================================================
  // ================= IMAGE =============================
  // =====================================================

  const handleFile = (files) => {
    const fileArray =
      Array.from(files);

    setImageFiles(fileArray);

    // ✅ REMOVE OLD BLOBS
    preview.forEach((img) => {
      if (
        typeof img === "string" &&
        img.startsWith("blob:")
      ) {
        URL.revokeObjectURL(img);
      }
    });

    // ✅ CREATE PREVIEW
    const previewUrls =
      fileArray.map((file) =>
        URL.createObjectURL(file)
      );

    setPreview(previewUrls);
  };

  const handleChange = (e) => {
    handleFile(e.target.files);
  };

  // =====================================================
  // ================= DRAG ==============================
  // =====================================================

  const handleDrag = (e) => {
    e.preventDefault();

    e.stopPropagation();

    setDragActive(
      e.type === "dragenter" ||
      e.type === "dragover"
    );
  };

  // =====================================================
  // ================= DROP ==============================
  // =====================================================

  const handleDrop = (e) => {
    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      handleFile(
        e.dataTransfer.files
      );
    }
  };

  // =====================================================
  // ================= UPLOAD ============================
  // =====================================================

  const uploadImage = async () => {
    if (!imageFiles.length) {
      return alert(
        "Select images first ❌"
      );
    }

    try {
      setUploading(true);

      const data = new FormData();

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const res = await API.post(
        "/upload/upload-multiple",
        data
      );

      setForm((prev) => ({
        ...prev,
        images:
          res.data.images || [],
      }));

      alert(
        "Images uploaded successfully ✅"
      );

    } catch (err) {
      console.error(err);

      alert("Upload failed ❌");

    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // ================= RESET =============================
  // =====================================================

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      youtubeUrl: "",
      images: [],
    });

    setImageFiles([]);

    preview.forEach((img) => {
      if (
        typeof img === "string" &&
        img.startsWith("blob:")
      ) {
        URL.revokeObjectURL(img);
      }
    });

    setPreview([]);

    // ✅ RESET EDITOR
    if (quillRef.current) {
      quillRef.current.setText("");
    }
  };

  // =====================================================
  // ================= SUBMIT ============================
  // =====================================================

  const submit = async () => {
    // ✅ TITLE VALIDATION
    if (
      !form.title ||
      form.title.trim() === ""
    ) {
      return alert(
        "Title is required ❌"
      );
    }

    // ✅ CONTENT VALIDATION
    if (
      !form.content ||
      form.content.trim() === ""
    ) {
      return alert(
        "Content is required ❌"
      );
    }

    try {
      setLoading(true);

      // ✅ SUBMIT
      await API.post(
        "/news",
        form
      );

      alert(
        "News submitted for approval ✅"
      );

      // ✅ RESET
      resetForm();

      // ✅ REDIRECT TO DASHBOARD
      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      alert("Submit failed ❌");

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ================= RENDER ============================
  // =====================================================

  return (
    <div className="cms-container">

      {/* HEADER */}
      <div className="cms-header">
        <h2>
          📰 Create News
        </h2>

        <p>
          Professional News CMS Editor
        </p>
      </div>

      {/* GRID */}
      <div className="cms-grid">

        {/* ================================================= */}
        {/* ================= LEFT ========================== */}
        {/* ================================================= */}

        <div className="cms-left">

          {/* TITLE */}
          <div className="card">
            <label>
              News Title
            </label>

            <input
              className="input"

              placeholder="Enter news title..."

              value={form.title}

              onChange={(e) =>
                setForm({
                  ...form,

                  title:
                    e.target.value,
                })
              }
            />
          </div>

          {/* CONTENT */}
          <div className="card">
            <label>
              News Content
            </label>

            <div
              className="editor"
              ref={editorRef}
            />
          </div>

        </div>

        {/* ================================================= */}
        {/* ================= RIGHT ========================= */}
        {/* ================================================= */}

        <div className="cms-right">

          {/* YOUTUBE */}
          <div className="card">
            <label>
              YouTube Video Link
            </label>

            <input
              className="input"

              placeholder="https://youtube.com/..."

              value={
                form.youtubeUrl
              }

              onChange={(e) =>
                setForm({
                  ...form,

                  youtubeUrl:
                    e.target.value,
                })
              }
            />
          </div>

          {/* IMAGE */}
          <div className="card">

            <label>
              Upload Images
            </label>

            <div
              className={`drop-zone ${
                dragActive
                  ? "active"
                  : ""
              }`}

              onDragEnter={
                handleDrag
              }

              onDragOver={
                handleDrag
              }

              onDragLeave={
                handleDrag
              }

              onDrop={handleDrop}
            >
              <input
                type="file"

                multiple

                onChange={
                  handleChange
                }
              />

              {preview.length ===
              0 ? (
                <p>
                  Drag & Drop or
                  Click
                </p>
              ) : (
                <div>
                  {preview.map(
                    (
                      img,
                      i
                    ) => (
                      <img
                        key={i}

                        src={img}

                        className="preview-img"

                        alt="preview"
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              className="upload-btn"

              onClick={
                uploadImage
              }

              disabled={
                uploading
              }
            >
              {uploading
                ? "Uploading..."
                : "Upload Images"}
            </button>

          </div>

          {/* SUBMIT */}
          <button
            className="submit-btn"

            onClick={submit}

            disabled={
              loading ||
              uploading
            }
          >
            {loading
              ? "Publishing..."
              : "🚀 Publish News"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddNews;