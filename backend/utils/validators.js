const { check, validationResult } = require("express-validator");

// Middleware that checks for validation errors
// Use this after your validation rules in route definitions
// Returns 400 Bad Request with error details if validation fails
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Rules for user registration
// Ensures email is valid, password is secure, names are provided
// Usage: router.post('/register', registerValidation, validateRequest, register)
const registerValidation = [
  check("email", "Valid email is required").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  check("first_name", "First name is required").notEmpty(),
  check("last_name", "Last name is required").notEmpty(),
];

// Rules for user login
// Validates email format and ensures password is provided
// Usage: router.post('/login', loginValidation, validateRequest, login)
const loginValidation = [
  check("email", "Valid email is required").isEmail(),
  check("password", "Password is required").notEmpty(),
];

// Rules for product creation/updates
// Ensures all required product fields have valid data
// Usage: router.post('/products', productValidation, validateRequest, createProduct)
const productValidation = [
  check("name", "Product name is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  check("price", "Valid price is required").isNumeric(),
  check("stock_quantity", "Valid stock quantity is required").isInt({ min: 0 }),
  check("category_id", "Valid category is required").isInt(),
];

// Rules for product reviews
// Ensures rating is a number between 1-5
// Usage: router.post('/reviews', reviewValidation, validateRequest, addReview)
const reviewValidation = [
  check("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
];

// Rules for order creation
// Ensures necessary order info is provided
// Usage: router.post('/orders', orderValidation, validateRequest, createOrder)
const orderValidation = [
  check("shipping_address", "Shipping address is required").notEmpty(),
  check("billing_address", "Billing address is required").notEmpty(),
  check("payment_method", "Payment method is required").notEmpty(),
];

module.exports = {
  validateRequest,
  registerValidation,
  loginValidation,
  productValidation,
  reviewValidation,
  orderValidation,
};
