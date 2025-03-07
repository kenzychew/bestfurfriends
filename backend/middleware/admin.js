//! Admin authorization middleware
// Checks if authenticated user has admin privileges

const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required",
    });
  }
  next();
};

module.exports = { checkAdmin };
