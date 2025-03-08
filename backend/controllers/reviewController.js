const { Review, Product, User } = require("../models");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
} = require("../utils/helpers");

// Gets all reviews for a specific product
// Includes user info and calculates the average rating
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Get reviews
    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const formattedReviews = reviews.map((review) =>
      formatModelResponse(review)
    );

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = totalRating / reviews.length;
    }

    res.status(200).json(
      successResponse("Reviews retrieved successfully", {
        reviews: formattedReviews,
        average_rating: averageRating,
        review_count: reviews.length,
      })
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json(errorResponse("Failed to retrieve reviews"));
  }
};

// Adds a new review for a product
// Checks if user already reviewed this product to prevent duplicates
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.user_id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { product_id: productId, user_id: userId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json(errorResponse("You have already reviewed this product"));
    }

    // Create review
    const review = await Review.create({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    });

    // Get the review with user details
    const savedReview = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
    });

    res
      .status(201)
      .json(
        successResponse(
          "Review added successfully",
          formatModelResponse(savedReview)
        )
      );
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json(errorResponse("Failed to add review"));
  }
};

// Deletes a review
// Only allows the review author or an admin to delete
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.user_id;

    // Find review
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json(errorResponse("Review not found"));
    }

    // Check if user is the owner of the review or an admin
    if (review.user_id !== userId && !req.user.is_admin) {
      return res
        .status(403)
        .json(errorResponse("Not authorized to delete this review"));
    }

    // Delete review
    await review.destroy();

    res.status(200).json(successResponse("Review deleted successfully"));
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json(errorResponse("Failed to delete review"));
  }
};

// GET /api/products/:productId/reviews
// POST /api/products/:productId/reviews
// DELETE /api/reviews/:reviewId
module.exports = {
  getProductReviews,
  addReview,
  deleteReview,
};
