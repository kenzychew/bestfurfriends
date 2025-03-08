const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateJWT);

// Get user's wishlist
router.get("/", getWishlist);

// Add item to wishlist
router.post("/", addToWishlist);

// Remove item from wishlist
router.delete("/:productId", removeFromWishlist);

module.exports = router;
