const express = require("express");
const axios = require("axios");

const router = express.Router();

// ================= WEBSITE =================
const WEBSITE_URL = "https://www.uptvlive.com";

// ================= API =================
const API_URL = "https://api.uptvlive.com/api/news";

// ================= FALLBACK IMAGE =================
const FALLBACK_IMAGE =
  "https://www.uptvlive.com/logo.jpeg";

// ================= SEO ROUTE =================
router.get("/article/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // ================= FETCH ARTICLE =================
    const response = await axios.get(
      `${API_URL}/slug/${slug}`
    );

    const news = response.data;

    // ================= NOT FOUND =================
    if (!news) {
      return res.status(404).send("Article not found");
    }

    // ================= TITLE =================
    const title =
      news.title || "UPTV Live";

    // ================= DESCRIPTION =================
    const description =
      news.content
        ?.replace(/<[^>]+>/g, "")
        ?.replace(/\s+/g, " ")
        ?.trim()
        ?.substring(0, 180) ||
      "Latest Hindi News";

    // ================= IMAGE =================
    const image =
      news.images?.[0] ||
      news.image ||
      FALLBACK_IMAGE;

    // ================= ARTICLE URL =================
    const url =
      `${WEBSITE_URL}/article/${slug}`;

    // ================= HTML =================
    const seoHTML = `
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
  href="${url}"
/>

<!-- ================= OPEN GRAPH ================= -->

<meta
  property="og:type"
  content="article"
/>

<meta
  property="og:url"
  content="${url}"
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
  property="og:site_name"
  content="UPTV Live"
/>

<!-- ================= TWITTER ================= -->

<meta
  name="twitter:card"
  content="summary_large_image"
/>

<meta
  name="twitter:url"
  content="${url}"
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

<!-- ================= REDIRECT ================= -->

<meta
  http-equiv="refresh"
  content="2;url=${url}"
/>

</head>

<body>

<h2>
Redirecting to article...
</h2>

</body>

</html>
`;

    // ================= SEND HTML =================
    return res.send(seoHTML);

  } catch (err) {
    console.error("SEO ERROR:", err);

    return res.status(500).send("SEO Error");
  }
});

module.exports = router;