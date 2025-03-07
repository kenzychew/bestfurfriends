const { Product, Category, Review, User } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
  getPagination,
  getPaginationData,
} = require("../utils/helpers");

//* Product management
// Gets all products with optional filtering, sorting and pagination
// Supports filtering by category, price range, and sorting by various fields
// GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder = "ASC",
    } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    // Build filter conditions
    const whereConditions = {};
    if (category) {
      whereConditions.category_id = category;
    }
    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price[Op.gte] = minPrice;
      if (maxPrice) whereConditions.price[Op.lte] = maxPrice;
    }

    // Build sort options
    const order = [];
    if (sortBy) {
      const validColumns = ["name", "price", "created_at"];
      const validOrders = ["ASC", "DESC"];

      if (
        validColumns.includes(sortBy) &&
        validOrders.includes(sortOrder.toUpperCase())
      ) {
        order.push([sortBy, sortOrder.toUpperCase()]);
      }
    }

    // Default sort if not specified
    if (order.length === 0) {
      order.push(["created_at", "DESC"]);
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Review,
          attributes: ["rating"],
          required: false,
        },
      ],
      limit: limitValue,
      offset,
      order,
      distinct: true,
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const productData = formatModelResponse(product);

      // Calculate average rating
      const reviews = product.Reviews || [];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        productData.average_rating = totalRating / reviews.length;
      } else {
        productData.average_rating = 0;
      }

      productData.review_count = reviews.length;

      return productData;
    });

    const paginationData = getPaginationData(count, page, limitValue);

    res.status(200).json(
      successResponse("Products retrieved successfully", {
        products: productsWithRating,
        pagination: paginationData,
      })
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json(errorResponse("Failed to retrieve products"));
  }
};

// Gets featured products that are marked as featured=true
// Useful for homepage showcase section
// GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.findAll({
      where: { featured: true },
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Review,
          attributes: ["rating"],
          required: false,
        },
      ],
      limit: parseInt(limit),
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const productData = formatModelResponse(product);

      // Calculate average rating
      const reviews = product.Reviews || [];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        productData.average_rating = totalRating / reviews.length;
      } else {
        productData.average_rating = 0;
      }

      productData.review_count = reviews.length;

      return productData;
    });

    res
      .status(200)
      .json(
        successResponse(
          "Featured products retrieved successfully",
          productsWithRating
        )
      );
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json(errorResponse("Failed to retrieve featured products"));
  }
};

// Gets a single product with all its details, reviews and author info
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Review,
          include: [
            {
              model: User,
              attributes: ["first_name", "last_name"],
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    const productData = formatModelResponse(product);

    // Calculate average rating
    const reviews = product.Reviews || [];
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      productData.average_rating = totalRating / reviews.length;
    } else {
      productData.average_rating = 0;
    }

    productData.review_count = reviews.length;

    res
      .status(200)
      .json(successResponse("Product retrieved successfully", productData));
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json(errorResponse("Failed to retrieve product"));
  }
};

// Searches products by name or description text
// Supports pagination and returns formatted results with rating data
// GET /api/products/search?q=searchterm
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json(errorResponse("Search query is required"));
    }

    const { limit: limitValue, offset } = getPagination(page, limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Review,
          attributes: ["rating"],
          required: false,
        },
      ],
      limit: limitValue,
      offset,
      distinct: true,
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const productData = formatModelResponse(product);

      // Calculate average rating
      const reviews = product.Reviews || [];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        productData.average_rating = totalRating / reviews.length;
      } else {
        productData.average_rating = 0;
      }

      productData.review_count = reviews.length;

      return productData;
    });

    const paginationData = getPaginationData(count, page, limitValue);

    res.status(200).json(
      successResponse("Search results retrieved successfully", {
        products: productsWithRating,
        pagination: paginationData,
      })
    );
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json(errorResponse("Failed to search products"));
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
};
