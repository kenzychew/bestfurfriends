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

const router = express.Router();

// Register new user
router.post("/register", registerValidation, validateRequest, register);

// Login user & get token
router.post("/login", loginValidation, validateRequest, login);

// Request password reset
router.post("/forgot-password", forgotPassword);

// Reset password with token
router.post("/reset-password", resetPassword);

module.exports = router;
