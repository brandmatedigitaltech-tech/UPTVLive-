const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// 🔥 MEMORY STORAGE (IMPORTANT)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================= MULTIPLE UPLOAD =================
router.post("/upload-multiple", upload.array("images", 10), async (req, res) => {
  try {
    console.log("FILES:", req.files); // 🔥 DEBUG

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded ❌" });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        if (!file.buffer) {
          return reject(new Error("File buffer missing ❌"));
        }

        const stream = cloudinary.uploader.upload_stream(
          { folder: "news" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Error:", error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.json({ images: urls });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ msg: err.message || "Upload failed ❌" });
  }
});

module.exports = router;