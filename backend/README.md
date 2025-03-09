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
