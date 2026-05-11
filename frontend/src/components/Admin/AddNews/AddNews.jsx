import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../../../services/api";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import "./AddNews.css";

const AddNews = () => {

  const navigate =
    useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [form, setForm] =
    useState({
      title: "",
      content: "",
      mediaLinks: [""],
      images: [],
      image: "",
      relatedArticles: [],
    });

  const [allNews, setAllNews] =
    useState([]);

  const [relatedSearch, setRelatedSearch] =
    useState("");

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
  // REFS
  // =====================================================

  const editorRef =
    useRef(null);

  const quillRef =
    useRef(null);

    // =====================================================
// QUILL IMAGE HANDLER
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

      setUploading(true);

      const data =
        new FormData();

      data.append(
        "images",
        file
      );

      const res =
        await API.post(
          "/news/upload-multiple",
          data
        );

const imageUrl =
  res.data.images?.[0];

  setForm((prev) => ({
  ...prev,

  images: [
    ...(prev.images || []),
    imageUrl,
  ],
}));

if (!imageUrl) {

  return alert(
    "Image URL not received ❌"
  );
}

const quill =
  quillRef.current;

if (!quill) return;

      const range =
        quill.getSelection();

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
        "Image upload failed ❌"
      );

    } finally {

      setUploading(false);
    }
  };
};

  // =====================================================
  // FETCH NEWS
  // =====================================================

  useEffect(() => {
    

    const fetchNews =
      async () => {

        try {

          const res =
            await API.get(
              "/news"
            );

          setAllNews(
            res.data || []
          );

        } catch (err) {

          console.log(err);
        }
      };

    fetchNews();

  }, []);

  // =====================================================
  // QUILL
  // =====================================================

  useEffect(() => {

    if (
      editorRef.current &&
      !quillRef.current
    ) {

      const quill =
        new Quill(
          editorRef.current,
          {
            theme: "snow",

            placeholder:
              "Write news content...",

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
        "link",
        "image",
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

      quill.on(
        "text-change",
        () => {

          setForm((prev) => ({
            ...prev,

            content:
  quill.root.innerHTML.trim(),
          }));
        }
      );
    }

    return () => {

      preview.forEach(
        (img) => {

          if (
            img.startsWith(
              "blob:"
            )
          ) {

            URL.revokeObjectURL(
              img
            );
          }
        }
      );
    };

  }, []);

  // =====================================================
  // RELATED SEARCH
  // =====================================================

  const filteredNews =
    useMemo(() => {

      return allNews.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(
              relatedSearch.toLowerCase()
            )
      );

    }, [
      allNews,
      relatedSearch,
    ]);

  // =====================================================
  // IMAGE HANDLING
  // =====================================================

  const handleFile =
    (files) => {

      const file =
        files[0];

      if (!file) {
        return;
      }

      setImageFiles([
        file,
      ]);

      preview.forEach(
        (img) => {

          if (
            img.startsWith(
              "blob:"
            )
          ) {

            URL.revokeObjectURL(
              img
            );
          }
        }
      );

      const previewUrl =
        URL.createObjectURL(
          file
        );

      setPreview([
        previewUrl,
      ]);
    };

  const handleChange =
    (e) => {

      handleFile(
        e.target.files
      );
    };

  // =====================================================
  // DRAG
  // =====================================================

  const handleDrag =
    (e) => {

      e.preventDefault();

      e.stopPropagation();

      if (
        e.type ===
          "dragenter" ||

        e.type ===
          "dragover"
      ) {

        setDragActive(
          true
        );

      } else {

        setDragActive(
          false
        );
      }
    };

  const handleDrop =
    (e) => {

      e.preventDefault();

      e.stopPropagation();

      setDragActive(
        false
      );

      if (
        e.dataTransfer.files &&
        e.dataTransfer.files.length >
          0
      ) {

        handleFile(
          e.dataTransfer.files
        );
      }
    };

  // =====================================================
  // AUTO UPLOAD THUMBNAIL
  // =====================================================

  const uploadThumbnail =
    async () => {

      if (
        !imageFiles.length
      ) {

        throw new Error(
          "Thumbnail required"
        );
      }

      const data =
        new FormData();

      data.append(
        "images",
        imageFiles[0]
      );

      const res =
        await API.post(
          "/news/upload-multiple",
          data
        );

      return (
        res.data.images || []
      );
    };

  // =====================================================
  // RELATED NEWS
  // =====================================================

  const toggleRelated =
    (item) => {

      const selected =
        form.relatedArticles.some(
          (a) =>
            a.slug ===
            item.slug
        );

      if (selected) {

        setForm((prev) => ({
          ...prev,

          relatedArticles:
            prev.relatedArticles.filter(
              (a) =>
                a.slug !==
                item.slug
            ),
        }));

      } else {

        setForm((prev) => ({
          ...prev,

          relatedArticles: [
            ...prev.relatedArticles,

            {
              _id:
                item._id,

              title:
                item.title,

              slug:
                item.slug,

              image:
                item.image ||
                item.images?.[0],
            },
          ],
        }));
      }
    };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submit =
    async () => {

      if (
        !form.title.trim()
      ) {

        return alert(
          "Title required ❌"
        );
      }

      if (
        !form.content.trim()
      ) {

        return alert(
          "Content required ❌"
        );
      }

      if (
        !imageFiles.length
      ) {

        return alert(
          "Select thumbnail image ❌"
        );
      }

      try {

        setLoading(
          true
        );

        // =========================================
        // AUTO UPLOAD THUMBNAIL
        // =========================================

        const uploadedImages =
          await uploadThumbnail();

        // =========================================
        // CREATE FINAL DATA
        // =========================================

        const finalData = {
          ...form,

          images: [
  ...form.images,
  ...uploadedImages,
],

          image:
            uploadedImages[0] || "",
        };

        // =========================================
        // CREATE NEWS
        // =========================================

        await API.post(
          "/news",
          finalData
        );

        alert(
          "News published successfully ✅"
        );

        // =========================================
        // RESET FORM
        // =========================================

        setForm({
          title: "",
          content: "",
          mediaLinks: [""],
          images: [],
          image: "",
          relatedArticles: [],
        });

        setImageFiles([]);

        setPreview([]);

        setRelatedSearch("");

        // CLEAR QUILL

        if (
          quillRef.current
        ) {

          quillRef.current.root.innerHTML =
            "";
        }

        // REFRESH PAGE

        window.location.reload();

      } catch (err) {

        console.log(err);

        alert(
          "Publish failed ❌"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  return (

    <div className="cms-container">

      {/* HEADER */}

      <div className="cms-header">

        <h2>
          📰 Create News
        </h2>

        <p>
          Professional News CMS
        </p>

      </div>

      {/* GRID */}

      <div className="cms-grid">

        {/* LEFT */}

        <div className="cms-left">

          {/* TITLE */}

          <div className="card">

            <label>
              News Title
            </label>

            <input
              type="text"

              className="input"

              placeholder="Enter news title..."

              value={form.title}

              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  title:
                    e.target.value,
                }))
              }
            />

          </div>

          {/* EDITOR */}

          <div className="card">

            <label>
              News Content
            </label>

            <div
              ref={editorRef}
              className="editor"
            />

          </div>

        </div>

        {/* RIGHT */}

        <div className="cms-right">

          {/* MEDIA */}

          <div className="card">

            <label>
              Media Links
            </label>

            {
              form.mediaLinks.map(
                (
                  link,
                  index
                ) => (

                  <input
                    key={index}

                    className="input"

                    placeholder="Paste media link..."

                    value={link}

                    onChange={(e) => {

                      const updated =
                        [
                          ...form.mediaLinks,
                        ];

                      updated[index] =
                        e.target.value;

                      setForm((prev) => ({
                        ...prev,

                        mediaLinks:
                          updated,
                      }));
                    }}
                  />
                )
              )
            }

            <button
              className="upload-btn"

              onClick={() =>
                setForm((prev) => ({
                  ...prev,

                  mediaLinks: [
                    ...prev.mediaLinks,
                    "",
                  ],
                }))
              }
            >
              + Add More Link
            </button>

          </div>

          {/* RELATED */}

          <div className="card">

            <div className="related-header">

              <label>
                Related News
              </label>

              <span>
                {
                  form
                    .relatedArticles
                    .length
                } Selected
              </span>

            </div>

            <input
              type="text"

              className="related-search"

              placeholder="Search related news..."

              value={relatedSearch}

              onChange={(e) =>
                setRelatedSearch(
                  e.target.value
                )
              }
            />

            <div className="related-news-list">

              {
                filteredNews
                  .slice(0, 20)
                  .map(
                    (
                      item
                    ) => {

                      const selected =
                        form.relatedArticles.some(
                          (
                            a
                          ) =>
                            a.slug ===
                            item.slug
                        );

                      return (

                        <button
                          key={
                            item._id
                          }

                          type="button"

                          className={`related-btn ${
                            selected
                              ? "active"
                              : ""
                          }`}

                          onClick={() =>
                            toggleRelated(
                              item
                            )
                          }
                        >

                          {
                            item.title
                          }

                        </button>
                      );
                    }
                  )
              }

            </div>

          </div>

          {/* THUMBNAIL */}

          <div className="card">

            <label>
              News Thumbnail
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

                onChange={
                  handleChange
                }
              />

              {
                preview.length ===
                0 ? (

                  <p>
                    Select Thumbnail Image
                  </p>

                ) : (

                  <div className="preview-grid">

                    {
                      preview.map(
                        (
                          img,
                          i
                        ) => (

                          <img
                            key={i}

                            src={img}

                            alt="preview"

                            className="preview-img"
                          />
                        )
                      )
                    }

                  </div>
                )
              }

            </div>

          </div>

          {/* SUBMIT */}

          <button
            className="submit-btn"

            onClick={
              submit
            }

            disabled={
              loading ||
              uploading
            }
          >

            {
              loading
                ? "Publishing..."
                : "🚀 Publish News"
            }

          </button>

        </div>

      </div>

    </div>
  );
};

export default AddNews;