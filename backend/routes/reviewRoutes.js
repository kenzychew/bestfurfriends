const express = require("express");
const { deleteReview } = require("../controllers/reviewController");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Delete a review (requires authentication)
router.delete("/:reviewId", authenticateJWT, deleteReview);

module.exports = router;
