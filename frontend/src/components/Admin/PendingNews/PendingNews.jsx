import {
  useEffect,
  useState,
  useRef,
} from "react";

import API from "../../../services/api";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import "./PendingNews.css";

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
// ================= COMPONENT ==========================
// =====================================================

const PendingNews = () => {

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

  const [approving, setApproving] =
    useState(false);

  const [categoriesList, setCategoriesList] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  // =====================================================
  // ================= EDITOR ============================
  // =====================================================

  const editorRef = useRef(null);

  const quillRef = useRef(null);

  // =====================================================
  // ================= FETCH NEWS ========================
  // =====================================================

  const fetchNews = async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          "/news/pending"
        );

      setNews(
        Array.isArray(
          res.data
        )
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Pending Error:",
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

        console.error(
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

        console.error(
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

    const quill = new Quill(
      editorRef.current,
      {
        theme: "snow",

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

    quillRef.current = quill;

    // ================= SET CONTENT =================

    if (
      previewItem?.content
    ) {
      quill.root.innerHTML =
        previewItem.content;
    }

  }, [editMode, previewItem]);

  // =====================================================
  // ================= TEXT PREVIEW ======================
// =====================================================

  const getTextPreview = (
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
  // ================= OPEN PREVIEW ======================
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
  };

  // =====================================================
  // ================= CLOSE =============================
// =====================================================

  const closeModal = () => {

    setPreviewItem(null);

    setEditMode(false);

    quillRef.current = null;
  };

  // =====================================================
  // ================= UPDATE ============================
// =====================================================

  const updateNews =
    async () => {

      if (!previewItem)
        return;

      try {

        setSaving(true);

        let content =
          previewItem.content;

        // ================= QUILL CONTENT =================

        if (
          quillRef.current
        ) {
          content =
            quillRef.current.root.innerHTML;
        }

        await API.put(
          `/news/${previewItem._id}`,
          {
            title:
              previewItem.title,

            content,

            youtubeUrl:
              previewItem.youtubeUrl ||
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
          "Updated successfully ✅"
        );

        closeModal();

        fetchNews();

      } catch (err) {

        console.error(err);

        alert(
          "Update failed ❌"
        );

      } finally {

        setSaving(false);
      }
    };

  // =====================================================
  // ================= APPROVE ===========================
// =====================================================

  const approveNews =
    async (id) => {

      if (
        !window.confirm(
          "Approve this news?"
        )
      ) {
        return;
      }

      try {

        setApproving(true);

        // ================= SAVE DATA =================

        await API.put(
          `/news/${id}`,
          {
            categories:
              previewItem?.categories ||
              [],

            tags:
              previewItem?.tags ||
              [],

            sections:
              previewItem?.sections ||
              [],
          }
        );

        // ================= APPROVE =================

        await API.put(
          `/news/approve/${id}`
        );

        alert(
          "News approved successfully ✅"
        );

        closeModal();

        fetchNews();

      } catch (err) {

        console.error(err);

        alert(
          "Approval failed ❌"
        );

      } finally {

        setApproving(false);
      }
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

        console.error(err);

        alert(
          "Delete failed ❌"
        );
      }
    };

  // =====================================================
  // ================= UI ================================
// =====================================================

  return (
    <div className="pending-container">

      {/* ================= TITLE ================= */}

      <h2 className="heading">
        Pending News ⏱
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
            No pending news
          </p>
        )}

      {/* ================================================= */}
      {/* ================= NEWS LIST ===================== */}
      {/* ================================================= */}

      <div className="news-list">

        {news.map(
          (item) => (
            <div
              key={item._id}
              className="news-card"
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

                  {getTextPreview(
                    item.content
                  )}

                  ...

                </p>

                {/* ACTIONS */}

                <div className="actions">

                  <button
                    onClick={() =>
                      openPreview(
                        item
                      )
                    }
                  >
                    👁 Preview
                  </button>

                  <button
                    onClick={() =>
                      openPreview(
                        item
                      )
                    }
                  >
                    ✏️ Review
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
              {previewItem.title}
            </h2>

            {/* IMAGE */}

            <img
              src={getImage(
                previewItem
              )}

              alt="preview"

              onError={(e) => {
                e.target.src =
                  FALLBACK_IMG;
              }}
            />

            {/* ================================================= */}
            {/* ================= VIEW MODE ===================== */}
            {/* ================================================= */}

            {!editMode ? (

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    previewItem.content,
                }}
              />

            ) : (

              <div
                ref={editorRef}

                style={{
                  height:
                    "250px",
                }}
              />

            )}

            {/* ================================================= */}
            {/* ================= CATEGORY ====================== */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                Categories
              </label>

              <div className="chip-container">

                {categoriesList.map(
                  (c) => {

                    const selected =
                      previewItem.categories.includes(
                        c.name
                      );

                    return (
                      <button
                        key={c._id}

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
            {/* ================= CITY ========================== */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                City
              </label>

              <div className="chip-container">

                {cities.map(
                  (city) => {

                    const selected =
                      previewItem.tags.includes(
                        city.name
                      );

                    return (
                      <button
                        key={city._id}

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
            {/* ================= SECTION ======================= */}
            {/* ================================================= */}

            <div className="edit-section">

              <label>
                Sections
              </label>

              <div className="chip-container">

                {sectionsList.map(
                  (sec) => {

                    const selected =
                      previewItem.sections.includes(
                        sec
                      );

                    return (
                      <button
                        key={sec}

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
            {/* ================= ACTIONS ======================= */}
            {/* ================================================= */}

            <div className="modal-actions">

              {!editMode ? (
                <>
                  <button
                    onClick={() =>
                      setEditMode(
                        true
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      approveNews(
                        previewItem._id
                      )
                    }

                    disabled={
                      approving
                    }
                  >

                    {approving
                      ? "Approving..."
                      : "✅ Approve"}

                  </button>

                  <button
                    onClick={() =>
                      deleteNews(
                        previewItem._id
                      )
                    }
                  >
                    ❌ Delete
                  </button>
                </>
              ) : (
                <>
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
                    onClick={() =>
                      setEditMode(
                        false
                      )
                    }
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