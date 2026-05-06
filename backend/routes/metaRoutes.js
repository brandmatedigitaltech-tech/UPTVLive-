const express = require("express");

const router = express.Router();

const {
  getCategories,
  addCategory,
  deleteCategory,

  getTags,
  addTag,

  getCities,
  addCity,
  deleteCity,

} = require("../controllers/metaController");

// ================= CATEGORY =================

// GET
router.get(
  "/categories",
  getCategories
);

// ADD
router.post(
  "/categories",
  addCategory
);

// DELETE
router.delete(
  "/categories/:id",
  deleteCategory
);

// ================= TAG =================

router.get(
  "/tags",
  getTags
);

router.post(
  "/tags",
  addTag
);

// ================= CITY =================

// GET
router.get(
  "/cities",
  getCities
);

// ADD
router.post(
  "/cities",
  addCity
);

// DELETE
router.delete(
  "/cities/:id",
  deleteCity
);

module.exports = router;