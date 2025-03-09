const passport = require("passport");
const jwt = require("jsonwebtoken");

//* Authentication middleware using Passport JWT strategy
const authenticateJWT = passport.authenticate("jwt", { session: false });

// Middleware to verify admin rights after JWT authentication
const requireAdmin = (req, res, next) => {
  // User should already be authenticated by authenticateJWT
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Check if user has admin rights
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  // User is authenticated and has admin rights
  next();
};

// Generate JWT token for authenticated users
const generateToken = (user) => {
  const payload = {
    id: user.user_id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    isAdmin: user.is_admin,
  };
  // Returns a JWT token object
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Generate admin-specific JWT token with extra security measures
const generateAdminToken = (user) => {
  if (!user.is_admin) {
    throw new Error("Cannot generate admin token for non-admin user");
  }

  const payload = {
    id: user.user_id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    isAdmin: true,
    role: "admin", // Additional role claim for admin users
  };

  // Admin tokens have shorter expiry for enhanced security
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
};

module.exports = {
  authenticateJWT,
  requireAdmin,
  generateToken,
  generateAdminToken,
};
