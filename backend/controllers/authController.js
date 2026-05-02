// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // ================= REGISTER =================
// exports.register = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ msg: "Email & Password required" });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashed,
//       role: role || "writer",
//     });

//     res.json({
//       msg: "User created ✅",
//       user,
//     });

//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };


// // ================= LOGIN =================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 🔍 INCLUDE PASSWORD (IMPORTANT FIX)
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     // 🚫 BLOCK CHECK
//     if (!user.isActive) {
//       return res.status(403).json({ msg: "User is blocked 🚫" });
//     }

//     // 🔑 PASSWORD CHECK
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: "Wrong password ❌" });
//     }

//     // 🔥 UPDATE LOGIN STATUS
//     user.isOnline = true;
//     user.lastLogin = new Date();
//     await user.save();

//     // 🎟️ TOKEN
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET || "SECRET_KEY_123",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         isOnline: user.isOnline,
//         lastLogin: user.lastLogin,
//       },
//     });

//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };


// // ================= LOGOUT =================
// exports.logout = async (req, res) => {
//   try {
//     // 🔥 GET USER FROM TOKEN (CORRECT WAY)
//     const userId = req.user.id;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     // 🔥 UPDATE LOGOUT STATUS
//     user.isOnline = false;
//     user.lastLogout = new Date();

//     await user.save();

//     res.json({ msg: "Logged out successfully ✅" });

//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };




const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // ✅ normalize email
    email = email.toLowerCase().trim();

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
      role: role || "writer",
    });

    res.json({
      msg: "User created ✅",
      user,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ normalize email
    email = email.toLowerCase().trim();

    console.log("LOGIN EMAIL:", email);

    const user = await User.findOne({ email }).select("+password");

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({ msg: "User not found ❌" });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: "User is blocked 🚫" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password ❌" });
    }

    user.isOnline = true;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "SECRET_KEY_123",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isOnline: user.isOnline,
        lastLogin: user.lastLogin,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};


// ================= LOGOUT =================
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isOnline = false;
    user.lastLogout = new Date();

    await user.save();

    res.json({ msg: "Logged out successfully ✅" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
