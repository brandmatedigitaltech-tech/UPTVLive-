export const shareToWhatsApp = (article) => {

  const slug =
    article?.slug || article?._id;

  // ✅ CLEAN SHARE URL
  const url =
    `https://www.uptvlive.com/article/${slug}`;

  const whatsappURL =
    `https://wa.me/?text=${encodeURIComponent(url)}`;

  window.open(
    whatsappURL,
    "_blank"
  );
};