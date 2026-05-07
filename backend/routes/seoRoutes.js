const express = require("express");

const axios = require("axios");

const router = express.Router();

// ======================================================
// ================= WEBSITE URL ========================
// ======================================================

const WEBSITE_URL =
  "https://www.uptvlive.com";

// ======================================================
// ================= API URL ============================
// ======================================================

const API_URL =
  "https://api.uptvlive.com/api/news";

// ======================================================
// ================= FALLBACK IMAGE =====================
// ======================================================

const FALLBACK_IMAGE =
  "https://www.uptvlive.com/logo.jpeg";

// ======================================================
// ================= SEO ARTICLE ROUTE ==================
// ======================================================

router.get(
  "/article/:slug",
  async (req, res) => {
    try {

      const slug =
        decodeURIComponent(
          req.params.slug
        );

      // ======================================================
      // ================= FETCH ARTICLE ======================
      // ======================================================

      const response =
        await axios.get(
          `${API_URL}/${slug}`
        );

      const news =
        response.data;

      // ======================================================
      // ================= NOT FOUND ==========================
      // ======================================================

      if (!news) {
        return res
          .status(404)
          .send("Article not found");
      }

      // ======================================================
      // ================= TITLE ==============================
      // ======================================================

      const title =
        news.title ||
        "UPTV Live";

      // ======================================================
      // ================= DESCRIPTION ========================
      // ======================================================

      const description =
        news.content
          ?.replace(
            /<[^>]+>/g,
            ""
          )
          ?.replace(
            /\s+/g,
            " "
          )
          ?.trim()
          ?.substring(0, 180) ||
        "Latest Hindi News";

      // ======================================================
      // ================= IMAGE ==============================
      // ======================================================

      const image =
        news.images?.[0] ||
        news.image ||
        FALLBACK_IMAGE;

      // ======================================================
      // ================= ARTICLE URL ========================
      // ======================================================

      const articleURL =
        `${WEBSITE_URL}/article/${slug}`;

      // ======================================================
      // ================= HTML ===============================
      // ======================================================

      const html = `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>${title}</title>

<meta
  name="description"
  content="${description}"
/>

<link
  rel="canonical"
  href="${articleURL}"
/>

<!-- ================================================== -->
<!-- ================= OPEN GRAPH ===================== -->
<!-- ================================================== -->

<meta
  property="og:type"
  content="article"
/>

<meta
  property="og:site_name"
  content="UPTV Live"
/>

<meta
  property="og:url"
  content="${articleURL}"
/>

<meta
  property="og:title"
  content="${title}"
/>

<meta
  property="og:description"
  content="${description}"
/>

<meta
  property="og:image"
  content="${image}"
/>

<meta
  property="og:image:secure_url"
  content="${image}"
/>

<meta
  property="og:image:type"
  content="image/jpeg"
/>

<meta
  property="og:image:width"
  content="1200"
/>

<meta
  property="og:image:height"
  content="630"
/>

<!-- ================================================== -->
<!-- ================= TWITTER ======================== -->
<!-- ================================================== -->

<meta
  name="twitter:card"
  content="summary_large_image"
/>

<meta
  name="twitter:url"
  content="${articleURL}"
/>

<meta
  name="twitter:title"
  content="${title}"
/>

<meta
  name="twitter:description"
  content="${description}"
/>

<meta
  name="twitter:image"
  content="${image}"
/>

<!-- ================================================== -->
<!-- ================= REDIRECT ======================= -->
<!-- ================================================== -->

<meta
  http-equiv="refresh"
  content="2; url=${articleURL}"
/>

</head>

<body>

<h2>
Redirecting to article...
</h2>

<script>

setTimeout(() => {

  window.location.href =
    "${articleURL}";

}, 1500);

</script>

</body>

</html>
      `;

      // ======================================================
      // ================= SEND HTML ==========================
      // ======================================================

      return res.send(html);

    } catch (err) {

      console.error(
        "SEO ERROR:",
        err.message
      );

      return res
        .status(500)
        .send("SEO Error");
    }
  }
);

module.exports = router;