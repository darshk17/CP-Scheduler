# Phase 7: Authentication Module Design Documentation

This phase outlines the architecture and flow for securing **CP Scheduler** accounts using **JSON Web Tokens (JWT)** and password hashing with **bcryptjs**.

No implementation code is written in this phase; we are establishing routes, validation models, and controller shells.

---

## 🛣 Authentication Routes

The authentication API endpoints are mapped inside [server/routes/authRoutes.js](file:///d:/CP-Scheduler/server/routes/authRoutes.js):

| HTTP Method | API Endpoint | Middleware | Controller Function | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | None | `signup` | Registers a new user, hashes password, returns JWT. |
| `POST` | `/api/auth/login` | None | `login` | Validates credentials, returns JWT on success. |
| `POST` | `/api/auth/logout` | None | `logout` | Clears user session token client-side. |
| `GET` | `/api/auth/me` | `protect` | `getCurrentUser` | Returns the profile of the currently logged-in user. |

---

## 🛠 Directory File Layouts (Structures)

To maintain our folder standard, we define the structure of our route, controller, and middleware files:

### 1. Route Map Structure (`server/routes/authRoutes.js`)
```javascript
const express = require('express');
const router = express.Router();
const { signup, login, logout, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

module.exports = router;
```

### 2. Controller Structure (`server/controllers/authController.js`)
```javascript
// Register a new user
exports.signup = async (req, res, next) => {
  // TODO: Validate body -> Hash password -> Save to DB -> Generate Token -> Send response
};

// Log in existing user
exports.login = async (req, res, next) => {
  // TODO: Find user -> Match password -> Generate Token -> Send response
};

// Log out user
exports.logout = async (req, res, next) => {
  // TODO: Clear client session
};

// Get profile of authenticated user
exports.getCurrentUser = async (req, res, next) => {
  // TODO: Return user data (already retrieved by protect middleware)
};
```

### 3. Middleware Structure (`server/middleware/authMiddleware.js`)
```javascript
// Protect routes from unauthenticated users
exports.protect = async (req, res, next) => {
  // 1. Get token from Authorization header (Bearer <token>)
  // 2. Verify token using jwt.verify()
  // 3. Find user in database using decoded ID
  // 4. Attach user object to request (req.user = user)
  // 5. Call next() to proceed to controller
};
```

---

## 🔄 Execution Flow Diagrams

### 1. Request Flow (Sign Up / Login)
```text
[ React Form Submit ] ---> (Sends POST with JSON body: email & password)
            │
            ▼
    [ Express Router ] --> (Matches path /api/auth/signup or /login)
            │
            ▼
[ Controller Handler ] --> (Checks database if email exists/matches)
            │
            ▼
[ Success Response ] ---> (Sends JSON Web Token and user data back to React)
```

### 2. JWT Flow (Protecting Routes)
JSON Web Tokens (JWT) allow the server to verify the user's identity without storing active session records on the server.
```text
1. Login/Signup Success ---> Server generates JWT signed with JWT_SECRET.
2. Token Sent to Client ---> React receives token and saves it in LocalStorage.
3. Access Protected Route -> React sends token in Header: 'Authorization: Bearer <token>'
4. Middleware Verification -> Express decodes token. If valid, request proceeds.
```

### 3. Password Hashing Flow (Bcryptjs)
We **never** store passwords in plain text. If a database leak occurs, plain-text passwords expose users.
```text
Password Hashing (Register):
[ Raw Password: "MySecret123" ] ---> [ Bcrypt Salt + Hash function ] ---> [ Hashed Password: "$2a$10$XyZ..." ]
                                                                                   │
                                                                                   ▼
                                                                        (Saved to MongoDB Cluster)

Password Verification (Login):
[ Entered Password: "MySecret123" ] ───┐
                                       ├───> [ Bcrypt Compare ] ───> [ SUCCESS / FAIL ]
[ Stored Hash: "$2a$10$XyZ..." ] ──────┘
```
