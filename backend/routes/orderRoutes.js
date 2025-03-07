const express = require("express");
const {
  createOrder,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");
const { authenticateJWT } = require("../middleware/auth");
const { orderValidation, validateRequest } = require("../utils/validators");

const router = express.Router();

router.use(authenticateJWT);

// Create a new order
router.post("/", orderValidation, validateRequest, createOrder);

// Get order details
router.get("/:id", getOrderById);

// Cancel an order
router.put("/:id/cancel", cancelOrder);

module.exports = router;
