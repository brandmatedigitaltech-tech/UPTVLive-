import {
  useEffect,
  useState,
  useRef,
} from "react";

import API from "../../../services/api";

import {
  useNavigate,
} from "react-router-dom";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import "./ApprovedNews.css";

const FALLBACK_IMG =
  "/no-image.jpg";

// =====================================================
// ================= STATIC SECTION =====================
// =====================================================

const sectionsList = [
  "hero",
  "breaking",
  "newsgrid",
  "sidebar",
  "special",
];

// =====================================================
// ================= IMAGE HELPER =======================
// =====================================================

const getImage = (item) => {

  if (
    Array.isArray(item.images) &&
    item.images.length > 0
  ) {
    return item.images[0];
  }

  if (
    item.image &&
    item.image.trim() !== ""
  ) {
    return item.image;
  }

  return FALLBACK_IMG;
};

// =====================================================
// ================= YOUTUBE ============================
// =====================================================

const getYouTubeEmbed = (
  url
) => {

  if (!url)
    return null;

  const regExp =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;

  const match =
    url.match(regExp);

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
};

// =====================================================
// ================= COMPONENT ==========================
// =====================================================

const ApprovedNews = () => {

  // =====================================================
  // ================= STATES ============================
  // =====================================================

  const [news, setNews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [previewItem, setPreviewItem] =
    useState(null);

  const [editMode, setEditMode] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

const [mediaLinks, setMediaLinks] =
  useState([""]);

  const [categoriesList, setCategoriesList] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  // =====================================================
  // ================= IMAGE =============================
  // =====================================================

  const [imageFiles, setImageFiles] =
    useState([]);

  const [preview, setPreview] =
    useState([]);

  const [dragActive, setDragActive] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  // =====================================================
  // ================= EDITOR ============================
  // =====================================================

  const editorRef =
    useRef(null);

  const quillRef =
    useRef(null);

  const navigate =
    useNavigate();

  // =====================================================
  // ================= FETCH NEWS ========================
  // =====================================================

  const fetchNews = async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          "/news"
        );

      setNews(
        Array.isArray(
          res.data
        )
          ? res.data
          : []
      );

    } catch (err) {

      console.log(
        "Approved Error:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // ================= FETCH CATEGORY ====================
// =====================================================

  const fetchCategories =
    async () => {

      try {

        const res =
          await API.get(
            "/meta/categories"
          );

        setCategoriesList(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );

      } catch (err) {

        console.log(
          "Category Error:",
          err
        );
      }
    };

  // =====================================================
  // ================= FETCH CITIES ======================
// =====================================================

  const fetchCities =
    async () => {

      try {

        const res =
          await API.get(
            "/meta/cities"
          );

        setCities(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );

      } catch (err) {

        console.log(
          "City Error:",
          err
        );
      }
    };

  // =====================================================
  // ================= INIT ==============================
// =====================================================

  useEffect(() => {

    fetchNews();

    fetchCategories();

    fetchCities();

  }, []);

  // =====================================================
  // ================= QUILL =============================
// =====================================================

  useEffect(() => {

    if (
      !editMode ||
      !editorRef.current
    ) {
      return;
    }

    editorRef.current.innerHTML =
      "";

    quillRef.current = null;

    const quill =
      new Quill(
        editorRef.current,
        {
          theme: "snow",

          placeholder:
            "Edit news content...",

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

    quillRef.current =
      quill;

    if (
      previewItem?.content
    ) {
      quill.root.innerHTML =
        previewItem.content;
    }

  }, [
    editMode,
    previewItem,
  ]);

  // =====================================================
  // ================= CLEAN HTML ========================
// =====================================================

  const cleanHtml = (
    html
  ) => {

    if (!html)
      return "";

    return html
      .replace(
        /<[^>]+>/g,
        ""
      )
      .slice(0, 120);
  };

  // =====================================================
  // ================= OPEN ==============================
// =====================================================

  const openPreview = (
    item
  ) => {

    setPreviewItem({
      ...item,

      categories:
        Array.isArray(
          item.categories
        )
          ? item.categories
          : [],

      tags:
        Array.isArray(
          item.tags
        )
          ? item.tags
          : [],

      sections:
        Array.isArray(
          item.sections
        )
          ? item.sections
          : [],
    });

setMediaLinks(
  item.mediaLinks?.length
    ? item.mediaLinks
    : [""]
);

    setPreview(
      (
        item.images || []
      ).map((img) => ({
        url: img,
      }))
    );

    setEditMode(true);
  };

  // =====================================================
  // ================= CLOSE =============================
// =====================================================

  const closeModal = () => {

    preview.forEach(
      (img) => {

        if (
          img.url?.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            img.url
          );
        }
      }
    );

    setPreview([]);

    setImageFiles([]);

    setPreviewItem(null);

    setEditMode(false);

    quillRef.current =
      null;
  };

  // =====================================================
  // ================= DELETE ============================
// =====================================================

  const deleteNews =
    async (id) => {

      if (
        !window.confirm(
          "Delete this news?"
        )
      ) {
        return;
      }

      try {

        await API.delete(
          `/news/${id}`
        );

        alert(
          "Deleted ❌"
        );

        closeModal();

        fetchNews();

      } catch (err) {

        console.log(err);

        alert(
          "Delete failed ❌"
        );
      }
    };

  // =====================================================
  // ================= UPDATE ============================
// =====================================================

  const updateNews =
    async () => {

      if (
        !quillRef.current
      ) {
        return alert(
          "Editor not ready ❌"
        );
      }

      const content =
        quillRef.current.root.innerHTML;

      try {

        setSaving(true);

        await API.put(
          `/news/${previewItem._id}`,
          {
            title:
              previewItem.title,

            content,

            mediaLinks,

            images:
              previewItem.images ||
              [],

            image:
              previewItem.images?.[0] ||
              "",

            categories:
              previewItem.categories ||
              [],

            tags:
              previewItem.tags ||
              [],

            sections:
              previewItem.sections ||
              [],
          }
        );

        alert(
          "Updated ✅"
        );

        closeModal();

        fetchNews();

      } catch (err) {

        console.log(err);

        alert(
          "Update failed ❌"
        );

      } finally {

        setSaving(false);
      }
    };

  // =====================================================
  // ================= FILE ==============================
// =====================================================

  const handleFile = (
    files
  ) => {

    const fileArray =
      Array.from(files);

    setImageFiles(
      fileArray
    );

    const previewUrls =
      fileArray.map(
        (file) => ({
          file,

          url:
            URL.createObjectURL(
              file
            ),
        })
      );

    setPreview(
      previewUrls
    );
  };

  const handleChange = (
    e
  ) => {

    handleFile(
      e.target.files
    );
  };

  // =====================================================
  // ================= DRAG ==============================
// =====================================================

  const handleDrag = (
    e
  ) => {

    e.preventDefault();

    e.stopPropagation();

    setDragActive(
      e.type ===
        "dragenter" ||
        e.type ===
          "dragover"
    );
  };

  // =====================================================
  // ================= DROP ==============================
// =====================================================

  const handleDrop = (
    e
  ) => {

    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    if (
      e.dataTransfer
        .files &&
      e.dataTransfer.files
        .length > 0
    ) {
      handleFile(
        e.dataTransfer
          .files
      );
    }
  };

  // =====================================================
  // ================= UPLOAD ============================
// =====================================================

  const uploadImage =
    async () => {

      if (
        !imageFiles.length
      ) {
        return alert(
          "Select images ❌"
        );
      }

      try {

        setUploading(
          true
        );

        const data =
          new FormData();

        imageFiles.forEach(
          (file) => {
            data.append(
              "images",
              file
            );
          }
        );

        const res =
          await API.post(
            "/upload/upload-multiple",
            data
          );

        setPreviewItem(
          (prev) => ({
            ...prev,

            images:
              res.data
                .images,

            image:
              res.data
                .images[0],
          })
        );

        setPreview(
          res.data.images.map(
            (img) => ({
              url: img,
            })
          )
        );

        alert(
          "Images uploaded ✅"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Upload failed ❌"
        );

      } finally {

        setUploading(
          false
        );
      }
    };

  // =====================================================
  // ================= UI ================================
// =====================================================

  return (
    <div className="approved-container">

      {/* ================= TITLE ================= */}

      <h2 className="heading">
        Approved News ✅
      </h2>

      {/* ================= LOADING ================= */}

      {loading && (
        <p className="loading">
          Loading...
        </p>
      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        news.length ===
          0 && (
          <p className="empty">
            No approved news
          </p>
        )}

      {/* ================================================= */}
      {/* ================= LIST ========================== */}
      {/* ================================================= */}

      <div className="news-list">

        {news.map(
          (item) => (
            <div
              key={item._id}

              className="news-card"

              onClick={() =>
                navigate(
                  `/article/${
                    item.slug ||
                    item._id
                  }`
                )
              }
            >

              {/* IMAGE */}

              <div className="image-box">

                <img
                  src={getImage(
                    item
                  )}

                  alt="news"

                  loading="lazy"

                  onError={(
                    e
                  ) => {
                    e.target.src =
                      FALLBACK_IMG;
                  }}
                />

              </div>

              {/* CONTENT */}

              <div className="news-content">

                <h3>
                  {item.title}
                </h3>

                <p>

                  {cleanHtml(
                    item.content
                  )}

                  ...

                </p>

                {/* TAGS */}

                <div className="tags">

                  {item.categories?.map(
                    (
                      cat,
                      i
                    ) => (
                      <span
                        key={i}
                      >
                        #{cat}
                      </span>
                    )
                  )}

                </div>

                {/* ACTIONS */}

                <div
                  className="actions"

                  onClick={(
                    e
                  ) =>
                    e.stopPropagation()
                  }
                >

                  <button
                    onClick={() =>
                      openPreview(
                        item
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteNews(
                        item._id
                      )
                    }
                  >
                    ❌ Delete
                  </button>

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* ================================================= */}
      {/* ================= MODAL ========================= */}
      {/* ================================================= */}

      {previewItem && (
        <div className="preview-modal">

          <div className="preview-box">

            {/* CLOSE */}

            <button
              className="close-btn"

              onClick={
                closeModal
              }
            >
              ✖
            </button>

            {/* TITLE */}

            <h2>
              {
                previewItem.title
              }
            </h2>

            {/* IMAGE */}

            <img
              src={getImage(
                previewItem
              )}

              alt="preview"

              className="main-preview-img"
            />

            {/* ================================================= */}
            {/* ================= YOUTUBE ====================== */}
            {/* ================================================= */}

            <div className="edit-section">

  <label>
    Media / Social Links
  </label>

  {
    mediaLinks.map(
      (link, index) => (

        <input
          key={index}

          className="input"

          placeholder="Paste Instagram / Facebook / YouTube / Website Link"

          value={link}

          onChange={(e) => {

            const updated =
              [...mediaLinks];

            updated[index] =
              e.target.value;

            setMediaLinks(
              updated
            );
          }}
        />
      )
    )
  }

  <button
    className="upload-btn"

    type="button"

    onClick={() => {

      setMediaLinks([
        ...mediaLinks,
        "",
      ]);
    }}
  >
    + Add More Link
  </button>

</div>

            {/* YOUTUBE PREVIEW */}

{/* YOUTUBE PREVIEW */}

{getYouTubeEmbed(
  youtubeUrl
) && (
  <iframe
    src={getYouTubeEmbed(
      youtubeUrl
    )}

    title="YouTube"

    width="100%"

    height="250"

    allowFullScreen

    style={{
      borderRadius:
        "10px",

      marginTop:
        "10px",
    }}
  />
)}

            {/* ================================================= */}
            {/* ================= IMAGE ======================== */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                Update Thumbnail /
                Images
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

                onDrop={
                  handleDrop
                }
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

                          src={
                            img.url ||
                            img
                          }

                          className="preview-img"

                          alt="preview"
                        />
                      )
                    )}

                  </div>
                )}

              </div>

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

            {/* ================================================= */}
            {/* ================= EDITOR ======================= */}
            {/* ================================================= */}

            <div
              ref={editorRef}

              style={{
                height:
                  "250px",

                marginTop:
                  "15px",
              }}
            />

            {/* ================================================= */}
            {/* ================= CATEGORY ===================== */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                Categories
              </label>

              <div className="chip-container">

                {categoriesList.map(
                  (
                    c
                  ) => {

                    const selected =
                      previewItem.categories.includes(
                        c.name
                      );

                    return (
                      <button
                        key={
                          c._id
                        }

                        className={`chip ${
                          selected
                            ? "active"
                            : ""
                        }`}

                        onClick={() =>
                          setPreviewItem(
                            (
                              prev
                            ) => ({
                              ...prev,

                              categories:
                                selected
                                  ? prev.categories.filter(
                                      (
                                        x
                                      ) =>
                                        x !==
                                        c.name
                                    )
                                  : [
                                      ...prev.categories,
                                      c.name,
                                    ],
                            })
                          )
                        }
                      >

                        {c.name}

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= CITY ========================= */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                City
              </label>

              <div className="chip-container">

                {cities.map(
                  (
                    city
                  ) => {

                    const selected =
                      previewItem.tags.includes(
                        city.name
                      );

                    return (
                      <button
                        key={
                          city._id
                        }

                        className={`chip ${
                          selected
                            ? "active"
                            : ""
                        }`}

                        onClick={() =>
                          setPreviewItem(
                            (
                              prev
                            ) => ({
                              ...prev,

                              tags:
                                selected
                                  ? prev.tags.filter(
                                      (
                                        t
                                      ) =>
                                        t !==
                                        city.name
                                    )
                                  : [
                                      ...prev.tags,
                                      city.name,
                                    ],
                            })
                          )
                        }
                      >

                        {city.name}

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= SECTIONS ===================== */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                Sections
              </label>

              <div className="chip-container">

                {sectionsList.map(
                  (
                    sec
                  ) => {

                    const selected =
                      previewItem.sections.includes(
                        sec
                      );

                    return (
                      <button
                        key={
                          sec
                        }

                        className={`chip ${
                          selected
                            ? "active"
                            : ""
                        }`}

                        onClick={() =>
                          setPreviewItem(
                            (
                              prev
                            ) => ({
                              ...prev,

                              sections:
                                selected
                                  ? prev.sections.filter(
                                      (
                                        s
                                      ) =>
                                        s !==
                                        sec
                                    )
                                  : [
                                      ...prev.sections,
                                      sec,
                                    ],
                            })
                          )
                        }
                      >

                        {sec.toUpperCase()}

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= ACTIONS ====================== */}
            {/* ================================================= */}

            <div className="modal-actions">

              <button
                onClick={
                  updateNews
                }

                disabled={
                  saving
                }
              >

                {saving
                  ? "Saving..."
                  : "💾 Save"}

              </button>

              <button
                onClick={
                  closeModal
                }
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