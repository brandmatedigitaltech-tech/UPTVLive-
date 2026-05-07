export const shareToWhatsApp = (article) => {

  const title =
    article?.title || "UPTV Live News";

  const slug =
    article?.slug || article?._id;

  // ✅ SEO URL
  const url =
    `https://api.uptvlive.com/seo/article/${slug}`;

  const whatsappURL =
    `https://wa.me/?text=${encodeURIComponent(url)}`;

  window.open(
    whatsappURL,
    "_blank"
  );
};