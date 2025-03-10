# BestFurFriends Backend API

This is the Express.js backend API for the BestFurFriends e-commerce application.

## Setup and Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- PostgreSQL database

### Installation Steps

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example`
5. Set up your PostgreSQL database and update the `.env` with your database URL
6. Run the development server:

```bash
npm run dev
```

## Simplified Checkout Flow

The current implementation uses a simplified checkout flow without payment processing:

### Features

- Orders are created and stored in the database
- Orders are immediately marked as "confirmed" (skipping payment processing)
- The full order lifecycle is supported (confirm, cancel, track)
- All order items and details are tracked

### Order Statuses

- `confirmed`: Order has been placed and confirmed (default in simplified flow)
- `processing`: Order is being processed
- `shipped`: Order has been shipped
- `delivered`: Order has been delivered
- `cancelled`: Order has been cancelled
- `pending_payment`: Reserved for future payment implementation

### Adding Payment Processing Later

When ready to implement payment processing:

1. Uncomment the Stripe integration in `orderController.js`
2. Modify the `createOrder` function to set orders to `pending_payment` status initially
3. Use the existing `confirmOrder` endpoint to change status after successful payment

### API Endpoints

- `POST /api/orders`: Create a new order
- `GET /api/orders`: Get all orders for the current user
- `GET /api/orders/:id`: Get details for a specific order
- `PUT /api/orders/:id/cancel`: Cancel an order
- `PUT /api/orders/:id/confirm`: Confirm an order (for future payment implementation)

## API Documentation

The API follows RESTful principles and provides endpoints for user authentication, product management, cart functionality, orders, and more.

### Base URL

- Development: `http://localhost:5000/api`
- Production: Your deployed API URL

### Authentication Endpoints

```
POST /auth/register         - Register a new user
POST /auth/login            - User login (returns JWT)
POST /auth/forgot-password  - Initiate password reset
POST /auth/reset-password   - Complete password reset
```

### User Endpoints

```
GET    /users/profile       - Get current user profile
PUT    /users/profile       - Update user profile
GET    /users/orders        - Get user's order history
```

### Product Endpoints

```
GET    /products                - Get all products (with filtering and pagination)
GET    /products/featured       - Get featured products
GET    /products/:id            - Get a single product by ID
GET    /products/search?q=term  - Search products by name/description
GET    /categories              - Get all product categories
GET    /categories/:id/products - Get products in a category
```

### Review Endpoints

```
GET    /products/:id/reviews    - Get reviews for a product
POST   /products/:id/reviews    - Add a review for a product
DELETE /reviews/:id             - Delete a user's review
```

### Cart Endpoints

```
GET    /cart                    - Get user's cart
POST   /cart                    - Add item to cart
PUT    /cart/:itemId            - Update cart item quantity
DELETE /cart/:itemId            - Remove item from cart
DELETE /cart                    - Clear entire cart
```

### Wishlist Endpoints

```
GET    /wishlist                - Get user's wishlist
POST   /wishlist                - Add item to wishlist
DELETE /wishlist/:productId     - Remove item from wishlist
```

### Order Endpoints

```
POST   /orders                  - Create a new order
GET    /orders/:id              - Get order details
PUT    /orders/:id/cancel       - Cancel an order
```

### Admin Endpoints

```
GET    /admin/users             - Get all users (admin only)
PUT    /admin/users/:id         - Update user (admin only)
DELETE /admin/users/:id         - Delete user (admin only)

POST   /admin/products          - Create new product
PUT    /admin/products/:id      - Update product
DELETE /admin/products/:id      - Delete product

GET    /admin/orders            - Get all orders
PUT    /admin/orders/:id        - Update order status
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API returns consistent error responses with the following format:

```json
{
  "success": false,
  "message": "Error message description",
  "errors": [] // Optional array of validation errors
}
```

## Development and Testing

- Run the development server with hot reload:

  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  npm test
  ```

## References and Resources

### Core Technologies

- [Node.js](https://nodejs.org/en/docs/) - JavaScript runtime environment
- [Express](https://expressjs.com/en/api.html) - Web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/docs/) - Relational database

### ORM and Database

- [Sequelize](https://sequelize.org/master/) - Promise-based ORM for Node.js
- [Sequelize Associations](https://sequelize.org/master/manual/assocs.html) - Model associations documentation
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html) - Reference for column data types
- [PostgreSQL Common Table Expression](https://neon.tech/postgresql/postgresql-tutorial/postgresql-cte) - Reference for CTE

### Authentication & Security

- [JSON Web Tokens](https://jwt.io/introduction/) - Industry standard for secure authentication
- [Passport.js](http://www.passportjs.org/docs/) - Authentication middleware for Node.js
- [Passport-JWT](http://www.passportjs.org/packages/passport-jwt/) - JWT authentication strategy
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) - Library for password hashing

### File & Image Handling

- [Cloudinary](https://cloudinary.com/documentation) - Cloud-based image management
- [Multer](https://github.com/expressjs/multer#readme) - Middleware for handling multipart/form-data

### API Architecture

- [REST API Best Practices](https://restfulapi.net/) - Guidelines for RESTful API design
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) - Standard HTTP response codes

### Testing & Development

- [Postman](https://learning.postman.com/docs/getting-started/introduction/) - API testing tool
- [Dotenv](https://github.com/motdotla/dotenv#readme) - Environment variable management

### E-commerce Resources

- [Stripe Payment Integration](https://stripe.com/docs/api) - Official Stripe API documentation
- [Stripe Checkout](https://stripe.com/docs/checkout) - Documentation for implementing Stripe Checkout

### Code Quality & Patterns

- [Express Project Structure](https://expressjs.com/en/guide/routing.html) - Official guide on structuring Express apps
- [JavaScript Error Handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) - Best practices for handling errors
- [MVC Pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC) - Model-View-Controller architectural pattern
