const adminMiddleware = (req, res, next) => {
  try {
    // For now allow all users
    // Later we will check role
    next();
  } catch (err) {
    res.status(403).json({ msg: "Admin access denied" });
  }
};

module.exports = adminMiddleware;