export const shareToWhatsApp = (article) => {

  const title =
    article?.title || "UPTV Live News";

  const slug =
    article?.slug || article?._id;

  // ✅ ONLY ONE CLEAN URL
  const url =
    `https://www.uptvlive.com/seo/article/${slug}`;

  const shortDescription =
    article?.content
      ?.replace(/<[^>]*>?/gm, "")
      ?.replace(/\s+/g, " ")
      ?.trim()
      ?.slice(0, 140);

  const text = `
📰 ${title}

${shortDescription || ""}

👉 Read More:
${url}
  `;

  const whatsappURL =
    `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(
    whatsappURL,
    "_blank"
  );
};