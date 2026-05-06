const Category = require("../models/Category");
const Tag = require("../models/Tag");
const City = require("../models/City");

// ================= CATEGORY =================

// GET CATEGORY
exports.getCategories = async (req, res) => {
  try {
    const data = await Category.find().sort({ name: 1 });

    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to fetch categories",
    });
  }
};

// ADD CATEGORY
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        msg: "Category name required",
      });
    }

    let cat = await Category.findOne({
      name: name.trim(),
    });

    if (!cat) {
      cat = await Category.create({
        name: name.trim().toLowerCase(),
      });
    }

    res.json(cat);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to add category",
    });
  }
};

// ================= TAG =================

// GET TAGS
exports.getTags = async (req, res) => {
  try {
    const data = await Tag.find().sort({ name: 1 });

    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to fetch tags",
    });
  }
};

// ADD TAG
exports.addTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        msg: "Tag name required",
      });
    }

    let tag = await Tag.findOne({
      name: name.trim(),
    });

    if (!tag) {
      tag = await Tag.create({
        name: name.trim(),
      });
    }

    res.json(tag);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to add tag",
    });
  }
};

// ================= CITY =================

// GET CITIES
exports.getCities = async (req, res) => {
  try {
    const data = await City.find().sort({ name: 1 });

    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to fetch cities",
    });
  }
};

// ADD CITY
exports.addCity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        msg: "City name required",
      });
    }

    let city = await City.findOne({
      name: name.trim(),
    });

    if (!city) {
      city = await City.create({
        name: name.trim(),
      });
    }

    res.json(city);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Failed to add city",
    });
  }
};