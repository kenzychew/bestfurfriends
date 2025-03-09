const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  adminLogin,
} = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  adminLoginValidation,
  validateRequest,
} = require("../utils/validators");

const router = express.Router();

// Register new user
router.post("/register", registerValidation, validateRequest, register);

// Login user & get token
router.post("/login", loginValidation, validateRequest, login);

// Admin login (secure endpoint)
router.post("/admin/login", adminLoginValidation, validateRequest, adminLogin);

// Request password reset
router.post("/forgot-password", forgotPassword);

// Reset password with token
router.post("/reset-password", resetPassword);

module.exports = router;
