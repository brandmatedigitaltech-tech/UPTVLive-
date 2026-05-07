export const shareToWhatsApp = (article) => {

  const title =
    article?.title || "UPTV Live News";

  const slug =
    article?.slug || article?._id;

  // ✅ SEO URL FOR WHATSAPP PREVIEW
  const seoUrl =
    `https://api.uptvlive.com/seo/article/${slug}`;

  // ✅ CLEAN URL FOR USERS
  const publicUrl =
    `https://www.uptvlive.com/article/${slug}`;

  // REMOVE HTML TAGS
  const shortDescription =
    article?.content
      ?.replace(/<[^>]*>?/gm, "")
      ?.replace(/\s+/g, " ")
      ?.trim()
      ?.slice(0, 140);

  // ✅ IMPORTANT
  // ONLY seoUrl SHOULD BE LAST
  // OTHERWISE WHATSAPP PREVIEW BREAKS

  const text = `
📰 ${title}

${shortDescription || ""}

👉 Read More:
${publicUrl}

${seoUrl}
  `;

  const whatsappURL =
    `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(
    whatsappURL,
    "_blank"
  );
};