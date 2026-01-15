# E-Commerce Platform

A full-stack e-commerce application built with Node.js/Express backend and React/TypeScript frontend.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: Arcjet (DDoS protection, rate limiting)

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI, Lucide Icons, Recharts

---

## Features

### Authentication & User Management
- User registration with email/password
- Secure login with JWT tokens
- Password reset via email (with secure token)
- Profile management (name, email, password)
- Logout with token clearing

### Role-Based Access Control
- **Regular Users**: Can browse products, manage cart, place orders
- **Admin Users**: Full access to dashboard, products, users, orders, analytics

### Product Management
- Product catalog with categories (Watch, Mac, Phone, Earphone, iPad, Accessories)
- Product variants (colors with hex codes)
- Product sizes
- Product badges (Sale, New, Popular)
- Product ratings
- Stock management
- Image management with Cloudinary
- Search functionality
- Pagination

### Shopping Cart
- Add products with variant selection (color, size, quantity)
- Automatic stock validation
- Quantity management
- Remove items
- Persistent cart state

### Order Management
- Create orders with shipping address
- View order history
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Cancel pending orders
- Admin order status updates
- Order filtering by status

### Admin Dashboard
- **Products Tab**: CRUD operations, search, pagination
- **Users Tab**: View all users, promote/demote admin roles
- **Analytics Tab**: Popular products, most buying products with charts
- **Orders Tab**: View all orders, update status

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Admin-only route protection
- Order ownership validation
- Arcjet security middleware (DDoS protection, rate limiting)
- CORS configuration
- Cookie parsing

---

## Project Structure

```
MasterProject/
├── backend/
│   ├── config/
│   │   ├── arcjet.js          # Arcjet security configuration
│   │   ├── cloudinary.js      # Cloudinary image upload config
│   │   └── env.js             # Environment variables
│   ├── controllers/
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   ├── upload.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── arcjet.middleware.js
│   │   └── auth.middleware.js
│   ├── model/
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── analytics.route.js
│   │   ├── auth.route.js
│   │   ├── order.route.js
│   │   ├── product.route.js
│   │   ├── upload.route.js
│   │   └── user.route.js
│   ├── util/
│   │   ├── EmailTamplete.js
│   │   └── mailer.js
│   ├── database/
│   │   └── db.js
│   ├── app.js
│   ├── seed-tech.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.ts       # Axios instance with interceptors
    │   ├── components/
    │   │   ├── ui/            # Reusable UI components
    │   │   ├── Layout.tsx
    │   │   └── Navbar.tsx
    │   ├── lib/
    │   │   ├── react-query.ts
    │   │   ├── toast.ts
    │   │   └── utils.ts
    │   ├── pages/
    │   │   ├── Home.tsx       # Product catalog
    │   │   ├── About.tsx
    │   │   ├── Dashboard.tsx  # Admin dashboard
    │   │   ├── Profile.tsx    # User profile
    │   │   ├── OrdersPage.tsx # User orders
    │   │   ├── ProductDetail.tsx
    │   │   ├── auth/
    │   │   │   ├── Login.tsx
    │   │   │   └── Register.tsx
    │   │   └── components/    # Dashboard components
    │   │       ├── AnalyticsTab.tsx
    │   │       ├── CheckoutDialog.tsx
    │   │       ├── DeleteDialog.tsx
    │   │       ├── FilterSheet.tsx
    │   │       ├── OrdersTab.tsx
    │   │       ├── ProductFormSheet.tsx
    │   │       ├── ProductsTab.tsx
    │   │       └── UsersTab.tsx
    │   ├── router/
    │   │   └── index.tsx
    │   ├── store/
    │   │   ├── auth.ts        # Auth state (Zustand)
    │   │   ├── cart.ts        # Cart state (Zustand)
    │   │   ├── order.ts       # Order state (Zustand)
    │   │   └── product.ts     # Product state (Zustand)
    │   ├── main.tsx
    │   ├── index.css
    │   └── vite-env.d.ts
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## API Endpoints

### Authentication Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/log-in` | Login user | No |
| POST | `/log-out` | Logout user | Yes |
| PUT | `/update` | Update profile | Yes |
| PUT | `/change-password` | Change password | Yes |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/` | Get all users | Yes | Yes |
| PUT | `/:id/role` | Update user role | Yes | Yes |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/` | Get all products | No | No |
| GET | `/:id` | Get product by ID | No | No |
| POST | `/` | Create product | Yes | Yes |
| PUT | `/:id` | Update product | Yes | Yes |
| DELETE | `/:id` | Delete product | Yes | Yes |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/` | Create order | Yes | No |
| GET | `/` | Get user's orders | Yes | No |
| GET | `/all` | Get all orders | Yes | Yes |
| GET | `/user/:userId` | Get orders by user | Yes | Yes |
| GET | `/:id` | Get order by ID | Yes | No* |
| PUT | `/:id/status` | Update order status | Yes | Yes |
| PUT | `/:id/cancel` | Cancel order | Yes | No* |

*Order ownership check enforced in controller

### Upload Routes (`/api/upload`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/` | Upload image | Yes | Yes |

### Analytics Routes (`/api/analytics`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/` | Get analytics data | Yes | Yes |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account (for image upload)
- Email service credentials (for password reset)

### Installation

1. **Clone the repository**
   ```bash
   cd MasterProject
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Environment Variables** (`backend/.env`)
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   MONGO_URI=mongodb://localhost:27017/ecommerce
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

5. **Create Environment Variables** (`frontend/.env`)
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

### Running the Application

**Backend** (from `backend/` directory):
```bash
npm run dev      # Development with nodemon
npm start        # Production
```

**Frontend** (from `frontend/` directory):
```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview production build
```

### Seed Data
```bash
cd backend
node seed-tech.js
```

---

## Key Implementation Details

### Authentication Flow
1. User registers → Account created with bcrypt-hashed password
2. User logs in → JWT token issued with user ID and admin flag
3. Token stored in localStorage and sent in Authorization header
4. Backend middleware validates token and attaches user to request
5. Protected routes check for valid token and admin status

### Admin Protection Strategy
- **Middleware Level**: `isAdmin` middleware validates JWT admin flag
- **Controller Level**: Additional checks for order ownership
- **Route Level**: Admin-only routes explicitly require `isAdmin` middleware

### State Management (Zustand)
- **Auth Store**: User authentication, profile, JWT token management
- **Cart Store**: Shopping cart with variant support and stock validation
- **Order Store**: User orders and order history
- **Product Store**: Product catalog, filtering, pagination

### Image Upload Flow
1. Admin selects image in dashboard
2. Frontend sends FormData to `/api/upload`
3. Backend receives file, converts to base64
4. Cloudinary uploads and returns secure URL
5. Product saved with Cloudinary image URL

### Pagination Implementation
- Backend supports `page` and `limit` query parameters
- Frontend manages current page and fetches on navigation
- Pagination metadata returned with each response

---

## Security Best Practices Implemented

1. **Password Security**: bcrypt hashing with salt rounds
2. **Token Security**: JWT with expiration, stored in localStorage
3. **Route Protection**: Middleware validates authentication
4. **Admin Authorization**: Explicit admin role checks
5. **Order Ownership**: Users can only access their own orders
6. **Input Validation**: Request body validation in controllers
7. **Error Handling**: Secure error messages, no sensitive data exposure
8. **CORS**: Configured for specific client origin
9. **Security Headers**: Arcjet provides DDoS and rate limiting protection

---

## License

MIT
