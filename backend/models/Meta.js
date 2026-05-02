const express = require("express");
const router = express.Router();

const {
  getCategories,
  addCategory,
  getTags,
  addTag,
} = require("../controllers/metaController");

// 📂 CATEGORY
router.get("/categories", getCategories);
router.post("/categories", addCategory);

// 🏷 TAGS
router.get("/tags", getTags);
router.post("/tags", addTag);

module.exports = router;