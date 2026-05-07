const express = require("express");
const axios = require("axios");

const router = express.Router();

const WEBSITE_URL = "https://www.uptvlive.com";
const API_URL = "https://api.uptvlive.com/api/news";

router.get("/article/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // FETCH ARTICLE
    const response = await axios.get(`${API_URL}/slug/${slug}`);

    const news = response.data;

    if (!news) {
      return res.status(404).send("Article not found");
    }

    // TITLE
    const title = news.title || "UPTV Live";

    // DESCRIPTION
    const description =
      news.content
        ?.replace(/<[^>]+>/g, "")
        ?.substring(0, 180) || "Latest Hindi News";

    // IMAGE
    const image =
      news.images?.[0] ||
      news.image ||
      "https://www.uptvlive.com/logo.jpeg";

    // URL
    const url = `${WEBSITE_URL}/article/${slug}`;

    // FRONTEND URL
    const frontendURL = url;

    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>${title}</title>

<meta name="description" content="${description}" />

<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${url}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />

</head>

<body>

<h2>Redirecting...</h2>

<script>
setTimeout(() => {
  window.location.href = "${frontendURL}";
}, 1500);
</script>

</body>
</html>
    `);
  } catch (err) {
    console.error(err);

    res.status(500).send("SEO Error");
  }
});

module.exports = router;