const express = require("express");
const {
  getCategories,
  getCategoryById,
  getCategoryProducts,
} = require("../controllers/categoryController");

const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Get a single category by ID
router.get("/:id", getCategoryById);

// Get all products in a category
router.get("/:id/products", getCategoryProducts);

module.exports = router;
