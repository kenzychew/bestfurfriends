# BestFurFriends: PERN Stack Dog E-commerce Application

## Application Overview

BestFurFriends is a full-featured e-commerce platform for dog products using the PERN stack:

- **PostgreSQL**: Relational database for structured data storage
- **Express.js**: Backend API framework
- **React.js**: Frontend user interface library
- **Node.js**: JavaScript runtime for the server

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);

-- Products Table
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  stock_quantity INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(category_id),
  image_url VARCHAR(255),
  weight DECIMAL(10,2),
  weight_unit VARCHAR(10), -- g, kg, oz, lb
  ingredients TEXT,
  weight DECIMAL(10,2),
  weight_unit VARCHAR(10),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT NOT NULL,
  billing_address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id),
  product_id INTEGER REFERENCES products(product_id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Reviews Table
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id),
  user_id INTEGER REFERENCES users(user_id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  product_id INTEGER REFERENCES products(product_id),
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist Table
CREATE TABLE wishlist_items (
  wishlist_item_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  product_id INTEGER REFERENCES products(product_id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Backend API Structure (Express.js)

```
/backend
├── config
│   ├── db.js              # Database connection config
│   └── passport.js        # Authentication strategy
├── controllers
│   ├── authController.js  # User registration and login
│   ├── cartController.js  # Cart management
│   ├── orderController.js # Order processing
│   ├── productController.js # Product management
│   ├── reviewController.js  # Customer reviews
│   └── userController.js    # User profile management
├── middleware
│   ├── auth.js            # Authentication middleware
│   ├── admin.js           # Admin route protection
│   └── upload.js          # Image upload handling
├── routes
│   ├── auth.js            # Authentication routes
│   ├── cart.js            # Shopping cart routes
│   ├── orders.js          # Order management routes
│   ├── products.js        # Product routes
│   ├── reviews.js         # Product review routes
│   └── users.js           # User profile routes
├── utils
│   ├── validators.js      # Input validation
│   └── helpers.js         # Helper functions
├── app.js                 # Express app setup
└── server.js              # Server entry point
```

## Frontend Structure (React.js with TypeScript)

```
/frontend
├── public
│   ├── images/            # Static images
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── ui/            # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── products/      # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductReviews.tsx
│   │   ├── cart/          # Cart components
│   │   │   ├── Cart.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── Checkout.tsx
│   │   ├── user/          # User account components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── OrderHistory.tsx
│   │   └── admin/         # Admin components
│   │       ├── Dashboard.tsx
│   │       ├── ProductManagement.tsx
│   │       ├── OrderManagement.tsx
│   │       └── UserManagement.tsx
│   ├── lib/               # Utility functions
│   │   ├── utils.ts       # Helper functions
│   │   └── validators.ts  # Schema validation with Zod
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── store/             # Redux Toolkit store
│   │   ├── index.ts       # Store configuration
│   │   ├── slices/        # Redux slices
│   │   │   ├── cartSlice.ts
│   │   │   ├── authSlice.ts
│   │   │   └── productSlice.ts
│   ├── services/          # API services
│   │   ├── api.ts         # API communication
│   │   ├── authService.ts # Authentication service
│   │   ├── productService.ts  # Products service
│   │   └── orderService.ts    # Orders service
│   ├── types/             # TypeScript type definitions
│   │   ├── product.ts     # Product related types
│   │   ├── user.ts        # User related types
│   │   ├── order.ts       # Order related types
│   │   └── api.ts         # API response types
│   ├── pages/             # Route pages
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── Account.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── app.tsx            # Main application component
│   ├── index.tsx          # Entry point
│   └── routes.tsx         # Application routing
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # TailwindCSS configuration
├── components.json        # shadcn/ui configuration
└── postcss.config.js      # PostCSS configuration
```

## Key Features

### Customer-Facing Features

1. **User Authentication**

   - Registration/login with email or social media
   - Password recovery
   - Profile management

2. **Product Browsing**

   - Category navigation (Food, Toys, Accessories, Grooming)
   - Basic filtering (by category, price, etc.)
   - Search functionality
   - Featured products display

3. **Product Pages**

   - High-quality images with zoom capability
   - Detailed product information (ingredients, suitability, etc.)
   - Customer reviews and ratings
   - Related product suggestions

4. **Shopping Cart & Checkout**

   - Add/remove items
   - Quantity adjustments
   - Saved for later items
   - Guest checkout
   - Multiple payment methods
   - Address management
   - Order tracking

5. **User Profiles**
   - Order history
   - Saved payment methods
   - Review management
   - Wishlist

### Admin Features

1. **Dashboard**

   - Sales analytics
   - Customer insights
   - Inventory monitoring

2. **Product Management**

   - Add/edit/remove products
   - Inventory management
   - Promotions and discounts

3. **Order Management**

   - Order processing
   - Status updates
   - Customer communications

4. **Customer Management**
   - User data access
   - Support ticket handling

## Technology Stack Details

### Backend

- **Node.js & Express**: RESTful API development
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database interactions
- **JWT**: Authentication
- **Multer**: Image upload handling
- **Stripe API**: Payment processing
- **Nodemailer**: Email notifications

### Frontend

- **React**: UI library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: API requests
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Component collection built with TailwindCSS and Radix UI
- **React Hook Form**: Form handling
- **Zod**: Form validation
- **React Query**: Data fetching and caching

### Deployment Strategy

- **Vercel**: Frontend React application
- **Render**: Backend Express API
- **Cloudinary**: Cloud-based image storage
- **Neon.tech**: Serverless PostgreSQL database
- **GitHub**: Version control and CI/CD workflows

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/register         - Register a new user
POST /api/auth/login            - User login (returns JWT)
POST /api/auth/forgot-password  - Initiate password reset
POST /api/auth/reset-password   - Complete password reset
```

### User Endpoints

```
GET    /api/users/profile       - Get current user profile
PUT    /api/users/profile       - Update user profile
GET    /api/users/orders        - Get user's order history
```

### Product Endpoints

```
GET    /api/products                - Get all products (with filtering and pagination)
GET    /api/products/featured       - Get featured products
GET    /api/products/:id            - Get a single product by ID
GET    /api/products/search?q=term  - Search products by name/description
GET    /api/categories              - Get all product categories
GET    /api/categories/:id/products - Get products in a category
```

### Review Endpoints

```
GET    /api/products/:id/reviews    - Get reviews for a product
POST   /api/products/:id/reviews    - Add a review for a product
DELETE /api/reviews/:id             - Delete a user's review
```

### Cart Endpoints

```
GET    /api/cart                    - Get user's cart
POST   /api/cart                    - Add item to cart
PUT    /api/cart/:itemId            - Update cart item quantity
DELETE /api/cart/:itemId            - Remove item from cart
DELETE /api/cart                    - Clear entire cart
```

### Wishlist Endpoints

```
GET    /api/wishlist                - Get user's wishlist
POST   /api/wishlist                - Add item to wishlist
DELETE /api/wishlist/:productId     - Remove item from wishlist
```

### Order Endpoints

```
POST   /api/orders                  - Create a new order
GET    /api/orders/:id              - Get order details
PUT    /api/orders/:id/cancel       - Cancel an order
```

### Image Upload Endpoint

```
POST   /api/upload                  - Upload product image to Cloudinary
```

### Admin Endpoints

```
GET    /api/admin/users             - Get all users (admin only)
PUT    /api/admin/users/:id         - Update user (admin only)
DELETE /api/admin/users/:id         - Delete user (admin only)

POST   /api/admin/products          - Create new product
PUT    /api/admin/products/:id      - Update product
DELETE /api/admin/products/:id      - Delete product

GET    /api/admin/orders            - Get all orders
PUT    /api/admin/orders/:id        - Update order status
```

### Example API Response Structure

**Product Response:**

```json
{
  "id": 1,
  "name": "Premium Organic Dog Food",
  "description": "High-quality organic food for adult dogs",
  "price": 39.99,
  "discount_price": 34.99,
  "stock_quantity": 50,
  "category_id": 1,
  "image_url": "https://cloudinary.com/your-account/dog-food.jpg",
  "weight": 5,
  "weight_unit": "kg",
  "featured": true,
  "created_at": "2023-05-15T14:30:00Z",
  "updated_at": "2023-05-15T14:30:00Z",
  "category": {
    "id": 1,
    "name": "Dog Food"
  },
  "average_rating": 4.5,
  "review_count": 28
}
```

**Order Response:**

```json
{
  "id": 1,
  "user_id": 5,
  "status": "processing",
  "total_amount": 79.98,
  "shipping_address": "123 Main St, Anytown, USA",
  "billing_address": "123 Main St, Anytown, USA",
  "payment_method": "credit_card",
  "tracking_number": "TRACK123456",
  "created_at": "2023-05-20T10:30:00Z",
  "updated_at": "2023-05-20T14:30:00Z",
  "items": [
    {
      "product_id": 1,
      "name": "Premium Organic Dog Food",
      "price": 39.99,
      "quantity": 2,
      "subtotal": 79.98,
      "image_url": "https://cloudinary.com/your-account/dog-food.jpg"
    }
  ]
}
```

## Deployment Architecture

```
                        ┌─────────────┐
                        │   Client    │
                        │  (Browser)  │
                        └──────┬──────┘
                               │
                               ▼
                    ┌──────────┴──────────┐
                    │                     │
           ┌────────▼─────────┐  ┌────────▼─────────┐
           │    React App     │  │    Express API   │
           │   (Frontend)     │  │    (Backend)     │
           │    on Vercel     │  │    on Render     │
           └────────┬─────────┘  └────────┬─────────┘
                    │                     │
                    │                     │
           ┌────────▼─────────┐  ┌────────▼─────────┐
           │    Cloudinary    │  │    Neon.tech     │
           │  (Image Storage) │  │   (PostgreSQL)   │
           └──────────────────┘  └──────────────────┘
```

## Deployment Setup

### Frontend Deployment (Vercel)

1. **Repository Setup**

   - Create a GitHub repository for your project
   - Push your React frontend code to the repository

2. **Vercel Configuration**

   - Connect your GitHub account to Vercel
   - Import your repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`

3. **Environment Variables**

   - Set up environment variables in Vercel dashboard:
     - `REACT_APP_API_URL`: URL of your backend API on Render
     - `REACT_APP_CLOUDINARY_URL`: Cloudinary configuration

4. **Custom Domain (Optional)**
   - Add and verify your custom domain in Vercel dashboard
   - Configure DNS settings

### Backend Deployment (Render)

1. **Repository Setup**

   - Create a separate repository for your Express backend or use a monorepo approach with clear separation

2. **Render Configuration**

   - Create a new Web Service in Render dashboard
   - Connect to your GitHub repository
   - Configure build settings:
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Environment Variables**

   - Set up environment variables in Render dashboard:
     - `NODE_ENV`: production
     - `DATABASE_URL`: Connection string to your Neon.tech PostgreSQL database
     - `JWT_SECRET`: Secret key for JWT token generation
     - `CLOUDINARY_CLOUD_NAME`: Cloudinary credentials
     - `CLOUDINARY_API_KEY`: Cloudinary credentials
     - `CLOUDINARY_API_SECRET`: Cloudinary credentials
     - `FRONTEND_URL`: Vercel deployed URL (for CORS)

4. **Database Setup (Neon.tech)**

   - Create a new project in Neon.tech
   - Set up a new database
   - Create tables using the SQL schema provided earlier
   - Get the connection string for your Render backend
   - Set up proper database access controls

5. **Image Storage (Cloudinary)**
   - Create a Cloudinary account
   - Set up an upload preset
   - Configure the API in your backend for image uploads

### CI/CD Workflow

- Both Vercel and Render support automatic deployments on push to your main branch
- Configure preview deployments for pull requests
- Set up environment-specific variables for development/staging/production
