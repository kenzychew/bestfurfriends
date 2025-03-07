const express = require("express");
const {
  getProfile,
  updateProfile,
  getOrderHistory,
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// All routes in this file use the authenticateJWT middleware
router.use(authenticateJWT);

// Get current user profile
router.get("/profile", getProfile);

// Update user profile
router.put("/profile", updateProfile);

// Get user's order history
router.get("/orders", getOrderHistory);

module.exports = router;
