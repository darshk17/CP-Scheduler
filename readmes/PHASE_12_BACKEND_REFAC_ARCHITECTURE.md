# Phase 12: Backend Architecture & API Specifications

This phase refactors the backend codebase to improve scalability, security, clean REST architecture, and dry up user payload formatting.

---

## 🏛️ Backend Architecture

The backend follows a modular **Controller-Route-Middleware-Model** architecture:

```
server/
├── config/
│   ├── db.js          # Database connection
│   └── envCheck.js    # Startup environment check validation [NEW]
├── controllers/
│   ├── authController.js       # Handles sign-up, login, logout, profile
│   └── dashboardController.js  # Refactored: Handles user dashboard statistics
├── middleware/
│   ├── authMiddleware.js       # Protects private routes via JWT validation
│   └── errorMiddleware.js      # Centralized global Express error handler [NEW]
├── models/
│   └── User.js        # Mongoose User Schema
├── routes/
│   ├── authRoutes.js      # Auth-related subroutes
│   ├── dashboardRoutes.js # Dashboard-specific subroutes
│   └── index.js           # Unified API router [NEW]
├── utils/
│   └── userFormatter.js   # DRY response formatting logic [NEW]
└── server.js          # Unified entry point
```

---

## 📡 API Endpoint Reference List

| Method | Endpoint | Authentication | Description |
| :--- | :--- | :---: | :--- |
| **GET** | `/` | None | Service sanity check |
| **POST** | `/api/auth/signup` | None | Register new user account |
| **POST** | `/api/auth/login` | None | Log in existing user and obtain JWT |
| **POST** | `/api/auth/logout` | None | Clear authentication session context |
| **GET** | `/api/auth/me` | JWT | Fetch details for the logged-in session user |
| **GET** | `/api/dashboard` | JWT | Retrieve dashboard payload containing statistics & usernames |

---

## 🔒 Security & Best Practices Implemented

1. **Centralized Routing Entrypoint**: Consolidating routing under `/api` in `routes/index.js` reduces code clutter in `server.js` and allows adding future routes seamlessly without touching core boot files.
2. **Environment Protection**: Pre-flight environment variables check (`envCheck.js`) halts application boots immediately if essential credentials like `MONGODB_URI` or `JWT_SECRET` are missing.
3. **Robust Error Boundary**: Centralized global error handling catches Mongoose validations, database duplicates, and expired JWT exceptions, returning clean, consistent error JSON wrappers rather than stack traces.
4. **DRY User Serialization**: Employs `userFormatter` helper to consistently remove password hashes and standardize field layouts across sign-up, log in, and profile routes.
