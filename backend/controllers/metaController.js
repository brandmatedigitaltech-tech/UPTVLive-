const Category = require("../models/Category");
const Tag = require("../models/Tag");

// CATEGORY
exports.getCategories = async (req, res) => {
  const data = await Category.find();
  res.json(data);
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  let cat = await Category.findOne({ name });

  if (!cat) {
    cat = await Category.create({ name });
  }

  res.json(cat);
};

// TAG
exports.getTags = async (req, res) => {
  const data = await Tag.find();
  res.json(data);
};

exports.addTag = async (req, res) => {
  const { name } = req.body;

  let tag = await Tag.findOne({ name });

  if (!tag) {
    tag = await Tag.create({ name });
  }

  res.json(tag);
};