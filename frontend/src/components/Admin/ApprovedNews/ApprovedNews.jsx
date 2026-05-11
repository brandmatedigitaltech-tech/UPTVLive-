import {
  FaWhatsapp,
  FaFacebookF,
  FaTelegramPlane,
  
  FaCopy,
} from "react-icons/fa";

import {
  FaXTwitter,
} from "react-icons/fa6";

import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

import API from "../../../services/api";

import {
  useNavigate,
} from "react-router-dom";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import "./ApprovedNews.css";

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

const cleanPreview = (
  html = ""
) => {

  return html
    .replace(
      /<[^>]+>/g,
      ""
    )
    .slice(0, 150);
};

const cleanEditorHtml = (
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
    )

    .replace(
      /style="[^"]*"/g,
      ""
    );
};

const getEmbedLink = (
  url
) => {

  if (!url) {
    return null;
  }

  // YOUTUBE

  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {

    const regExp =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;

    const match =
      url.match(regExp);

    return match
      ? `https://www.youtube.com/embed/${match[1]}`
      : null;
  }

  


  // FACEBOOK

  if (
    url.includes("facebook.com")
  ) {

    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
      url
    )}&show_text=true&width=500`;
  }

  return null;
};

// =====================================================
// ================= COMPONENT ==========================
// =====================================================

const ApprovedNews = () => {

  const navigate =
    useNavigate();

  // =====================================================
  // ================= STATES ============================
  // =====================================================

  const [news, setNews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [previewItem, setPreviewItem] =
    useState(null);

  const [categoriesList, setCategoriesList] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [mediaLinks, setMediaLinks] =
    useState([""]);

  const [imageFiles, setImageFiles] =
    useState([]);

  const [preview, setPreview] =
    useState([]);

  const [dragActive, setDragActive] =
    useState(false);

  // =====================================================
  // ================= EDITOR ============================
  // =====================================================

  const editorRef =
    useRef(null);

  const quillRef =
    useRef(null);

    const imageHandler = () => {

  const input =
    document.createElement(
      "input"
    );

  input.setAttribute(
    "type",
    "file"
  );

  input.setAttribute(
    "accept",
    "image/*"
  );

  input.click();

  input.onchange =
    async () => {

      const file =
        input.files[0];

      if (!file) return;

      try {

        setUploading(true);

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

        const quill =
          quillRef.current;
          if (!quill) return;

const range =
  quill.getSelection(true);

        const index =
          range
            ? range.index
            : quill.getLength();

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
          "Upload failed ❌"
        );

      } finally {

        setUploading(false);
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

        console.log(err);

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

        console.log(err);
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

        console.log(err);
      }
    };
useEffect(() => {

  document.body.style.overflow =
    previewItem
      ? "hidden"
      : "auto";

  return () => {

    document.body.style.overflow =
      "auto";
  };

}, [previewItem]);
  // =====================================================
  // ================= INIT ==============================
  // =====================================================

  useEffect(() => {

    fetchNews();

    fetchCategories();

    fetchCities();

  }, []);
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
  // ================= QUILL =============================
  // =====================================================

  useEffect(() => {

  // ✅ ONLY CREATE ONCE
  if (
    !previewItem ||
    !editorRef.current ||
    quillRef.current
  ) {
    return;
  }

  // ✅ PREVENT DUPLICATE TOOLBAR
  if (
    editorRef.current.querySelector(".ql-toolbar")
  ) {
    return;
  }
  

  const quill =
    new Quill(
      editorRef.current,
      {
        theme: "snow",

        placeholder:
          "Edit article content...",

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

  // ✅ LOAD CONTENT
  quill.root.innerHTML =
    previewItem.content || "";

  // ✅ CLEANUP
  return () => {

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    quillRef.current =
      null;
  };

}, [previewItem?._id]);


  // =====================================================
  // ================= FILTER ============================
  // =====================================================

const filteredNews =
  useMemo(() => {

    return news.filter(
      (item) =>
        item.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  }, [news, search]);
  // =====================================================
  // ================= OPEN ==============================
  // =====================================================

const openPreview = (
  item
) => {

  setPreviewItem({
    ...item,

    categories:
      item.categories || [],

    tags:
      item.tags || [],

    sections:
      item.sections || [],

    relatedArticles:
      item.relatedArticles || [],

    searchResults: [],
  });

  setMediaLinks(
    item.mediaLinks?.length
      ? item.mediaLinks
      : [""]
  );

  // ✅ SHOW EXISTING IMAGES
  setPreview(
    (item.images || []).map(
      (img) => ({
        url: img,
      })
    )
  );
};


  // =====================================================
  // ================= CLOSE =============================
  // =====================================================

const closeModal =
  () => {

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
setDragActive(false);
    setMediaLinks([""]);

    setPreviewItem(null);

    quillRef.current =
      null;
  };

  // =====================================================
  // ================= UPDATE ============================
  // =====================================================

  const updateNews =
    async () => {

      try {

        setSaving(true);

const content =
  quillRef.current
    ? cleanEditorHtml(
        quillRef.current.root.innerHTML
      )
    : previewItem.content;

        await API.put(
          `/news/${previewItem._id}`,
          {
            title:
              previewItem.title,

            content,

            mediaLinks:
              mediaLinks
                .map((l) =>
                  l.trim()
                )
                .filter(Boolean),

            images:
              previewItem.images || [],

            image:
              previewItem.images?.[0] || "",

            categories:
              previewItem.categories || [],

            tags:
              previewItem.tags || [],

            sections:
              previewItem.sections || [],

            relatedArticles:
              previewItem.relatedArticles || [],
          }
        );

        alert(
          "News updated ✅"
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


const shareArticle = (
  item,
  platform
) => {

  const articleUrl =
    `https://www.uptvlive.com/article/${item.slug}`;

  const title =
    encodeURIComponent(
      item.title
    );

  const url =
    encodeURIComponent(
      articleUrl
    );

  // WHATSAPP

  if (
    platform === "whatsapp"
  ) {

    window.open(
      `https://wa.me/?text=${title}%20${url}`,
      "_blank"
    );
  }

  // FACEBOOK

  if (
    platform === "facebook"
  ) {

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  }

  // X / TWITTER

  if (
    platform === "x"
  ) {

    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      "_blank"
    );
  }

  // TELEGRAM

  if (
    platform === "telegram"
  ) {

    window.open(
      `https://t.me/share/url?url=${url}&text=${title}`,
      "_blank"
    );
  }



  // COPY

  if (
    platform === "copy"
  ) {

    navigator.clipboard.writeText(
      articleUrl
    );

    alert(
      "Link copied ✅"
    );
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

        console.log(err);

        alert(
          "Delete failed ❌"
        );
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

  const validFiles =
    fileArray.filter(
      (file) =>
        file.type.startsWith(
          "image/"
        )
    );

  if (
    validFiles.length === 0
  ) {

    return alert(
      "Only image files allowed ❌"
    );
  }

  const maxSize =
    5 * 1024 * 1024;

  const oversized =
    validFiles.find(
      (file) =>
        file.size > maxSize
    );

  if (oversized) {

    return alert(
      "Max image size is 5MB ❌"
    );
  }

  setImageFiles(
    validFiles
  );

  const previewUrls =
    validFiles.map(
      (file) => ({
        file,

        url:
          URL.createObjectURL(
            file
          ),
      })
    );

setPreview((prev) => {

  prev.forEach((img) => {

    if (
      img.url?.startsWith(
        "blob:"
      )
    ) {

      URL.revokeObjectURL(
        img.url
      );
    }
  });

  return [

    ...prev.filter(
      (img) =>
        !img.url?.startsWith(
          "blob:"
        )
    ),

    ...previewUrls,
  ];
});
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
  e.type === "dragenter" ||
  e.type === "dragover"
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
      "Select images ❌"
    );
  }

  try {

    setUploading(true);

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

    const uploadedImages =
      res.data.images || [];

setPreviewItem((prev) => ({

  ...prev,

  // ✅ REPLACE OLD IMAGES
  images: uploadedImages,

  // ✅ MAIN THUMBNAIL
  image: uploadedImages[0] || "",

}));

    // ✅ REMOVE BLOB PREVIEWS
    preview.forEach((img) => {

      if (
        img.url?.startsWith(
          "blob:"
        )
      ) {

        URL.revokeObjectURL(
          img.url
        );
      }
    });

    // ✅ SHOW ONLY SERVER URLS
// ✅ REPLACE PREVIEW WITH ONLY NEW IMAGE
setPreview(

  uploadedImages.map(
    (img) => ({
      url: img,
    })
  )

);

    // ✅ CLEAR FILES
    setImageFiles([]);

    alert(
      "Images uploaded ✅"
    );

  } catch (err) {

    console.log(err);

    alert(
      "Upload failed ❌"
    );

  } finally {

    setUploading(false);
  }
};
  // =====================================================
  // ================= RETURN ============================
  // =====================================================

  return (

    <div className="approved-container">

      {/* HEADER */}

      <div className="approved-header">

        <h2 className="heading">
          Approved News ✅
        </h2>

        <input
          type="text"

          className="search-input"

          placeholder="Search news..."

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

      {
  !loading &&
  filteredNews.length === 0 && (
    <p className="empty">
      No approved news
    </p>
  )
}

      {/* LIST */}

      <div className="news-list">

        {filteredNews.map(
          (item) => (

            <div
              key={item._id}

              className="news-card"
            >

              {/* IMAGE */}

              <div
                className="image-box"

                onClick={() =>
                  navigate(
                    `/article/${item.slug}`
                  )
                }
              >

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

                <h3>
                  {item.title}
                </h3>
                <p className="news-author">
  ✍️ By {item.author || "UPTV Live"}
</p>

                <p>

                  {cleanPreview(
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

                <div className="actions">

  {/* MAIN ACTIONS */}

  <div className="main-actions">

    <button
      type="button"
      onClick={() =>
        openPreview(item)
      }
    >
      ✏️ Edit
    </button>

    <button
      type="button"
      onClick={() =>
        deleteNews(item._id)
      }
    >
      ❌ Delete
    </button>

  </div>

  {/* SHARE ACTIONS */}

  <div className="share-actions">

  <button
    type="button"
    className="share-btn whatsapp"
    onClick={() =>
      shareArticle(item, "whatsapp")
    }
  >
    <FaWhatsapp />
  </button>

  <button
    type="button"
    className="share-btn facebook"
    onClick={() =>
      shareArticle(item, "facebook")
    }
  >
    <FaFacebookF />
  </button>

  <button
    type="button"
    className="share-btn x"
    onClick={() =>
      shareArticle(item, "x")
    }
  >
    <FaXTwitter />
  </button>

  <button
    type="button"
    className="share-btn telegram"
    onClick={() =>
      shareArticle(item, "telegram")
    }
  >
    <FaTelegramPlane />
  </button>



  <button
    type="button"
    className="share-btn copy"
    onClick={() =>
      shareArticle(item, "copy")
    }
  >
    <FaCopy />
  </button>

</div>
</div>
</div>
            </div>
          )
        )}

      </div>

      {/* MODAL */}

      {previewItem && (

        <div
  className="preview-modal"

  onClick={
    closeModal
  }
>

          <div
  className="preview-box"

  onClick={(e) =>
    e.stopPropagation()
  }
>

            {/* CLOSE */}

<button
  type="button"
  className="close-btn"
  onClick={closeModal}
  disabled={saving}
>

            
              ✖
            </button>

            {/* TITLE */}

            <input
              className="title-input"

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

            {/* MAIN IMAGE */}

<img
  src={getImage(
    previewItem
  )}

  alt="preview"

  className="main-preview-img"

  onError={(e) => {
    e.target.src =
      FALLBACK_IMG;
  }}
/>

            {/* MEDIA */}

            <div className="edit-section">

              <label>
                Media / Social Links
              </label>

              {mediaLinks.map(
                (
                  link,
                  index
                ) => {

                  const embedUrl =
                    getEmbedLink(
                      link
                    );

                  return (

                    <div
                      key={index}
                    >

                      <input
                        className="input"

                        value={link}

                        placeholder="Paste link"

                        onChange={(e) => {

                          const updated =
                            [
                              ...mediaLinks,
                            ];

                          updated[index] =
                            e.target.value;

                          setMediaLinks(
                            updated
                          );
                        }}
                      />

                      {embedUrl && (

                        <iframe
  loading="lazy"
                          src={embedUrl}

                          title={`media-${index}`}

                          className="media-preview"

                          frameBorder="0"

                          allowFullScreen
                        />
                      )}

                    </div>
                  );
                }
              )}

              <button
  type="button"
                className="upload-btn"

                onClick={() =>
                  setMediaLinks([
                    ...mediaLinks,
                    "",
                  ])
                }
              >
                + Add Link
              </button>

            </div>

            {/* IMAGE */}

            <div className="edit-section">

              <label>
                Update Images
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

  accept="image/*"

  multiple

onChange={(e) => {

  handleChange(e);

  e.target.value = null;
}}
/>


                {preview.length ===
                0 ? (
                  <p>
                    Drag & Drop or
                    Click
                  </p>
                ) : (

                  <div className="preview-grid">

                    {preview.map(
                      (
                        img,
                        i
                      ) => (

                        <img
                          key={`${img.url}-${i}`}

                          src={
                            img.url
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
  type="button"
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

{/* ===================================================== */}
{/* ================= RELATED NEWS ====================== */}
{/* ===================================================== */}

<div className="edit-section">

  <div className="related-top">

    <label>
      Related News
    </label>

    <span className="related-count">
      {
        previewItem.relatedArticles
          ?.length || 0
      } Selected
    </span>

  </div>

  {/* SEARCH INPUT */}

  <input
    type="text"

    className="related-search-input"

    placeholder="Search news title..."

    onChange={(e) => {

      const value =
        e.target.value.toLowerCase();

      if (!value.trim()) {

        setPreviewItem(
          (prev) => ({
            ...prev,
            searchResults: [],
          })
        );

        return;
      }

      const filtered =
        news.filter(
          (n) =>
            n._id !==
              previewItem._id &&

            n.title
              ?.toLowerCase()
              .includes(value)
        );

      setPreviewItem(
        (prev) => ({
          ...prev,

          searchResults:
            filtered.slice(0, 10),
        })
      );
    }}
  />

  {/* SEARCH RESULTS */}

  {
    previewItem.searchResults
      ?.length > 0 && (

      <div className="related-search-results">

        {
          previewItem.searchResults.map(
            (item) => {

              const alreadyAdded =
                previewItem.relatedArticles?.some(
                  (a) =>
                    a.slug ===
                    item.slug
                );

              return (

                <div
                  key={item._id}

                  className="related-search-card"
                >

                  {/* IMAGE */}

                  <img
                    src={
                      getImage(item)
                    }

                    alt={item.title}

                    onError={(e) => {
                      e.target.src =
                        FALLBACK_IMG;
                    }}
                  />

                  {/* CONTENT */}

                  <div className="related-search-content">

                    <h4>
                      {item.title}
                    </h4>

                    <p>
                      {
                        cleanPreview(
                          item.content
                        )
                      }
                    </p>

                  </div>

                  {/* ACTION */}

                  <button
  type="button"
                    className={
                      alreadyAdded
                        ? "added-btn"
                        : "add-btn"
                    }

                    disabled={
                      alreadyAdded
                    }

                    onClick={() => {

                      if (
                        alreadyAdded
                      ) {
                        return;
                      }

                      setPreviewItem(
                        (prev) => ({
                          ...prev,

                          relatedArticles: [

                            ...(prev.relatedArticles || []),

                            {
                              _id:
                                item._id,

                              title:
                                item.title,

                              slug:
                                item.slug,

                              image:
                                getImage(
                                  item
                                ),
                            },
                          ],
                        })
                      );
                    }}
                  >

                    {
                      alreadyAdded
                        ? "Added"
                        : "+ Add"
                    }

                  </button>

                </div>
              );
            }
          )
        }

      </div>
    )
  }

  {/* SELECTED NEWS */}

  <div className="selected-related-news">

    {
      previewItem.relatedArticles
        ?.length === 0 && (

        <div className="empty-related">

          No related news selected

        </div>
      )
    }

    {
      previewItem.relatedArticles?.map(
        (item, index) => (

          <div
            key={index}

            className="selected-related-card"
          >

            <img
              src={
                item.image ||
                FALLBACK_IMG
              }

              alt={item.title}

              onError={(e) => {
                e.target.src =
                  FALLBACK_IMG;
              }}
            />

            <div className="selected-related-content">

              <p>
                {item.title}
              </p>

            </div>

            <button
  type="button"
              className="remove-related-btn"

              onClick={() => {

                setPreviewItem(
                  (prev) => ({
                    ...prev,

                    relatedArticles:
                      prev.relatedArticles.filter(
                        (x) =>
                          x.slug !==
                          item.slug
                      ),
                  })
                );
              }}
            >
              ✖
            </button>

          </div>
        )
      )
    }

  </div>

</div>
            {/* EDITOR */}

            <div
              ref={editorRef}

              className="editor"
            />

            {/* CATEGORY */}

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
                      previewItem.categories?.includes(
                        c.name
                      );

                    return (

                      <button
  type="button"
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
                                  ? (prev.categories || []).filter(
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
                  (
                    city
                  ) => {

                    const selected =
                      previewItem.tags?.includes(
                        city.name
                      );

                    return (

                      <button
  type="button"
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
                                  ? (prev.tags || []).filter(
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
                  (
                    sec
                  ) => {

                    const selected =
                      previewItem.sections?.includes(
                        sec
                      );

                    return (

                      <button
  type="button"
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
                                  ? (prev.sections || []).filter(
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

            {/* ACTIONS */}

            <div className="modal-actions">

              <button
  type="button"
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
  type="button"
  
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