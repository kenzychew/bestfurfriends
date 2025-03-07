// Creates a standardized error response object
// Use this for all API error responses to maintain consistency
// message: text to show the user, statusCode: defaults to 500
const errorResponse = (message, statusCode = 500) => {
  return {
    success: false,
    message,
  };
};

// Create standardized success response object
// message: success message, data: any data to return to the client
const successResponse = (message, data = {}) => {
  return {
    success: true,
    message,
    data,
  };
};

// Converts a Sequelize model instance to a plain object
// Formats date fields to ISO strings
//! Call this before sending model data in API res
const formatModelResponse = (model) => {
  const data = model.toJSON ? model.toJSON() : model;

  // Format date fields if present
  if (data.created_at) {
    data.created_at = new Date(data.created_at).toISOString();
  }
  if (data.updated_at) {
    data.updated_at = new Date(data.updated_at).toISOString();
  }

  return data;
};

// Calculates offset and limit for pagination
// page: current page (starts at 1), limit: items per page
// Returns object with limit and offset for use in Sequelize queries
const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

// Creates pagination metadata for API responses
// Used to provide pagination info alongside results
// count: total items, page: current page, limit: items per page
const getPaginationData = (count, page, limit) => {
  const totalItems = count;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage: limit,
  };
};

module.exports = {
  errorResponse,
  successResponse,
  formatModelResponse,
  getPagination,
  getPaginationData,
};
