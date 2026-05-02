const express = require("express");
const router = express.Router();

// 🔥 CONTROLLERS
const { register, login, logout } = require("../controllers/authController");

// 🔐 MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");


// ================= ROUTES =================

// 🔐 REGISTER (optional / admin use)
router.post("/register", register);

// 🔐 LOGIN
router.post("/login", login);

// 🔓 LOGOUT (🔥 IMPORTANT FIX)
router.post("/logout", authMiddleware, logout);


module.exports = router;