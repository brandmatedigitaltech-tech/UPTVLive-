const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true, // 🔥 faster search
    },

    categories: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    // ✅ SECTIONS (Hero, Breaking, Special etc)
    sections: {
      type: [String],
      default: [],
    },

    // 🔥 SINGLE IMAGE (BACKWARD SUPPORT)
    image: {
      type: String,
      default: "",
    },

    // 🔥 MULTIPLE IMAGES (MAIN FEATURE)
    images: {
      type: [String],
      default: [],
    },

    // 🎬 YOUTUBE VIDEO
    youtubeUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved"], // 🔥 prevent wrong values
      default: "pending",
      index: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    author: {
      type: String,
      default: "Unknown",
    },

    adminComment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", newsSchema);