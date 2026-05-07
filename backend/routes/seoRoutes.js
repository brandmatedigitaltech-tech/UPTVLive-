const express = require("express");
const axios = require("axios");

const router = express.Router();

// ================= WEBSITE =================
const WEBSITE_URL =
  "https://www.uptvlive.com";

// ================= API =================
const API_URL =
  "https://api.uptvlive.com/api/news";

// ================= FALLBACK =================
const FALLBACK_IMAGE =
  "https://www.uptvlive.com/logo.jpeg";

// =====================================================
// ================= SEO ARTICLE ========================
// =====================================================

router.get(
  "/article/:slug",
  async (req, res) => {

    try {

      // ================= GET SLUG =================

      const slug =
        decodeURIComponent(
          req.params.slug
        );

      // ================= FETCH NEWS =================

      const response =
        await axios.get(
          `${API_URL}/${slug}`
        );

      const news =
        response.data;

      // ================= NOT FOUND =================

      if (!news) {

        return res
          .status(404)
          .send("Article not found");
      }

      // ================= TITLE =================

      const title =
        news.title ||
        "UPTV Live";

      // ================= DESCRIPTION =================

      const description =

        news.seoDescription ||

        news.content
          ?.replace(/<[^>]+>/g, "")
          ?.replace(/\s+/g, " ")
          ?.trim()
          ?.substring(0, 180) ||

        "Latest Hindi News";

      // ================= IMAGE =================

      const image =

        news.image ||

        news.images?.[0] ||

        FALLBACK_IMAGE;

      // ================= ARTICLE URL =================

      const articleURL =
        `${WEBSITE_URL}/article/${news.slug}`;

      // ================= HTML =================

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

<!-- OPEN GRAPH -->

<meta
property="og:type"
content="article"
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
property="og:url"
content="${articleURL}"
/>

<meta
property="og:site_name"
content="UPTV Live"
/>

<!-- TWITTER -->

<meta
name="twitter:card"
content="summary_large_image"
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

<!-- REDIRECT -->

<meta
http-equiv="refresh"
content="1;url=${articleURL}"
/>

</head>

<body>

<h2>
Redirecting...
</h2>

</body>

</html>
`;

      // ================= SEND HTML =================

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