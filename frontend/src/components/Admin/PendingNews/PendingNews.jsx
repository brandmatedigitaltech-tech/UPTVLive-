import {
  useEffect,
  useState,
  useRef,
} from "react";

import API from "../../../services/api";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import "./PendingNews.css";

// =====================================================
// ================= CONSTANTS ==========================
// =====================================================

const FALLBACK_IMG =
  "/no-image.jpg";

const sectionsList = [
  "hero",
  "breaking",
  "newsgrid",
  "sidebar",
  "special",
];


// =====================================================
// ================= HELPERS ============================
// =====================================================

const getImage = (item) => {

  if (
    Array.isArray(item?.images) &&
    item.images.length > 0
  ) {
    return item.images[0];
  }

  if (
    item?.image &&
    item.image.trim() !== ""
  ) {
    return item.image;
  }

  return FALLBACK_IMG;
};

// ✅ ADD THIS HERE
const cleanHtml = (
  html = ""
) => {

  return html
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
    );
};

const getTextPreview = (
  html = ""
) => {

  return html
    .replace(
      /<[^>]+>/g,
      ""
    )
    .slice(0, 120);
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

  const [saving, setSaving] =
    useState(false);

  const [approving, setApproving] =
    useState(false);

  const [previewItem, setPreviewItem] =
    useState(null);

  const [editMode, setEditMode] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [categoriesList, setCategoriesList] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  // =====================================================
  // ================= QUILL =============================
  // =====================================================

  const editorRef =
    useRef(null);

  const quillRef =
    useRef(null);

  // =====================================================
// ================= IMAGE HANDLER =====================
// =====================================================

const imageHandler = () => {

  const input =
    document.createElement("input");

  input.setAttribute(
    "type",
    "file"
  );

  input.setAttribute(
    "accept",
    "image/*"
  );

  input.click();

  input.onchange = async () => {

    const file =
      input.files[0];

    if (!file) return;

    try {

      const data =
        new FormData();

      data.append(
        "images",
        file
      );

      const res =
        await API.post(
          "/upload/upload-multiple",
          data
        );

      const imageUrl =
        res.data.images?.[0];

      if (!imageUrl) {

        return alert(
          "Image upload failed ❌"
        );
      }

      // ✅ SAVE IMAGE IN STATE

      setPreviewItem((prev) => ({
        ...prev,

        images: [
          ...(prev.images || []),
          imageUrl,
        ],
      }));

      const quill =
        quillRef.current;

      if (!quill) return;

      const range =
        quill.getSelection();

      const index =
        range
          ? range.index
          : quill.getLength();

      // ✅ INSERT IMAGE

      quill.insertEmbed(
        index,
        "image",
        imageUrl
      );

      quill.setSelection(
        index + 1
      );

    } catch (err) {

      console.log(err);

      alert(
        "Image upload failed ❌"
      );
    }
  };
};
  // =====================================================
  // ================= FETCH =============================
  // =====================================================

  const fetchNews =
    async () => {

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

        console.error(err);

      } finally {

        setLoading(false);
      }
    };



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

        console.error(err);
      }
    };

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

        console.error(err);
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
  // ================= ESC CLOSE =========================
  // =====================================================

  useEffect(() => {

    const esc = (e) => {

      if (
        e.key === "Escape"
      ) {
        closeModal();
      }
    };

    window.addEventListener(
      "keydown",
      esc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        esc
      );

  }, []);

  // =====================================================
  // ================= BODY LOCK =========================
  // =====================================================

  useEffect(() => {

    document.body.style.overflow =
      previewItem
        ? "hidden"
        : "auto";

  }, [previewItem]);

  // =====================================================
  // ================= QUILL INIT ========================
  // =====================================================

 useEffect(() => {

  // ✅ ONLY INIT ONCE
  if (
    !editMode ||
    !editorRef.current ||
    quillRef.current
  ) {
    return;
  }

  // ✅ PREVENT DUPLICATE TOOLBARS
if (quillRef.current) {
  return;
}

  const quill =
    new Quill(
      editorRef.current,
      {
        theme: "snow",

        modules: {
  toolbar: {
    container: [

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

    handlers: {
      image: imageHandler,
    },
  },
},
      }
    );

  quillRef.current =
    quill;

  // ✅ SET CONTENT
quill.clipboard.dangerouslyPasteHTML(
  previewItem?.content || ""
);

  // ✅ CLEANUP
  return () => {

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    quillRef.current =
      null;
  };

}, [editMode, previewItem]);


  // =====================================================
  // ================= FILTER ============================
  // =====================================================

  const filteredNews =
    news.filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

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

    mediaLinks:
      Array.isArray(
        item.mediaLinks
      )
        ? item.mediaLinks
        : [],

    relatedArticles:
      Array.isArray(
        item.relatedArticles
      )
        ? item.relatedArticles
        : [],

    searchResults: [],
  });
};

  // =====================================================
  // ================= CLOSE =============================
  // =====================================================

  const closeModal =
    () => {

      setPreviewItem(
        null
      );

      setEditMode(false);

      quillRef.current =
        null;
    };

  // =====================================================
  // ================= UPDATE ============================
  // =====================================================

  const updateNews =
    async () => {

      if (
        !previewItem
      ) {
        return;
      }

      try {

        setSaving(true);

        const content =
          quillRef.current
            ? cleanHtml(
                quillRef.current.root.innerHTML
              )
            : previewItem.content;

        await API.put(
          `/news/${previewItem._id}`,
          {
            title:
              previewItem.title,

            content,

            categories:
              previewItem.categories || [],

            tags:
              previewItem.tags || [],

            sections:
              previewItem.sections || [],

            mediaLinks:
              previewItem.mediaLinks || [],

            relatedArticles:
              previewItem.relatedArticles || [],

            images:
              previewItem.images || [],
          }
        );

      

        alert(
          "Updated successfully ✅"
        );
        setPreviewItem((prev) => ({
  ...prev,
  content,
}));

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

        const content =
          quillRef.current
            ? cleanHtml(
                quillRef.current.root.innerHTML
              )
            : previewItem.content;

setPreviewItem((prev) => ({
  ...prev,
  content,
}));

await API.put(
  `/news/${id}`,
  {
    title:
      previewItem.title,

    content,

    categories:
      previewItem.categories || [],

    tags:
      previewItem.tags || [],

    sections:
      previewItem.sections || [],

    mediaLinks:
      previewItem.mediaLinks || [],

    relatedArticles:
      previewItem.relatedArticles || [],

    images:
      previewItem.images || [],
  }
);

await API.put(
  `/news/approve/${id}`
);

alert(
  "Approved successfully ✅"
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
  // ================= RETURN ============================
  // =====================================================

  return (

    <div className="pending-container">

      {/* HEADER */}

      <div className="pending-header">

        <h2 className="heading">
          Pending News ⏱
        </h2>

        <input
          type="text"

          className="search-input"

          placeholder="Search pending news..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>

      {/* LOADING */}

      {loading && (
        <p className="loading">
          Loading...
        </p>
      )}

      {/* EMPTY */}

      {!loading &&
        filteredNews.length === 0 && (
          <p className="empty">
            No pending news
          </p>
        )}

      {/* NEWS */}

      <div className="news-list">

        {filteredNews.map(
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

                  onError={(e) => {
                    e.target.src =
                      FALLBACK_IMG;
                  }}
                />

              </div>

              {/* CONTENT */}

              <div className="news-content">

                <div className="top-row">

                  <h3>
                    {item.title}
                  </h3>
                  <p className="news-author">
  ✍️ By {item.author || "UPTV Live"}
</p>

                  <span className="status-badge">
                    Pending
                  </span>

                </div>

                <p className="news-date">

                  {new Date(
                    item.createdAt
                  ).toLocaleString()}

                </p>

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
                    onClick={() => {

                      openPreview(
                        item
                      );

                      setEditMode(
                        true
                      );
                    }}
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

      {/* MODAL */}

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

            <input
              className="modal-title-input"

              value={
                previewItem.title
              }

              onChange={(e) =>
                setPreviewItem({
                  ...previewItem,

                  title:
                    e.target.value,
                })
              }
            />

            {/* IMAGE */}

            <img
              src={getImage(
                previewItem
              )}

              alt="preview"

              className="preview-image"

              onError={(e) => {
                e.target.src =
                  FALLBACK_IMG;
              }}
            />

            {/* CONTENT */}

            {!editMode ? (

              <div
                className="preview-content"

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
                    "300px",
                }}
              />

            )}

            {/* CATEGORY */}

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

            {/* CITY */}

            <div className="edit-section">

              <label>
                Cities
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

            {/* SECTION */}

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

            {/* MEDIA LINKS */}

            <div className="edit-section">

              <label>
                Media Links
              </label>

              {previewItem.mediaLinks.map(
                (
                  link,
                  index
                ) => (

                  <input
                    key={index}

                    className="input"

                    value={link}

                    placeholder="Paste media link"

                    onChange={(e) => {

                      const updated =
                        [
                          ...previewItem.mediaLinks,
                        ];

                      updated[index] =
                        e.target.value;

                      setPreviewItem({
                        ...previewItem,

                        mediaLinks:
                          updated,
                      });
                    }}
                  />
                )
              )}

              <button
                className="add-btn"

                onClick={() =>
                  setPreviewItem({
                    ...previewItem,

                    mediaLinks: [
                      ...previewItem.mediaLinks,
                      "",
                    ],
                  })
                }
              >
                + Add Link
              </button>

            </div>
{/* ===================================================== */}
{/* ================= RELATED NEWS ====================== */}
{/* ===================================================== */}

{/* ===================================================== */}
{/* ================= RELATED NEWS ====================== */}
{/* ===================================================== */}


            {/* ACTIONS */}

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