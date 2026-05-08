export const shareToWhatsApp = (article) => {

  const slug =
    article?.slug || article?._id;

  // ✅ CLEAN SHARE URL
  const url =
    `https://www.uptvlive.com/s/${slug}`;

  const whatsappURL =
    `https://wa.me/?text=${encodeURIComponent(url)}`;

  window.open(
    whatsappURL,
    "_blank"
  );
};