const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  validateRequest,
} = require("../utils/validators");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Register new user
router.post("/register", registerValidation, validateRequest, register);

// Login user & get token
router.post("/login", loginValidation, validateRequest, login);

// Request password reset
router.post("/forgot-password", forgotPassword);

// Reset password with token
router.post("/reset-password", resetPassword);

// Debug route to check token information
router.get("/debug-token", authenticateJWT, (req, res) => {
  // Extract token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No token provided",
    });
  }

  // Get decoded information
  const tokenInfo = verifyToken(token);

  // Return user and token information
  res.json({
    success: true,
    message: "Token information",
    data: {
      token: {
        ...tokenInfo,
        // Don't send the JWT secret in the response for security
        decoded: tokenInfo.decoded
          ? {
              ...tokenInfo.decoded,
              iat: new Date(tokenInfo.decoded.iat * 1000).toISOString(),
              exp: new Date(tokenInfo.decoded.exp * 1000).toISOString(),
            }
          : null,
      },
      user: req.user
        ? {
            id: req.user.user_id,
            email: req.user.email,
            firstName: req.user.first_name,
            lastName: req.user.last_name,
            isAdmin: req.user.is_admin,
            // Include both formats for debugging
            is_admin: req.user.is_admin,
          }
        : null,
    },
  });
});

module.exports = router;
