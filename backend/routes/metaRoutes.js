const express = require("express");

const router = express.Router();

const {
  getCategories,
  addCategory,
  getTags,
  addTag,
  getCities,
  addCity,
} = require("../controllers/metaController");

// ================= CATEGORY =================
router.get("/categories", getCategories);

router.post("/categories", addCategory);

// ================= TAG =================
router.get("/tags", getTags);

router.post("/tags", addTag);

// ================= CITY =================
router.get("/cities", getCities);

router.post("/cities", addCity);

module.exports = router;