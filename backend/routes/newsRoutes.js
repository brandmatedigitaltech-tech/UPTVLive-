const express = require("express");
const router = express.Router();

// 🔥 CLOUDINARY UPLOAD MIDDLEWARE
const upload = require("../middleware/upload");

// 🔥 IMPORT CONTROLLERS
const {
  createNews,
  getNews,
  getSingleNews,
  getPendingNews,
  approveNews,
  deleteNews,
  getByCategory,
  getByCity,
  getApprovedNews,
  getBySection,
  getNewsById,
  updateNews,
} = require("../controllers/newsController");

// ================= UPLOAD ROUTES =================

// ✅ SINGLE IMAGE UPLOAD
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded ❌" });
    }

    return res.json({
      image: req.file.path, // 🔥 Cloudinary URL
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ msg: "Upload failed ❌" });
  }
});

// 🔥 MULTIPLE IMAGES UPLOAD


// ================= NEWS ROUTES =================

// 📝 CREATE NEWS
router.post("/", createNews);

// 📥 GET ALL NEWS
router.get("/", getNews);

// 🔍 GET BY ID
router.get("/id/:id", getNewsById);

// ✅ APPROVED NEWS
router.get("/approved", getApprovedNews);

// 📂 CATEGORY
router.get("/category/:category", getByCategory);

// 🏙 CITY
router.get("/city/:city", getByCity);

// 🔥 SECTION
router.get("/section/:section", getBySection);

// 🔐 ADMIN ROUTES
router.get("/pending", getPendingNews);
router.put("/approve/:id", approveNews);

// 🔥 UPDATE NEWS
router.put("/:id", updateNews);

// ❌ DELETE NEWS
router.delete("/:id", deleteNews);

// 📖 SINGLE NEWS (⚠️ ALWAYS LAST)
router.get("/:slug", getSingleNews);

module.exports = router;
