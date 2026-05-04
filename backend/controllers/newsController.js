const News = require("../models/News");
const slugify = require("slugify");

// ================= CREATE =================
// exports.createNews = async (req, res) => {
//   try {
//     const { title, images, youtubeUrl, sections } = req.body;

//     if (!title) {
//       return res.status(400).json({ msg: "Title is required" });
//     }

//     // 🔥 UNIQUE SLUG (FIX DUPLICATE ISSUE)
//     const uniqueId = Math.random().toString(36).substring(2, 6);

//     const slug =
//       slugify(title, { lower: true, strict: true }) +
//       "-" +
//       Date.now() +
//       "-" +
//       uniqueId;

//     const news = await News.create({
//       ...req.body,

//       slug,

//       // 🔥 SAFE ARRAY
//       images: Array.isArray(images) ? images : [],

//       youtubeUrl: youtubeUrl || "",

//       // 🔥 NORMALIZE SECTIONS
//       sections: Array.isArray(sections)
//         ? sections.map((s) => s.toLowerCase())
//         : [],

//       status: "pending",
//       views: 0,
//       author: req.user?.email || "Writer",
//     });

//     res.status(201).json(news);
//   } catch (err) {
//     console.error("Create Error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

exports.createNews = async (req, res) => {
  try {
    const { title, youtubeUrl, sections } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const uniqueId = Math.random().toString(36).substring(2, 6);

    const slug =
      slugify(title, { lower: true, strict: true }) +
      "-" +
      Date.now() +
      "-" +
      uniqueId;

    // 🔥 CLOUDINARY IMAGES FIX

    const images = Array.isArray(req.body.images) ? req.body.images : [];

    const image = images.length > 0 ? images[0] : "";

    const news = await News.create({
      ...req.body,
      slug,

      image, // 🔥 THUMBNAIL
      images, // 🔥 ALL IMAGES

      youtubeUrl: youtubeUrl || "",

      sections: Array.isArray(sections)
        ? sections.map((s) => s.toLowerCase())
        : [],

      status: "pending",
      views: 0,
      author: req.user?.email || "Writer",
    });

    res.status(201).json(news);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET ALL =================
exports.getNews = async (req, res) => {
  try {
    const news = await News.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= APPROVED =================
exports.getApprovedNews = async (req, res) => {
  try {
    const news = await News.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= CATEGORY =================
exports.getByCategory = async (req, res) => {
  try {
    const category = req.params.category;

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

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= CITY =================
exports.getByCity = async (req, res) => {
  try {
    const cityMap = {
      lucknow: "लखनऊ",
      kanpur: "कानपुर",
      ayodhya: "अयोध्या",
      agra: "आगरा",
      varanasi: "वाराणसी",
      gorakhpur: "गोरखपुर",
      prayagraj: "प्रयागराज",
      ghaziabad: "गाज़ियाबाद",
    };

    const city = cityMap[req.params.city];

    if (!city) {
      return res.status(404).json({ msg: "City not found" });
    }

    const news = await News.find({
      status: "approved",
      tags: {
        $elemMatch: {
          $regex: new RegExp(`^${city}$`, "i"),
        },
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= SECTION =================
exports.getBySection = async (req, res) => {
  try {
    const section = req.params.section.toLowerCase();

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

    res.json(news);
  } catch (err) {
    console.error("Section Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= SINGLE =================
exports.getSingleNews = async (req, res) => {
  try {
    // 🔥 ATOMIC VIEW INCREMENT (FAST + SAFE)
    const news = await News.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!news) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= UPDATE =================
// ================= UPDATE =================
exports.updateNews = async (req, res) => {
  try {
    const {
      content,
      images,
      youtubeUrl,
      title,
      sections,
      categories,
      tags,
    } = req.body;

    const updateData = {
      ...(content && { content }),
      ...(youtubeUrl && { youtubeUrl }),
    };

    // ✅ IMAGES
    if (images) {
      const imgArray = Array.isArray(images) ? images : [];
      updateData.images = imgArray;
      updateData.image = imgArray.length > 0 ? imgArray[0] : "";
    }

    // ✅ TITLE + SLUG
    if (title) {
      const uniqueId = Math.random().toString(36).substring(2, 6);

      updateData.title = title;
      updateData.slug =
        slugify(title, { lower: true, strict: true }) +
        "-" +
        Date.now() +
        "-" +
        uniqueId;
    }

    // ✅ SECTIONS
    if (sections) {
      updateData.sections = Array.isArray(sections)
        ? sections.map((s) => s.toLowerCase())
        : [];
    }

    // ✅ 🔥 ADD THIS (IMPORTANT)
    if (categories) {
      updateData.categories = Array.isArray(categories)
        ? categories
        : [];
    }

    if (tags) {
      updateData.tags = Array.isArray(tags)
        ? tags
        : [];
    }

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "News not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Update failed" });
  }
};

// ================= PENDING =================
exports.getPendingNews = async (req, res) => {
  try {
    const news = await News.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= APPROVE =================
exports.approveNews = async (req, res) => {
  try {
    const { comment } = req.body;

    const news = await News.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        adminComment: comment || "",
      },
      { new: true },
    );

    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= DELETE =================
exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "News not found" });
    }

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET BY ID =================
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).lean();

    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
