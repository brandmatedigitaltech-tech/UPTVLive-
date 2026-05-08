const { slugify } =
  require("transliteration");

const createSlug = (
  text = ""
) => {

  let slug =
    String(text).trim();

  // REMOVE HTML
  slug = slug.replace(
    /<[^>]*>/g,
    ""
  );

  // HINDI → ENGLISH
  slug = slugify(slug, {
    lowercase: true,
    separator: "-",
    allowedChars:
      "a-zA-Z0-9-",
  });

  // REMOVE SPECIAL
  slug = slug.replace(
    /[^a-z0-9-]/g,
    ""
  );

  // REMOVE EXTRA DASHES
  slug = slug.replace(
    /-+/g,
    "-"
  );

  // REMOVE START-END DASH
  slug = slug.replace(
    /^-+|-+$/g,
    ""
  );

  // SHORT SEO URL
  slug = slug.substring(
    0,
    80
  );

  // FALLBACK
  if (!slug) {

    slug =
      `news-${Date.now()}`;
  }

  return slug;
};

module.exports =
  createSlug;