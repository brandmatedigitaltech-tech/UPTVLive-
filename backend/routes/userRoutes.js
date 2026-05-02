const express = require("express");
const router = express.Router();

// 🔥 CONTROLLERS
const {
  createWriter,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");

// 🔐 AUTH MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");


// ================= ROUTES =================

// 🔥 GET ALL USERS (ADMIN ONLY)
router.get("/", authMiddleware, getAllUsers);

// ➕ CREATE WRITER (ADMIN ONLY)
router.post("/create", authMiddleware, createWriter);

// ❌ DELETE USER (ADMIN ONLY)
router.delete("/:id", authMiddleware, deleteUser);

// 🚫 BLOCK / UNBLOCK USER
router.put("/toggle/:id", authMiddleware, toggleUserStatus);


module.exports = router;