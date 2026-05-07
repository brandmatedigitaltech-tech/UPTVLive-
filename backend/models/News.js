const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    // ================= TITLE =================
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
      index: true,
    },

    // ================= CONTENT =================
    content: {
      type: String,
      required: true,
      default: "",
    },

    // ================= SEO SLUG =================
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // ================= CATEGORY =================
    categories: {
      type: [String],
      default: [],
      index: true,
    },

    // ================= TAGS / CITY =================
    tags: {
      type: [String],
      default: [],
      index: true,
    },

    // ================= HOME SECTIONS =================
    sections: {
      type: [String],
      default: [],
      index: true,
    },

    // ================= MAIN IMAGE =================
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= MULTIPLE IMAGES =================
    images: {
      type: [String],
      default: [],
    },

    // ================= YOUTUBE =================
    youtubeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
      index: true,
    },

    // ================= VIEWS =================
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ================= AUTHOR =================
    author: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    // ================= ADMIN COMMENT =================
    adminComment: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= SEO DESCRIPTION =================
    seoDescription: {
      type: String,
      default: "",
      maxlength: 300,
    },

    // ================= FEATURED =================
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    // ✅ FASTER JSON
    minimize: false,
  }
);

// ================= AUTO IMAGE FALLBACK =================
newsSchema.pre("save", function (next) {
  // ✅ AUTO MAIN IMAGE
  if ((!this.image || this.image === "") && this.images.length > 0) {
    this.image = this.images[0];
  }

  // ✅ REMOVE DUPLICATE IMAGES
  if (Array.isArray(this.images)) {
    this.images = [...new Set(this.images)];
  }

  next();
});

// ================= INDEXES =================

// 🔥 FAST ARTICLE SEARCH
newsSchema.index({ slug: 1 });

// 🔥 HOMEPAGE SPEED
newsSchema.index({
  status: 1,
  createdAt: -1,
});

// 🔥 CATEGORY PAGE SPEED
newsSchema.index({
  categories: 1,
  createdAt: -1,
});

// 🔥 CITY PAGE SPEED
newsSchema.index({
  tags: 1,
  createdAt: -1,
});

// 🔥 SECTION SPEED
newsSchema.index({
  sections: 1,
  createdAt: -1,
});

// 🔥 SEARCH SPEED
newsSchema.index({
  title: "text",
  content: "text",
});

// ================= EXPORT =================
module.exports = mongoose.model("News", newsSchema);