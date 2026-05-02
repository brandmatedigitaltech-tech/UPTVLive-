const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ msg: "No token ❌" });
    }

    // ✅ Extract token from "Bearer TOKEN"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // 🔐 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY_123"
    );

    // 🔥 Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(401).json({
      msg: "Invalid or expired token ❌",
    });
  }
};