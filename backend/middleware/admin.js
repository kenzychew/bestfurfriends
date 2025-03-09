//! Admin authorization middleware
// Checks if authenticated user has admin privileges

// Legacy admin check function
const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required",
    });
  }
  next();
};

// Import the new requireAdmin middleware for compatibility
const { requireAdmin } = require("./auth");

module.exports = {
  checkAdmin,
  // Export the same function with both names for backward compatibility
  requireAdmin,
};
