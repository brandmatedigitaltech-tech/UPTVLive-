require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const connectDB = require("./config/db");

const app = express();

// ================= CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ================= DB =================
connectDB();

// ================= CORS =================
const allowedOrigins = [
  "https://uptv-live.vercel.app",
  "https://uptvlive.com",
  "https://www.uptvlive.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl

    // if (allowedOrigins.includes(origin)) {
    //   return callback(null, true);
    // } else {
    //   return callback(new Error("CORS not allowed ❌"));
    // }
    const corsOptions = {
  origin: true, // 🔥 allow all (safe for now)
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ================= BODY PARSER =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/meta", require("./routes/metaRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    msg: "Route not found ❌",
  });
});

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    msg: err.message || "Server Error ❌",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
