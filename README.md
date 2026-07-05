# 📅 CP Scheduler

A full-stack Competitive Programming Scheduler and performance tracker designed to consolidate coding contests across major platforms (Codeforces, LeetCode, and CodeChef) into a unified, responsive dashboard. The application provides automated email alert triggers to ensure you never miss an upcoming round.

---

## 🚀 Key Features

*   **Unified Contest Timeline**: Aggregates and normalizes scheduling parameters from Codeforces, LeetCode, and CodeChef.
*   **Performance Metrics Sync**: Dynamically fetches and visualizes user profile statistics (rating thresholds, ranks, solved count categories, and global rankings) in a single card.
*   **Contest Bookmark Management**: Saves upcoming events to a personal calendar list with custom duplicates protection and array index optimization.
*   **Automated Email Reminders**: Employs a background cron runner executing every minute to dispatch Nodemailer email alerts based on user-defined threshold warning windows (e.g., 15, 30, or 60 minutes before contest start).
*   **Security First**: Strengthened with Helmet security headers, rate-limiting on authentication requests, secure password hashing (bcryptjs), and environment-controlled CORS policies.

---

## 🛠️ Technology Stack

*   **Frontend**: React (SPA), Vite, React Router, Axios, Context API, CSS (Modern custom CSS custom property architecture).
*   **Backend**: Node.js, Express, Mongoose (MongoDB ODM), node-cron (Background task runner), Nodemailer (SMTP Mailer).
*   **Libraries**: Helmet, Express-Rate-Limit, BCryptJS, JsonWebToken.

---

## 📁 Repository Structure

```text
CP-Scheduler/
├── server/                     # Backend Source Code
│   ├── config/                 # Database and Safety configurations
│   ├── controllers/            # Request routers route controllers
│   ├── jobs/                   # Background jobs and cron runner
│   ├── middleware/             # Express Middlewares (Auth, Error handling)
│   ├── models/                 # Mongoose Database Schemas
│   ├── routes/                 # Express REST Routers
│   ├── services/               # Competitive programming APIs & Nodemailer services
│   ├── utils/                  # Helper formatting scripts
│   └── server.js               # Entrypoint file
├── src/                        # Frontend React Source Code
│   ├── assets/                 # Static visual resources
│   ├── components/             # Reusable UI presentation components
│   ├── context/                # Auth & Theme states Context Providers
│   ├── pages/                  # Top-level Routing targets (Dashboard, Home, Login)
│   ├── services/               # API clients (Axios connection instance)
│   ├── styles/                 # Theme styles configuration stylesheets
│   └── utils/                  # Storage wrappers and API mapping utilities
├── index.html                  # Frontend index root markup
└── package.json                # Project dependencies and building scripts
```

---

## ⚙️ Installation & Local Setup

### Prerequisite
Ensure you have **Node.js (v18+)** and **MongoDB** running on your local machine.

### 1. Clone & Set Up Backend
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create env file from example
cp .env.example .env
```
Fill in the environment parameters inside `.env`:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_app_password
CLIENT_URL=http://localhost:5173
```

### 2. Set Up Frontend
```bash
# Navigate back to workspace root
cd ..

# Install dependencies
npm install
```

### 3. Run Locally
```bash
# In server directory: Start nodemon dev backend
npm run dev

# In root directory: Start vite frontend
npm run dev
```

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
*   `POST /register` - Signup a new user account.
*   `POST /login` - Login and return JWT token session.
*   `GET /me` - Retrieve logged-in profile context details.

### Contests & Bookmarks (`/api/contests`)
*   `GET /` - Fetch all normalized upcoming scheduled contests (Public).
*   `POST /save` - Bookmark a contest (Saves to user account).
*   `DELETE /save` - Remove a bookmarked contest from user dashboard.

### Competitive Programming stats (`/api/cp`)
*   `GET /leetcode` - Refresh and cache user LeetCode stats in database.
*   `POST /codeforces/refresh` - Refresh and cache user Codeforces stats in database.

### Preferences (`/api/users`)
*   `PUT /profile` - Update profile name and sync handles.
*   `PUT /reminders` - Update email reminders threshold windows.
