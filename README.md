# BestFurFriends: PERN Stack Dog E-commerce Application

## Application Overview

BestFurFriends is a full-featured e-commerce platform for dog products using the PERN stack:

- **PostgreSQL**: Relational database for structured data storage
- **Express.js**: Backend API framework
- **React.js**: Frontend user interface library
- **Node.js**: JavaScript runtime for the server

## User Stories

### Customer User Stories

#### Authentication & User Profile

1. User Registration

- As a new user, I want to create an account so that I can track my orders and save my information.
- As a user, I want to register using my email or social media accounts so that I can quickly access the site.

2. User Login

- As a registered user, I want to log in securely so that I can access my account.
- As a user, I want a "remember me" option so that I don't have to log in every time I visit.

3. Password Management

- As a user, I want to reset my password if I forget it so that I can regain access to my account.
- As a user, I want to change my password from my profile for security reasons.

4. Profile Management

- As a user, I want to view and edit my profile information so that my shipping and billing details are accurate.
- As a user, I want to see my order history so that I can track my purchases.
- As a user, I want to save multiple shipping addresses so that I can easily select them during checkout.

#### Product Browsing

5. Category Navigation

- As a shopper, I want to browse products by category so that I can find items that match my dog's needs.
- As a shopper, I want to see featured products on the homepage so that I can discover popular items.

6. Product Search & Filtering

- As a shopper, I want to search for products by keyword so that I can find specific items quickly.
- As a shopper, I want to filter products by price range so that I can find items within my budget.
- As a shopper, I want to sort products by popularity, price, or rating so that I can make better purchasing decisions.

7. Product Details

- As a shopper, I want to view detailed product information (ingredients, weight, etc.) so that I can make informed decisions.
- As a shopper, I want to see high-quality product images so that I can examine items before purchasing.
- As a shopper, I want to read customer reviews of products so that I can understand others' experiences.
- As a shopper, I want to see related product suggestions so that I can discover complementary items.

#### Shopping Experience

8. Shopping Cart

- As a shopper, I want to add products to my cart so that I can purchase multiple items at once.
- As a shopper, I want to adjust item quantities in my cart so that I can customize my order.
- As a shopper, I want to remove items from my cart so that I can change my mind before purchasing.
- As a shopper, I want my cart to persist between sessions so that I don't lose my selections if I leave the site.

9. Wishlist (optional)

- As a shopper, I want to save products to a wishlist so that I can remember them for future purchase.
- As a shopper, I want to move items from my wishlist to my cart so that I can easily purchase saved items.

10. Checkout Process

- As a shopper, I want to select from saved addresses or enter a new one during checkout.
- As a shopper, I want to choose from multiple payment methods so that I can pay in my preferred way.
- As a shopper, I want to see order summary before finalizing my purchase.
- As a shopper, I want to receive order confirmation by email so that I have a record of my purchase.

11. Order Tracking

- As a customer, I want to track my order status so that I know when to expect delivery. (optional)
- As a customer, I want to view my order history so that I can reference past purchases.
- As a customer, I want to leave reviews for products I've purchased so that I can share my experience.

### Admin User Stories

12. Dashboard & Analytics

- As an admin, I want to view sales analytics so that I can understand business performance.
- As an admin, I want to see inventory levels so that I can restock items when needed.
- As an admin, I want to view customer insights so that I can better understand my audience.

13. Product Management

- As an admin, I want to be able to see a list of all products.
- As an admin, I want to add new products so that I can expand my catalog.
- As an admin, I want to edit existing products so that I can update information and pricing.
- As an admin, I want to upload product images so that customers can see what they're buying.
- As an admin, I want to add products to featured collections so that I can promote specific items.

14. Order Management

- As an admin, I want to view all orders so that I can process them efficiently.
- As an admin, I want to update order status so that customers know when their items ship.
- As an admin, I want to add tracking information to orders so that customers can track deliveries. (optional)
- As an admin, I want to process refunds when necessary so that I can handle customer issues. (optional)

15. User Management

- As an admin, I want to view customer accounts so that I can provide support.
- As an admin, I want to manage user roles so that I can control access to admin features. (optional)

#### Advanced Features

16. Promotions & Discounts

- As a shopper, I want to apply coupon codes during checkout so that I can receive discounts.
- As an admin, I want to create time-limited promotions so that I can boost sales.

Customer Service

- As a customer, I want to contact customer service so that I can resolve issues with my order.
- As an admin, I want to respond to customer inquiries so that I can provide good service.

Notifications

- As a customer, I want to receive notifications about order status changes so that I stay informed.
- As an admin, I want to be notified of low inventory so that I can restock popular items.

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
│   ├── authRoutes.js            # Authentication routes
│   ├── cartRoutes.js            # Shopping cart routes
│   ├── orderRoutes.js          # Order management routes
│   ├── productRoutes.js        # Product routes
│   ├── reviewRoutes.js         # Product review routes
│   └── userRoutes.js           # User profile routes
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
│   └── images/            # Static images
├── src
│   ├── components
│   │   ├── ui/            # Core UI components (shadcn/ui)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminSidebar.tsx    # Admin navigation sidebar
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductFilter.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   └── Checkout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── admin/                  # Minimal admin components
│   │       ├── ProductForm.tsx     # Create/edit products
│   │       ├── ProductTable.tsx    # List products
│   │       └── OrderTable.tsx      # View orders
│   ├── lib/
│   │   ├── utils.ts
│   │   └── auth.ts                 # Auth utilities & role checking
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useAuth.ts              # Enhanced with role support
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── adminService.ts         # Admin-specific API calls
│   ├── context/
│   │   ├── CartContext.tsx
│   │   └── AuthContext.tsx         # With role-based auth
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── user.ts                 # Include role definitions
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Account.tsx
│   │   └── admin/                  # Admin pages
│   │       ├── Dashboard.tsx       # Simple stats overview
│   │       ├── Products.tsx        # Product management
│   │       └── Orders.tsx          # Order management
│   ├── routes/
│   │   ├── index.tsx               # Main routing
│   │   ├── ProtectedRoute.tsx      # Auth protection
│   │   └── AdminRoute.tsx          # Admin-only protection
│   ├── app.tsx
│   └── index.tsx
├── tsconfig.json
└── tailwind.config.js
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
