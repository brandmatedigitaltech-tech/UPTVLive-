const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    // ❌ No token
    if (!authHeader) {

      return res.status(401).json({
        msg: "No token ❌",
      });
    }

    // ✅ Extract token
    const token =
      authHeader.startsWith("Bearer ")

        ? authHeader.split(" ")[1]

        : authHeader;

    // 🔐 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY_123"
    );

    // ✅ Get full user from database
    const user =
      await User.findById(decoded.id);

    if (!user) {

      return res.status(401).json({
        msg: "User not found ❌",
      });
    }

    // ✅ Attach full user object
    req.user = user;

    next();

  } catch (err) {

    console.error(
      "Auth Error:",
      err.message
    );

    return res.status(401).json({
      msg:
        "Invalid or expired token ❌",
    });
  }
};