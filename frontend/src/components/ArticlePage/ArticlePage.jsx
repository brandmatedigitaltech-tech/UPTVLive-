import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  Helmet,
} from "react-helmet-async";

import API from "../../services/api";

import "./ArticlePage.css";

import AdBanner from "../AdBanner";

import {
  shareToWhatsApp,
} from "../../utils/shareArticle";

// =====================================================
// ================= FALLBACK IMAGE ====================
// =====================================================

const FALLBACK_IMG =
  "https://www.uptvlive.com/no-image.jpg";

// =====================================================
// ================= COMPONENT =========================
// =====================================================

const ArticlePage = () => {

  const { slug } =
    useParams();

  // =====================================================
  // ================= STATES ============================
  // =====================================================

  const [article, setArticle] =
    useState(null);

  const [relatedNews, setRelatedNews] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const intervalRef =
    useRef(null);

  // =====================================================
  // ================= SAFE IMAGE ========================
  // =====================================================

  const getImage = (
    img
  ) => {

    if (
      !img ||
      img.trim() === ""
    ) {

      return FALLBACK_IMG;
    }

    return img;
  };

  // =====================================================
  // ================= CLEAN HTML ========================
  // =====================================================

  const decodeHtml = (
    html
  ) => {

    if (!html) {
      return "";
    }

    if (
      typeof window ===
      "undefined"
    ) {

      return html;
    }

    const txt =
      document.createElement(
        "textarea"
      );

    txt.innerHTML = html;

    return txt.value;
  };

  const cleanHtml = (
    html
  ) => {

    if (!html) {
      return "";
    }

    if (
      typeof window ===
      "undefined"
    ) {

      return html;
    }

    const parser =
      new DOMParser();

    const doc =
      parser.parseFromString(
        html,
        "text/html"
      );

    // REMOVE SCRIPT

    doc
      .querySelectorAll(
        "script"
      )
      .forEach((el) =>
        el.remove()
      );

    // REMOVE IFRAME

    doc
      .querySelectorAll(
        "iframe"
      )
      .forEach((el) =>
        el.remove()
      );

    // REMOVE INLINE ATTRIBUTES

    doc
      .querySelectorAll("*")
      .forEach((el) => {

        el.removeAttribute(
          "style"
        );

        el.removeAttribute(
          "class"
        );

        el.removeAttribute(
          "contenteditable"
        );

        el.removeAttribute(
          "data-list"
        );
      });

    return doc.body.innerHTML;
  };

  const formatContent = (
    html
  ) => {

    return cleanHtml(
      decodeHtml(html)
    );
  };

  // =====================================================
  // ================= EMBED LINKS =======================
  // =====================================================

  const getEmbedLink = (
    url
  ) => {

    if (!url) {
      return null;
    }

    // ================= YOUTUBE =================

    if (
      url.includes(
        "youtube.com"
      ) ||

      url.includes(
        "youtu.be"
      )
    ) {

      const regExp =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;

      const match =
        url.match(regExp);

      return match
        ? `https://www.youtube.com/embed/${match[1]}`
        : null;
    }

    // ================= INSTAGRAM =================

    if (
      url.includes(
        "instagram.com"
      )
    ) {

      const cleanUrl =
        url.split("?")[0];

      return `${cleanUrl}embed`;
    }

    // ================= FACEBOOK =================

    if (
      url.includes(
        "facebook.com"
      )
    ) {

      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
        url
      )}&show_text=true&width=500`;
    }

    // ================= OTHER =================

    return null;
  };

  // =====================================================
  // ================= FETCH ARTICLE =====================
  // =====================================================

  useEffect(() => {

    const fetchArticle =
      async () => {

        try {

          const res =
            await API.get(
              `/news/${slug}`
            );

          setArticle(
            res.data
          );

          setCurrentIndex(
            0
          );

        } catch (err) {

          console.error(
            err
          );
        }
      };

    fetchArticle();

  }, [slug]);

  // =====================================================
  // ================= AUTO SLIDER =======================
  // =====================================================

  const stopSlider =
    () => {

      if (
        intervalRef.current
      ) {

        clearInterval(
          intervalRef.current
        );

        intervalRef.current =
          null;
      }
    };

  const startSlider =
    () => {

      stopSlider();

      if (
        !article?.images ||

        article.images
          .length <= 1
      ) {

        return;
      }

      intervalRef.current =
        setInterval(() => {

          setCurrentIndex(
            (prev) =>

              prev ===
              article.images
                .length -
                1

                ? 0

                : prev + 1
          );

        }, 3000);
    };

  useEffect(() => {

    startSlider();

    return () =>
      stopSlider();

  }, [article]);

  // =====================================================
  // ================= RELATED NEWS ======================
  // =====================================================

  useEffect(() => {

    const fetchRelated =
      async () => {

        try {

          const res =
            await API.get(
              "/news"
            );

          const allNews =
            Array.isArray(
              res.data
            )
              ? res.data
              : [];

          const filtered =
            allNews

              .filter(
                (n) => {

                  // SKIP CURRENT ARTICLE

                  if (
                    n.slug ===
                    slug
                  ) {

                    return false;
                  }

                  // CATEGORY MATCH

                  const categoryMatch =
                    n.categories?.some(
                      (
                        c
                      ) =>
                        article?.categories?.includes(
                          c
                        )
                    );

                  // TAG MATCH

                  const tagMatch =
                    n.tags?.some(
                      (
                        t
                      ) =>
                        article?.tags?.includes(
                          t
                        )
                    );

                  return (
                    categoryMatch ||
                    tagMatch
                  );
                }
              )

              .slice(0, 6);

          setRelatedNews(
            filtered
          );

        } catch (err) {

          console.log(
            err
          );
        }
      };

    if (article) {

      fetchRelated();
    }

  }, [slug, article]);

  // =====================================================
  // ================= LOADING ===========================
  // =====================================================

  if (!article) {

    return (

      <p className="loading">

        Loading...

      </p>
    );
  }

  // =====================================================
  // ================= SEO ===============================
  // =====================================================

  const seoImage =

    article.image?.startsWith(
      "http"
    )

      ? article.image

      : article.images?.[0]?.startsWith(
          "http"
        )

      ? article.images[0]

      : FALLBACK_IMG;

  const articleUrl =
    `https://www.uptvlive.com/article/${article.slug}`;

  const description =

    article.seoDescription ||

    article.content
      ?.replace(
        /<[^>]*>?/gm,
        ""
      )

      ?.replace(
        /\s+/g,
        " "
      )

      ?.trim()

      ?.slice(
        0,
        160
      ) ||

    article.title;

  // =====================================================
  // ================= COPY LINK =========================
  // =====================================================

  const copyLink =
    async () => {

      try {

        await navigator.clipboard.writeText(
          articleUrl
        );

        alert(
          "Link copied ✅"
        );

      } catch (err) {

        console.log(
          err
        );
      }
    };

  // =====================================================
  // ================= IMAGES ============================
  // =====================================================

  const images =
    Array.isArray(
      article.images
    )
      ? article.images
      : [];

  // =====================================================
  // ================= RETURN ============================
  // =====================================================

  return (

    <div className="article-container">

      {/* SEO */}

      <Helmet>

        <title>
          {
            article.title
          }{" "}
          | UPTV Live
        </title>

        <meta
          name="description"
          content={
            description
          }
        />

        {/* OPEN GRAPH */}

        <meta
          property="og:type"
          content="article"
        />

        <meta
          property="og:title"
          content={
            article.title
          }
        />

        <meta
          property="og:description"
          content={
            description
          }
        />

        <meta
          property="og:image"
          content={
            seoImage
          }
        />

        <meta
          property="og:url"
          content={
            articleUrl
          }
        />

        <meta
          property="og:site_name"
          content="UPTV Live"
        />

        <link
          rel="canonical"
          href={
            articleUrl
          }
        />

        {/* TWITTER */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={
            article.title
          }
        />

        <meta
          name="twitter:description"
          content={
            description
          }
        />

        <meta
          name="twitter:image"
          content={
            seoImage
          }
        />

      </Helmet>

      {/* BACK */}

      <Link
        to="/"
        className="back-link"
      >
        ← होम
      </Link>

      {/* CATEGORY */}

      <p className="article-category">

        {
          article.categories?.[0] ||
          "News"
        }

        {" | "}

        {
          article.tags?.join(
            ", "
          )
        }

      </p>

      {/* TITLE */}

      <h1 className="article-title">

        {
          article.title
        }

      </h1>

      {/* META */}

      <div className="article-meta-row">

        <p className="article-author">
  ✍️ By {article.author}
</p>

        <p className="article-meta">

          ⏰ {

            new Date(
              article.createdAt
            ).toLocaleString()

          }

          {" • "}

          👁 {
            article.views || 0
          }

        </p>

        {/* SHARE */}

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap:
              "wrap",
          }}
        >

          {/* SHARE */}

          <button
            className="share-btn"

            onClick={async () => {

              try {

                if (
                  navigator.share
                ) {

                  await navigator.share(
                    {
                      title:
                        article.title,

                      text:
                        description,

                      url:
                        articleUrl,
                    }
                  );

                } else {

                  await navigator.clipboard.writeText(
                    articleUrl
                  );

                  alert(
                    "Link copied ✅"
                  );
                }

              } catch (err) {

                console.log(
                  err
                );
              }
            }}
          >
            Share
          </button>

          {/* WHATSAPP */}

          <button
            className="share-btn"

            onClick={() =>
              shareToWhatsApp(
                article
              )
            }
          >
            WhatsApp
          </button>

          {/* COPY */}

          <button
            className="share-btn"

            onClick={
              copyLink
            }
          >
            Copy
          </button>

        </div>

      </div>

      {/* TOP AD */}

      <AdBanner position="article_top" />

      {/* IMAGE SLIDER */}

      {
        images.length > 0 ? (

          <div
            className="slider"

            onMouseEnter={
              stopSlider
            }

            onMouseLeave={
              startSlider
            }
          >

            <img
              src={getImage(
                images[
                  currentIndex
                ]
              )}

              className="slide-img"

              alt={
                article.title
              }

              loading="lazy"

              onError={(e) => {

                e.target.src =
                  FALLBACK_IMG;
              }}
            />

            {
              images.length >
                1 && (

                <>
                  <button
                    className="prev-btn"

                    onClick={() =>
                      setCurrentIndex(
                        (
                          prev
                        ) =>

                          prev ===
                          0

                            ? images.length - 1

                            : prev - 1
                      )
                    }
                  >
                    ‹
                  </button>

                  <button
                    className="next-btn"

                    onClick={() =>
                      setCurrentIndex(
                        (
                          prev
                        ) =>

                          prev ===
                          images.length -
                            1

                            ? 0

                            : prev + 1
                      )
                    }
                  >
                    ›
                  </button>
                </>
              )
            }

          </div>

        ) : (

          <img
            src={getImage(
              article.image
            )}

            className="article-image"

            alt={
              article.title
            }

            loading="lazy"
          />
        )
      }

      {/* CONTENT */}

      <div
        className="article-content"

        dangerouslySetInnerHTML={{
          __html:
            formatContent(
              article.content
            ),
        }}
      />

      {/* MIDDLE AD */}

      <AdBanner position="article_middle" />

      {/* MEDIA LINKS */}

      {
        Array.isArray(
          article.mediaLinks
        ) &&

        article.mediaLinks
          .length > 0 && (

          <div className="media-links-container">

            {
              article.mediaLinks.map(
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

                      className={`video-container

                      ${
                        link.includes(
                          "youtube"
                        ) ||

                        link.includes(
                          "youtu.be"
                        )

                          ? "youtube-embed"

                          : link.includes(
                              "instagram"
                            )

                          ? "instagram-embed"

                          : link.includes(
                              "facebook"
                            )

                          ? "facebook-embed"

                          : link.includes(
                              "twitter"
                            ) ||

                            link.includes(
                              "x.com"
                            )

                          ? "twitter-embed"

                          : "website-embed"
                      }
                    `}
                    >

                      {
                        embedUrl ? (

                          <iframe
                            src={
                              embedUrl
                            }

                            title={`media-${index}`}

                            frameBorder="0"

                            allowFullScreen
                          />

                        ) : (

                          <a
                            href={link}

                            target="_blank"

                            rel="noreferrer"

                            className="external-link-card"
                          >

                            🔗 Open External Content

                          </a>
                        )
                      }

                    </div>
                  );
                }
              )
            }

          </div>
        )
      }

      {/* BOTTOM AD */}

      <AdBanner position="article_bottom" />

      {/* TAGGED NEWS */}

      {
        article.relatedArticles
          ?.length > 0 && (

          <div className="related-section">

            <h3>
              🔥 Tagged News
            </h3>

            <div className="related-grid">

              {
                article.relatedArticles.map(
                  (
                    item
                  ) => (

                    <Link
                      key={
                        item.slug
                      }

                      to={`/article/${item.slug}`}

                      className="related-card"
                    >

                      <img
                        src={
                          item.image ||

                          FALLBACK_IMG
                        }

                        alt={
                          item.title
                        }

                        loading="lazy"

                        onError={(e) => {

                          e.target.src =
                            FALLBACK_IMG;
                        }}
                      />

                      <div className="related-content">

                        <p>
                          {
                            item.title
                          }
                        </p>

                      </div>

                    </Link>
                  )
                )
              }

            </div>

          </div>
        )
      }

      {/* AUTO RELATED */}

      <div className="related-section">

        <h3>
          🔥 संबंधित खबरें
        </h3>

        <div className="related-grid">

          {
            relatedNews.map(
              (
                item
              ) => {

                const img =

                  item.image ||

                  item.images?.[0] ||

                  FALLBACK_IMG;

                return (

                  <Link
                    key={
                      item._id
                    }

                    to={`/news/${item.slug}`}

                    className="related-card"
                  >

                    <img
                      src={img}

                      alt={
                        item.title
                      }

                      loading="lazy"

                      onError={(e) => {

                        e.target.src =
                          FALLBACK_IMG;
                      }}
                    />

                    <div className="related-content">

                      <p>

                        {
                          item.title ||
                          "No Title"
                        }

                      </p>

                    </div>

                  </Link>
                );
              }
            )
          }

        </div>

      </div>

    </div>
  );
};

export default ArticlePage;