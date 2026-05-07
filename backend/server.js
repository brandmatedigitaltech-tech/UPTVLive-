require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const connectDB = require("./config/db");

const app = express();

// ================= DB =================
connectDB();

// ================= CLOUDINARY =================

// ================= CORS (FIXED) =================
// =====================================================
// ================= CORS ==============================
// =====================================================

const allowedOrigins = [
  "https://www.uptvlive.com",
  "https://uptvlive.com",
  "https://api.uptvlive.com",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests without origin
      // (mobile apps / postman)

      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "CORS Not Allowed"
          )
        );
      }
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.options("*", cors());

app.options("*", cors());

// ================= BODY PARSER =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/meta", require("./routes/metaRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/", require("./routes/seoRoutes"));
// 🔥 FIXED (NO CONFLICT)
app.use("/api/upload", require("./routes/uploads"));

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

// ================= GLOBAL ERROR HANDLER =================
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