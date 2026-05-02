const Ad = require("../models/Ad");

// ================= CREATE AD =================
exports.createAd = async (req, res) => {
  try {
    const { positions } = req.body;

    if (!positions || positions.length === 0) {
      return res.status(400).json({
        msg: "Select at least one position ❌",
      });
    }

    // ❌ REMOVE OLD DELETE LOGIC (IMPORTANT)
    // 👉 now multiple ads allowed

    const newAd = await Ad.create(req.body);

    res.json(newAd);
  } catch (err) {
    console.error("Create Ad Error:", err);
    res.status(500).json({ msg: "Failed to create ad ❌" });
  }
};

// ================= GET ADS BY POSITION =================
exports.getAdsByPosition = async (req, res) => {
  try {
    const { position } = req.params;

    const now = new Date();

    // 🔥 GET MULTIPLE ADS
    const ads = await Ad.find({
      positions: position,
      isActive: true,

      // 🔥 SCHEDULING FILTER
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } },
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } },
          ],
        },
      ],
    }).sort({ priority: -1, createdAt: -1 });

    res.json(ads); // 🔥 RETURN ALL ADS

  } catch (err) {
    console.error("Get Ads Error:", err);
    res.status(500).json({ msg: "Error fetching ads ❌" });
  }
};

// ================= GET ALL ADS =================
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error ❌" });
  }
};

// ================= DELETE =================
exports.deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ msg: "Ad deleted ✅" });
  } catch (err) {
    console.error("Delete Ad Error:", err);
    res.status(500).json({ msg: "Delete failed ❌" });
  }
};

// ================= TRACK IMPRESSION =================
exports.trackImpression = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { impressions: 1 },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Impression Error:", err);
    res.status(500).json({ msg: "Error ❌" });
  }
};

// ================= TRACK CLICK =================
exports.trackClick = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1 },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Click Error:", err);
    res.status(500).json({ msg: "Error ❌" });
  }
};