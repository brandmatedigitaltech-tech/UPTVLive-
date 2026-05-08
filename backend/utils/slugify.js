const { slugify } = require("transliteration");

const createSlug = (
  text = ""
) => {

  // ✅ SAFE STRING
  let slug =
    String(text).trim();

  // ✅ REMOVE HTML
  slug = slug.replace(
    /<[^>]*>/g,
    ""
  );

  // ✅ HINDI → ENGLISH
  slug = slugify(slug, {
    lowercase: true,
    separator: "-",
  });

  // ✅ REMOVE SPECIAL
  slug = slug.replace(
    /[^a-z0-9-]/g,
    ""
  );

  // ✅ CLEAN DASHES
  slug = slug.replace(
    /-+/g,
    "-"
  );

  slug = slug.replace(
    /^-+|-+$/g,
    ""
  );

  // ✅ LIMIT
  slug = slug.substring(
    0,
    120
  );

  // ✅ FALLBACK
  if (!slug) {

    slug =
      `news-${Date.now()}`;
  }

  return slug;
};

module.exports =
  createSlug;