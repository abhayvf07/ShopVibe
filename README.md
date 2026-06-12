<h1 align="center">
  🛍️ ShopVibe
</h1>

<p align="center">
  <em>A modern, full-stack e-commerce web application built with the MERN stack</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## ✨ Features

- 🛒 **Full Shopping Experience** — Browse, search, filter, sort, add to cart, and checkout
- 🎨 **Dark/Light Mode** — Smooth theme switching with CSS custom properties, persisted in localStorage
- ⚡ **Framer Motion Animations** — Page transitions, staggered card reveals, slide-in cart drawer
- 🔐 **JWT Authentication** — Secure login/register with bcrypt password hashing
- 👤 **User Dashboard** — View orders, manage wishlist, update profile
- 🛠️ **Admin Panel** — Stats cards, Chart.js visualizations, order management
- 💖 **Wishlist** — Heart toggle on products, synced to MongoDB when logged in
- 📱 **Fully Responsive** — Mobile-first design with hamburger nav, adaptive grids
- 🔍 **Smart Search** — Debounced search input (300ms) across product titles and descriptions
- 🛡️ **Protected Routes** — Role-based access control (user/admin)
- 🎯 **Pure CSS** — No Tailwind, no MUI — all styles handwritten for maximum interview credibility

---

## 📸 Screenshots

> *Screenshots coming soon — run the app locally to see it in action!*

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite | UI framework + build tool |
| **Routing** | React Router DOM v6 | Client-side navigation (`createBrowserRouter`) |
| **Styling** | CSS3 Custom Properties | Theming, responsive layout, animations |
| **Animations** | Framer Motion | Page transitions, hover effects, drawer |
| **Charts** | Chart.js + react-chartjs-2 | Admin dashboard visualizations |
| **HTTP Client** | Axios | API calls with JWT interceptors |
| **Notifications** | React Toastify | Success/error toast messages |
| **Icons** | React Icons (Feather) | Consistent icon system |
| **State** | Context API | Cart, auth, theme, wishlist |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Mongoose | Data persistence |
| **Auth** | JWT + bcryptjs | Token-based authentication |
| **Product Data** | FakeStore API | External product catalog |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally (or a MongoDB Atlas URI)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/shopvibe.git
cd shopvibe

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Install server dependencies
cd server
npm install

# 4. Install client dependencies
cd ../client
npm install

# 5. Start the backend server (from /server directory)
cd ../server
node index.js
# → Server running on http://localhost:5000

# 6. Start the frontend dev server (from /client directory)
cd ../client
npm run dev
# → Client running on http://localhost:5173
```

### Quick Start (with concurrently)
```bash
# From root directory
npm install          # Install concurrently
npm run install-all  # Install client + server deps
npm run dev          # Start both servers
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with email/password | No |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders/place-order` | Place a new order | JWT |
| GET | `/api/orders/my-orders` | Get user's orders | JWT |
| GET | `/api/orders/all` | Get all orders | Admin |
| GET | `/api/orders/stats` | Get order statistics | Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get user profile | JWT |
| PUT | `/api/users/update-profile` | Update name/password | JWT |
| GET | `/api/users/wishlist` | Get user wishlist | JWT |
| PUT | `/api/users/wishlist` | Sync wishlist | JWT |
| GET | `/api/users/count` | Get total user count | Admin |

### External API
| Endpoint | Description |
|----------|-------------|
| `GET https://fakestoreapi.com/products` | All products |
| `GET https://fakestoreapi.com/products/:id` | Single product |
| `GET https://fakestoreapi.com/products/categories` | All categories |
| `GET https://fakestoreapi.com/products?limit=8` | Limited products |

---

## 📁 Folder Structure

```
shopvibe/
├── client/                          # React Vite frontend
│   ├── .env                         # Client environment variables
│   ├── .env.example                 # Client env template
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js       # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sticky nav, dark mode, cart badge
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── ProductCard.jsx      # Product grid card (React.memo)
│   │   │   ├── CartDrawer.jsx       # Slide-in cart drawer
│   │   │   ├── Loader.jsx           # Skeleton loader
│   │   │   ├── StarRating.jsx       # Star display
│   │   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   │   └── ErrorBoundary.jsx    # Error fallback
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx      # Dark/light mode
│   │   │   ├── AuthContext.jsx       # JWT auth state
│   │   │   ├── CartContext.jsx       # Shopping cart
│   │   │   └── WishlistContext.jsx   # Wishlist with DB sync
│   │   ├── hooks/
│   │   │   ├── useFetch.js          # Generic data fetching
│   │   │   └── useDebounce.js       # Input debouncing
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Products.jsx         # Product catalog
│   │   │   ├── ProductDetail.jsx    # Single product
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Registration form
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── AdminPanel.jsx       # Admin analytics
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── styles/
│   │   │   ├── variables.css        # CSS custom properties
│   │   │   └── global.css           # All styles
│   │   ├── App.jsx                  # Router setup
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   └── vite.config.js
│
├── server/
│   ├── .env                         # Backend environment variables
│   ├── .env.example                 # Backend env template
│   ├── models/
│   │   ├── User.js                  # User schema (with role)
│   │   └── Order.js                 # Order schema
│   ├── routes/
│   │   ├── auth.js                  # Register/Login
│   │   ├── orders.js                # Order CRUD
│   │   └── users.js                 # Profile/Wishlist
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── adminMiddleware.js       # Admin role check
│   └── index.js                     # Express app entry
│
├── .gitignore
├── package.json                     # Root scripts
└── README.md
```

---

## 🧠 What I Learned

This project helped me solidify my understanding of:

- **React Hooks & Context API** — Managing global state without Redux, using useContext, useCallback, useMemo
- **Custom Hooks** — Creating reusable logic (useFetch, useDebounce) for cleaner components
- **CSS Custom Properties** — Building a complete design system with dark/light mode using pure CSS
- **JWT Authentication** — Full auth flow: registration → hashing → token generation → protected routes
- **REST API Design** — Structuring Express routes with middleware chains (auth → admin)
- **MongoDB with Mongoose** — Schema design, validation, aggregation pipelines
- **React Router v6** — Using createBrowserRouter, layout routes, and protected route patterns
- **Responsive Design** — Mobile-first approach with CSS Grid and Flexbox, no UI framework
- **Error Handling** — ErrorBoundary for render errors, 401 interceptors for auth failures
- **Performance** — React.memo, useCallback, lazy loading images, debounced search

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npx vercel --prod
```

### Backend → Render
1. Create a new Web Service on [render.com](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables (MONGODB_URI, JWT_SECRET, PORT)

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string and update `MONGODB_URI` in your environment variables

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
