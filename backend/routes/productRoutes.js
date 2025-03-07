const express = require("express");
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
} = require("../controllers/productController");
const {
  getProductReviews,
  addReview,
} = require("../controllers/reviewController");
const { authenticateJWT } = require("../middleware/auth");
const { reviewValidation, validateRequest } = require("../utils/validators");

const router = express.Router();

// Get all products with filtering and pagination
router.get("/", getProducts);

// Get featured products
router.get("/featured", getFeaturedProducts);

// Search products by name or description
router.get("/search", searchProducts);

// Get a single product by ID
router.get("/:id", getProductById);

// Get reviews for a product
router.get("/:productId/reviews", getProductReviews);

// Add a review for a product
router.post(
  "/:productId/reviews",
  authenticateJWT,
  reviewValidation,
  validateRequest,
  addReview
);

module.exports = router;
