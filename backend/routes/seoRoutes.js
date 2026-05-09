const express = require("express");
const axios = require("axios");

const router = express.Router();

// =========================
// CONFIG
// =========================

const WEBSITE_URL =
  "https://www.uptvlive.com";

const API_URL =
  "https://api.uptvlive.com/api/news";

// =========================
// SEO ARTICLE ROUTE
// =========================

router.get(
  "/article/:slug",
  async (req, res) => {

    try {

      // =========================
      // GET SLUG
      // =========================

      const slug =
        decodeURIComponent(
          req.params.slug
        );

      // =========================
      // FETCH ARTICLE
      // =========================

      const response =
        await axios.get(
          `${API_URL}/${slug}`
        );

      const article =
        response.data;

      // =========================
      // NOT FOUND
      // =========================

      if (!article) {

        return res
          .status(404)
          .send("Article not found");

      }

      // =========================
      // SEO DATA
      // =========================

      const title =
        article.title ||
        "UPTV Live";

      const description =

        article.seoDescription ||

        article.content
          ?.replace(/<[^>]+>/g, "")
          ?.replace(/\s+/g, " ")
          ?.trim()
          ?.slice(0, 180) ||

        "Latest Hindi News";

      // =========================
      // IMAGE
      // =========================

      const image =

        article.image ||

        article.images?.[0] ||

        "https://www.uptvlive.com/logo.jpeg";

      // =========================
      // FINAL ARTICLE URL
      // =========================

      const articleUrl =
        `${WEBSITE_URL}/article/${article.slug}`;

      // =========================
      // HTML RESPONSE
      // =========================

      res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<meta
name="robots"
content="index, follow"
/>

<title>
${title}
</title>

<meta
name="description"
content="${description}"
/>

<link
rel="canonical"
href="${articleUrl}"
/>

<!-- ================= OG ================= -->

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
property="og:url"
content="${articleUrl}"
/>

<meta
property="og:site_name"
content="UPTV Live"
/>

<meta
property="og:locale"
content="hi_IN"
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
property="og:image:width"
content="1200"
/>

<meta
property="og:image:height"
content="630"
/>

<meta
property="og:image:type"
content="image/jpeg"
/>

<!-- ================= TWITTER ================= -->

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

<!-- ================= REDIRECT ================= -->

<meta
http-equiv="refresh"
content="0; url=${articleUrl}"
/>

</head>

<body
style="
font-family:sans-serif;
padding:40px;
text-align:center;
"
>

<h2>
UPTV Live
</h2>

<p>
Loading article...
</p>

<a href="${articleUrl}">
Open Article
</a>

</body>

</html>

`);

    } catch (err) {

      console.log(
        "SEO ERROR:",
        err.message
      );

      res
        .status(500)
        .send("SEO Error");

    }
  }
);

module.exports = router;