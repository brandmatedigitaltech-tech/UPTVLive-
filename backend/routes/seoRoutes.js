const express = require("express");
const axios = require("axios");
const escapeHtml = (
  text = ""
) => {

  return text

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
};
const router = express.Router();

const WEBSITE_URL =
  "https://www.uptvlive.com";

const API_URL =
  "https://api.uptvlive.com/api/news";

// ==========================================
// SEO ARTICLE ROUTE
// ==========================================

router.get(
  "/article/:slug",
  async (req, res) => {

    try {

      const slug =
        decodeURIComponent(
          req.params.slug
        );

      // FETCH ARTICLE
      const response =
        await axios.get(
          `${API_URL}/${slug}`
        );

      const article =
        response.data;

      if (!article) {

        return res
          .status(404)
          .send("Article not found");

      }

      // TITLE
const title =
  escapeHtml(
    article.title || "UPTV Live"
  );

      // DESCRIPTION
const cleanText =

  article.content
    ?.replace(/<[^>]+>/g, "")
    ?.replace(/\n/g, " ")
    ?.replace(/\r/g, " ")
    ?.replace(/\s+/g, " ")
    ?.trim();

const description =
  escapeHtml(

    article.seoDescription ||

    cleanText?.slice(0, 120) ||

    "Latest Hindi News"

  );

      // IMAGE
const image = encodeURI(

  article.image?.startsWith("http")
    ? article.image

    : article.images?.[0]?.startsWith("http")
    ? article.images[0]

    : "https://www.uptvlive.com/og-default.jpg"

);

      // FINAL URL
      const articleUrl =
        `${WEBSITE_URL}/article/${article.slug}`;

      // HTML
      res.send(`
<!DOCTYPE html>

<html lang="en">

<head>

<meta property="og:image:type" content="image/jpeg" />

<meta name="twitter:image:alt" content="${title}" />

<meta charset="UTF-8" />

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<meta
name="robots"
content="index, follow"
/>

<title>${title}</title>

<meta
name="description"
content="${description}"
/>

<link
rel="canonical"
href="${articleUrl}"
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
<meta property="og:image:alt" content="${title}" />

<meta property="article:publisher" content="https://www.facebook.com/uptvlive" />

<meta name="theme-color" content="#d60000" />

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

<a href="${WEBSITE_URL}/news/${article.slug}">
Open Article
</a>

<script>

setTimeout(() => {

window.location.replace(
  "${WEBSITE_URL}/news/${article.slug}"


}, 3000);

</script>

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