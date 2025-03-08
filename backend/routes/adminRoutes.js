const express = require("express");
const {
  // User management
  getAllUsers,
  updateUser,
  deleteUser,

  // Product management
  createProduct,
  updateProduct,
  deleteProduct,

  // Order management
  getAllOrders,
  updateOrderStatus,

  // Category management
  createCategory,
  updateCategory,
  deleteCategory,

  // Dashboard
  getDashboardStats,
} = require("../controllers/adminController");
const { authenticateJWT } = require("../middleware/auth");
const { checkAdmin } = require("../middleware/admin");
const { productValidation, validateRequest } = require("../utils/validators");

const router = express.Router();

// All routes in this file require authentication and admin privileges
router.use(authenticateJWT, checkAdmin);

// Dashboard statistics
router.get("/dashboard", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Product Management
router.post("/products", productValidation, validateRequest, createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Order Management
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

// Category Management
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
