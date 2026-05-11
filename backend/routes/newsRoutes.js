const auth =
require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

// ================= MIDDLEWARE =================
const upload = require("../middleware/upload");

// ================= CONTROLLERS =================
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
  getSeoData,
} = require("../controllers/newsController");

// ======================================================
// ================= IMAGE UPLOAD ROUTES =================
// ======================================================

// ✅ SINGLE IMAGE UPLOAD
router.post(
  "/upload",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          msg: "No file uploaded ❌",
        });
      }

      return res.json({
        image: req.file.path,
      });

    } catch (err) {
      console.error("Upload Error:", err);

      return res.status(500).json({
        msg: "Upload failed ❌",
      });
    }
  }
);

// ✅ MULTIPLE IMAGE UPLOAD
router.post(
  "/upload-multiple",
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          msg: "No files uploaded ❌",
        });
      }

      const images = req.files.map(
        (file) => file.path
      );

      return res.json({
        images,
      });

    } catch (err) {
      console.error(
        "Multiple Upload Error:",
        err
      );

      return res.status(500).json({
        msg: "Multiple upload failed ❌",
      });
    }
  }
);

// ======================================================
// ====================== NEWS ==========================
// ======================================================

// ✅ CREATE NEWS
const authMiddleware =
  require("../middleware/authMiddleware");

router.post(
  "/",
  auth,
  createNews
);

// ✅ GET ALL APPROVED NEWS
router.get("/", getNews);

// ✅ GET APPROVED
router.get("/approved", getApprovedNews);

// ✅ GET PENDING
router.get("/pending", getPendingNews);

// ✅ GET BY ID
router.get("/id/:id", getNewsById);

// ✅ SEO DATA
router.get("/seo/:slug", getSeoData);

// ✅ CATEGORY
router.get(
  "/category/:category",
  getByCategory
);

// ✅ CITY
router.get("/city/:city", getByCity);

// ✅ SECTION
router.get(
  "/section/:section",
  getBySection
);

// ======================================================
// ================= ADMIN ROUTES =======================
// ======================================================

// ✅ APPROVE NEWS
router.put(
  "/approve/:id",
  approveNews
);

// ✅ UPDATE NEWS
router.put("/:id", updateNews);

// ✅ DELETE NEWS
router.delete("/:id", deleteNews);

// ======================================================
// ================= SINGLE ARTICLE =====================
// ======================================================

// ⚠️ ALWAYS KEEP LAST
router.get("/:slug", getSingleNews);

module.exports = router;