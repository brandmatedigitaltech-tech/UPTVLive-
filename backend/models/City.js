const mongoose = require("mongoose");
const slugify = require("slugify");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 AUTO GENERATE SLUG
citySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  next();
});

module.exports = mongoose.model("City", citySchema);