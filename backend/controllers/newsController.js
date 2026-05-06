const News = require("../models/News");
const createSlug = require("../utils/slugify");

// ================= HELPERS =================

// ✅ SAFE ARRAY
const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

// ✅ CLEAN STRING
const safeString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

// ✅ SEO DESCRIPTION
const generateSeoDescription = (html = "") => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);
};

// ✅ UNIQUE SLUG
const generateUniqueSlug = async (title) => {
  const baseSlug = createSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (await News.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// ================= CREATE NEWS =================
exports.createNews = async (req, res) => {
  try {
    const {
      title,
      content,
      youtubeUrl,
      sections,
      tags,
      categories,
    } = req.body;

    // ✅ TITLE VALIDATION
    if (!title || safeString(title) === "") {
      return res.status(400).json({
        msg: "Title is required ❌",
      });
    }

    // ✅ IMAGES
    const images = safeArray(req.body.images);

    // ✅ MAIN IMAGE
    const image = images[0] || "";

    // ✅ UNIQUE SEO SLUG
    const slug = await generateUniqueSlug(title);

    // ✅ SEO DESCRIPTION
    const seoDescription = generateSeoDescription(content);

    // ✅ CREATE NEWS
    const news = await News.create({
      title: safeString(title),

      content: content || "",

      slug,

      image,

      images,

      youtubeUrl: safeString(youtubeUrl),

      sections: safeArray(sections).map((s) =>
        String(s).toLowerCase()
      ),

      tags: safeArray(tags),

      categories: safeArray(categories),

      seoDescription,

      status: "pending",

      views: 0,

      author: req.user?.email || "Writer",
    });

    return res.status(201).json(news);

  } catch (err) {
    console.error("Create Error:", err);

    return res.status(500).json({
      msg: "Failed to create news ❌",
    });
  }
};

// ================= GET ALL APPROVED =================
exports.getNews = async (req, res) => {
  try {
    const news = await News.find({
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(news);

  } catch (err) {
    console.error("Get News Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch news ❌",
    });
  }
};

// ================= APPROVED NEWS =================
exports.getApprovedNews = async (req, res) => {
  try {
    const news = await News.find({
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(news);

  } catch (err) {
    console.error("Approved News Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch approved news ❌",
    });
  }
};

// ================= CATEGORY =================
exports.getByCategory = async (req, res) => {
  try {
    const category = safeString(req.params.category);

    const news = await News.find({
      status: "approved",

      categories: {
        $elemMatch: {
          $regex: new RegExp(`^${category}$`, "i"),
        },
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(news);

  } catch (err) {
    console.error("Category Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch category news ❌",
    });
  }
};

// ================= CITY =================
// ================= CITY =================
exports.getByCity = async (req, res) => {

  try {

    // ✅ URL CITY
    const city =
      safeString(req.params.city)
        .toLowerCase()
        .trim();

    // ✅ FIND NEWS
    const news =
      await News.find({

        status: "approved",

        tags: {
          $elemMatch: {
            $regex: new RegExp(
              `^${city}$`,
              "i"
            ),
          },
        },

      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.json(news);

  } catch (err) {

    console.error(
      "City Error:",
      err
    );

    return res.status(500).json({
      msg:
        "Failed to fetch city news ❌",
    });
  }
};
// ================= SECTION =================
exports.getBySection = async (req, res) => {
  try {
    const section = safeString(
      req.params.section
    ).toLowerCase();

    const news = await News.find({
      status: "approved",

      sections: {
        $elemMatch: {
          $regex: new RegExp(`^${section}$`, "i"),
        },
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(news);

  } catch (err) {
    console.error("Section Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch section news ❌",
    });
  }
};

// ================= SINGLE NEWS =================
exports.getSingleNews = async (req, res) => {
  try {
    const slug = safeString(req.params.slug);

    // ✅ INCREMENT VIEWS
    const news = await News.findOneAndUpdate(
      { slug },

      {
        $inc: {
          views: 1,
        },
      },

      {
        new: true,
      }
    ).lean();

    if (!news) {
      return res.status(404).json({
        msg: "News not found ❌",
      });
    }

    return res.json(news);

  } catch (err) {
    console.error("Single News Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch article ❌",
    });
  }
};

// ================= UPDATE NEWS =================
exports.updateNews = async (req, res) => {
  try {
    const {
      title,
      content,
      youtubeUrl,
      sections,
      categories,
      tags,
      images,
    } = req.body;

    const existingNews = await News.findById(
      req.params.id
    );

    if (!existingNews) {
      return res.status(404).json({
        msg: "News not found ❌",
      });
    }

    // ✅ UPDATE DATA
    const updateData = {};

    // ================= TITLE =================
    if (typeof title !== "undefined") {
      updateData.title = safeString(title);

      // ✅ ONLY CHANGE SLUG IF TITLE CHANGED
      if (
        safeString(title) !== existingNews.title
      ) {
        updateData.slug =
          await generateUniqueSlug(title);
      }
    }

    // ================= CONTENT =================
    if (typeof content !== "undefined") {
      updateData.content = content;

      updateData.seoDescription =
        generateSeoDescription(content);
    }

    // ================= YOUTUBE =================
    if (typeof youtubeUrl !== "undefined") {
      updateData.youtubeUrl =
        safeString(youtubeUrl);
    }

    // ================= IMAGES =================
    if (typeof images !== "undefined") {
      const imgArray = safeArray(images);

      updateData.images = imgArray;

      updateData.image =
        imgArray.length > 0
          ? imgArray[0]
          : "";
    }

    // ================= SECTIONS =================
    if (typeof sections !== "undefined") {
      updateData.sections =
        safeArray(sections).map((s) =>
          String(s).toLowerCase()
        );
    }

    // ================= CATEGORY =================
    if (typeof categories !== "undefined") {
      updateData.categories =
        safeArray(categories);
    }

    // ================= TAGS =================
    if (typeof tags !== "undefined") {
      updateData.tags = safeArray(tags);
    }

    const updated =
      await News.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

    return res.json(updated);

  } catch (err) {
    console.error("Update Error:", err);

    return res.status(500).json({
      msg: "Failed to update news ❌",
    });
  }
};

// ================= PENDING =================
exports.getPendingNews = async (req, res) => {
  try {
    const news = await News.find({
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(news);

  } catch (err) {
    console.error("Pending Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch pending news ❌",
    });
  }
};

// ================= APPROVE =================
exports.approveNews = async (req, res) => {
  try {
    const { comment } = req.body;

    const news =
      await News.findByIdAndUpdate(
        req.params.id,
        {
          status: "approved",

          adminComment:
            safeString(comment),
        },
        {
          new: true,
        }
      );

    if (!news) {
      return res.status(404).json({
        msg: "News not found ❌",
      });
    }

    return res.json(news);

  } catch (err) {
    console.error("Approve Error:", err);

    return res.status(500).json({
      msg: "Failed to approve news ❌",
    });
  }
};

// ================= DELETE =================
exports.deleteNews = async (req, res) => {
  try {
    const deleted =
      await News.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        msg: "News not found ❌",
      });
    }

    return res.json({
      msg: "News deleted successfully ✅",
    });

  } catch (err) {
    console.error("Delete Error:", err);

    return res.status(500).json({
      msg: "Failed to delete news ❌",
    });
  }
};

// ================= GET BY ID =================
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(
      req.params.id
    ).lean();

    if (!news) {
      return res.status(404).json({
        msg: "News not found ❌",
      });
    }

    return res.json(news);

  } catch (err) {
    console.error("Get By ID Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch news ❌",
    });
  }
};

// ================= SEO =================
exports.getSeoData = async (req, res) => {
  try {
    const slug = safeString(req.params.slug);

    const news = await News.findOne({
      slug,
    }).lean();

    if (!news) {
      return res.status(404).json({
        msg: "News not found ❌",
      });
    }

    return res.json({
      title: news.title,

      description:
        news.seoDescription ||

        "Latest news updates from UPTV Live",

      image:
        news.image ||

        news.images?.[0] ||

        "",

      slug: news.slug,

      createdAt: news.createdAt,
    });

  } catch (err) {
    console.error("SEO Error:", err);

    return res.status(500).json({
      msg: "Failed to fetch SEO data ❌",
    });
  }
};