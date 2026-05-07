const express = require("express");
const axios = require("axios");

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
        article.title ||
        "UPTV Live";

      // DESCRIPTION
      const description =
        article.seoDescription ||

        article.content
          ?.replace(/<[^>]+>/g, "")
          ?.replace(/\s+/g, " ")
          ?.trim()
          ?.slice(0, 180) ||

        "Latest Hindi News";

      // IMAGE
      const image =
        article.image ||
        article.images?.[0] ||
        "https://www.uptvlive.com/logo.jpeg";

      // ARTICLE URL
      const articleUrl =
        `${WEBSITE_URL}/article/${article.slug}`;

      // SEND HTML
     res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8" />

<title>${title}</title>

<meta
name="description"
content="${description}"
/>

<link
rel="canonical"
href="${articleUrl}"
/>

<meta property="og:type" content="article" />

<meta property="og:title" content="${title}" />

<meta property="og:description" content="${description}" />

<meta property="og:image" content="${image}" />

<meta property="og:url" content="${articleUrl}" />

<meta property="og:site_name" content="UPTV Live" />

<meta property="og:locale" content="hi_IN" />

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

<script>
setTimeout(() => {
  window.location.href =
    "${articleUrl}";
}, 3000);
</script>

</head>

<body
style="
font-family:sans-serif;
padding:40px;
text-align:center;
"
>

<h2>
Redirecting to article...
</h2>

<p>
UPTV Live News
</p>

</body>

</html>
`);

    } catch (err) {

      console.log(err);

      res
        .status(500)
        .send("SEO Error");
    }
  }
);

module.exports = router;