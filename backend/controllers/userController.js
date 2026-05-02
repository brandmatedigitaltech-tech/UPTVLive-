const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔐 ADMIN CHECK HELPER
const isAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ msg: "Access denied ❌" });
    return false;
  }
  return true;
};


// ================= CREATE WRITER =================
exports.createWriter = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email & Password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      role: "writer",
      isOnline: false, // 🔥 default
    });

    res.status(201).json({
      msg: "Writer created successfully ✅",
      user,
    });

  } catch (err) {
    console.error("Create Writer Error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};


// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);

  } catch (err) {
    console.error("Get Users Error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};


// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;

    const { id } = req.params;

    // ❌ Prevent self delete
    if (req.user.id === id) {
      return res.status(400).json({ msg: "You cannot delete yourself ❌" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ❌ Prevent deleting admin
    if (user.role === "admin") {
      return res.status(400).json({ msg: "Cannot delete admin ❌" });
    }

    // 🔥 FORCE OFFLINE BEFORE DELETE
    user.isOnline = false;
    await user.save();

    await user.deleteOne();

    res.json({ msg: "User deleted successfully ❌" });

  } catch (err) {
    console.error("Delete User Error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};


// ================= TOGGLE BLOCK USER =================
exports.toggleUserStatus = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ❌ Don't block admin
    if (user.role === "admin") {
      return res.status(400).json({ msg: "Cannot block admin ❌" });
    }

    // 🔥 TOGGLE STATUS
    user.isActive = !user.isActive;

    // 🚨 AUTO LOGOUT IF BLOCKED
    if (!user.isActive) {
      user.isOnline = false;
      user.lastLogout = new Date();
    }

    await user.save();

    res.json({
      msg: user.isActive
        ? "User unblocked ✅"
        : "User blocked & logged out 🚫",
      user,
    });

  } catch (err) {
    console.error("Toggle User Error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};