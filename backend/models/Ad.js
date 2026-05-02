const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // 🔥 TYPE
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    // 🔥 MEDIA
    mediaUrl: { type: String, required: true },
    redirectUrl: { type: String },

    // 🔥 MULTIPLE POSITIONS
    positions: [
      {
        type: String,
        enum: [
          "home_top",
          "home_middle",
          "home_bottom",

          "article_top",
          "article_middle",
          "article_bottom",

          "category_top",
          "category_inline",
          "category_bottom",

          "city_top",
          "city_inline",
          "city_bottom",

          "sidebar_top",
          "sidebar_middle",
          "sidebar_bottom",
        ],
      },
    ],

    // ================= STATUS =================
    isActive: { type: Boolean, default: true },

    // ================= SCHEDULING =================
    startDate: { type: Date },
    endDate: { type: Date },

    // ================= ANALYTICS =================
    impressions: { type: Number, default: 0 }, // 👁 views
    clicks: { type: Number, default: 0 }, // 🖱 clicks

    // ================= PRIORITY =================
    priority: { type: Number, default: 0 }, // 🔥 higher = show first

    // ================= OPTIONAL =================
    advertiser: { type: String }, // brand name
  },
  { timestamps: true }
);

// ================= INDEX (PERFORMANCE) =================
// 🔥 fast query for ads by position
adSchema.index({ positions: 1, isActive: 1 });

// 🔥 sorting by priority
adSchema.index({ priority: -1 });

// ================= VIRTUAL (CTR) =================
adSchema.virtual("ctr").get(function () {
  if (!this.impressions) return 0;
  return ((this.clicks / this.impressions) * 100).toFixed(2);
});

module.exports = mongoose.model("Ad", adSchema);