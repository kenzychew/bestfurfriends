const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateJWT);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/", addToCart);

// Update cart item quantity
router.put("/:itemId", updateCartItem);

// Remove item from cart
router.delete("/:itemId", removeCartItem);

// Clear entire cart
router.delete("/", clearCart);

module.exports = router;
