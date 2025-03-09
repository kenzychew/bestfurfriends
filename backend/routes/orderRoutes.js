const express = require("express");
const {
  createOrder,
  getOrderById,
  cancelOrder,
  confirmOrder,
  getUserOrders,
} = require("../controllers/orderController");
const { authenticateJWT } = require("../middleware/auth");
const { orderValidation, validateRequest } = require("../utils/validators");

const router = express.Router();

router.use(authenticateJWT);

// Get all orders for the current user
router.get("/", getUserOrders);

// Create a new order
router.post("/", orderValidation, validateRequest, createOrder);

// Get order details
router.get("/:id", getOrderById);

// Cancel an order
router.put("/:id/cancel", cancelOrder);

// Confirm an order (to be used after payment processing is implemented)
router.put("/:id/confirm", confirmOrder);

module.exports = router;
