const router = require("express").Router();

const {
  createAd,
  getAdsByPosition,
  deleteAd,
  getAllAds,
  trackImpression,
  trackClick,
} = require("../controllers/adController");

// ================= CREATE =================
router.post("/", createAd);

// ================= GET ALL ADS (ADMIN) =================
router.get("/", getAllAds);

// ================= TRACKING (IMPORTANT) =================
// 🔥 MUST BE ABOVE /:position
router.post("/impression/:id", trackImpression);
router.post("/click/:id", trackClick);

// ================= GET BY POSITION =================
router.get("/:position", getAdsByPosition);

// ================= DELETE =================
router.delete("/:id", deleteAd);

module.exports = router;