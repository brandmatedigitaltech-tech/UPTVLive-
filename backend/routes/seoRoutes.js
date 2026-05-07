const express = require("express");

const router = express.Router();

const axios = require("axios");

// =====================================================
// ================= WEBSITE ===========================
// =====================================================

const WEBSITE_URL =
  "https://www.uptvlive.com";

// =====================================================
// ================= API URL ===========================
// =====================================================

const API_URL =
  "https://api.uptvlive.com/api/news";

// =====================================================
// ================= FALLBACK ==========================
// =====================================================

const FALLBACK_IMAGE =
  "https://www.uptvlive.com/no-image.jpg";

// =====================================================
// ================= SEO ROUTE =========================
// =====================================================

router.get(
  "/article/:slug",
  async (req, res) => {

    try {

      const { slug } =
        req.params;

      // =====================================================
      // ================= FETCH ARTICLE =====================
      // =====================================================

      const response =
        await axios.get(
          `${API_URL}/${slug}`
        );

      const article =
        response.data;

      // =====================================================
      // ================= SAFE DATA =========================
      // =====================================================

      const title =
        article?.title ||
        "UPTV Live";

      const description =
        article?.seoDescription ||

        article?.content
          ?.replace(/<[^>]*>?/gm, "")
          ?.replace(/\s+/g, " ")
          ?.trim()
          ?.slice(0, 180) ||

        "Latest breaking news from UPTV Live";

      const image =
        article?.image?.startsWith(
          "http"
        )
          ? article.image

          : article?.images?.[0]?.startsWith(
              "http"
            )
          ? article.images[0]

          : FALLBACK_IMAGE;

      const articleUrl =
        `${WEBSITE_URL}/article/${article.slug}`;

      // =====================================================
      // ================= HTML ==============================
      // =====================================================

      const html = `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>
${title}
</title>

<meta
name="description"
content="${description}"
/>

<!-- ================================================= -->
<!-- ================= OPEN GRAPH ==================== -->
<!-- ================================================= -->

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
content="${articleUrl}"
/>

<meta
property="og:site_name"
content="UPTV Live"
/>

<!-- ================================================= -->
<!-- ================= TWITTER ======================= -->
<!-- ================================================= -->

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

<!-- ================================================= -->
<!-- ================= REDIRECT ====================== -->
<!-- ================================================= -->

<script>

window.location.href =
"${articleUrl}";

</script>

</head>

<body>

Redirecting...

</body>

</html>
      `;

      res.send(html);

    } catch (err) {

      console.log(err);

      res.redirect(
        WEBSITE_URL
      );
    }
  }
);

module.exports =
  router;