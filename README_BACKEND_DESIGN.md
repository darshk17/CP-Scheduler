# CP Scheduler Backend Architecture Design

This document details the backend architectural design for the full-stack expansion of **CP Scheduler**, using **Node.js, Express.js, and MongoDB**.

The system is structured using the **MVC (Model-View-Controller)** pattern, optimized for scalability, clean separation of concerns, and ease of understanding for beginners.

---

## 📁 Backend Folder Structure

We will organize the backend codebase in a dedicated directory (e.g. `server/` or `backend/` at the root) matching the following layout:

```text
server/
├── config/                 # Configurations (Database, Mailer, Environment variables)
│   ├── db.js               # MongoDB Atlas connection script
│   └── nodemailer.js       # Nodemailer setup for email reminders
│
├── controllers/            # Request handlers (processes inputs, interacts with models)
│   ├── authController.js   # Login, registration, token refreshes
│   ├── userController.js   # Profile updates, dashboard statistics, CP tracker sync
│   ├── contestController.js# Saved/custom contests management
│   └── reminderController.js# Reminder preferences and triggers
│
├── middleware/             # Gatekeeper filters (intercepts requests before controllers)
│   ├── authMiddleware.js   # JWT verification and route protection
│   ├── errorMiddleware.js  # Global centralized error handler
│   └── validationMiddleware.js# Request body validations (Joi / Express Validator)
│
├── models/                 # Database Schemas (Mongoose definitions)
│   ├── User.js             # User profiles, settings, credentials
│   ├── Contest.js          # Cached/saved contest metadata
│   └── Reminder.js         # Reminder schedule times and status flags
│
├── routes/                 # API endpoint mappings
│   ├── authRoutes.js       # Routes for authentication (/api/auth)
│   ├── userRoutes.js       # Routes for users profiles (/api/users)
│   ├── contestRoutes.js    # Routes for contest data (/api/contests)
│   └── reminderRoutes.js   # Routes for email notifications (/api/reminders)
│
├── services/               # Background processes and external integrations
│   ├── cronService.js      # Runs checks for sending reminders (node-cron)
│   ├── emailService.js     # Sends reminder templates
│   └── trackerService.js   # Scrapes/queries Leetcode, Codeforces API profiles
│
├── utils/                  # Helper utilities
│   └── AppError.js         # Custom operational error subclass
│
├── .env                    # Secret keys, database URIs, port configurations
├── package.json            # Node dependencies and scripts
└── server.js               # Application startup entry point
```

---

## 📄 File & Folder Explanations

### 1. Root Files
*   `server.js`: The application entry point. It configures the Express middleware (CORS, JSON parsing), mounts the routes, establishes the MongoDB database connection, and starts the HTTP listening port.
*   `.env`: Holds configuration keys, database connection strings (`MONGODB_URI`), JWT tokens, email passwords, and API keys.

### 2. `/config`
*   `db.js`: Uses Mongoose to connect to your MongoDB Atlas cloud database. Includes reconnection configurations and logs connection errors.
*   `nodemailer.js`: Configures the email transport layer (using SMTP or Gmail service wrappers) to support the reminder system.

### 3. `/models`
*   `User.js`: Defines the Mongoose Schema for users (username, email, hashed password, saved contests list, credentials for CP platforms like Codeforces, LeetCode handles).
*   `Contest.js`: Defines the Mongoose Schema for storing contests metadata. Enables server-side caching of API results to avoid rate limits.
*   `Reminder.js`: Represents upcoming reminders containing user references, contest references, reminder offset (e.g., 30 minutes before), and a `sent` boolean flag.

### 4. `/routes`
*   Maps HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) and paths to controller actions (e.g. `POST /api/auth/register` calls `authController.register`).

### 5. `/controllers`
*   Contains the request-response cycle logic. It reads headers/bodies/queries, calls services or Mongoose models, and returns JSON payloads (`res.status(200).json(...)`).

### 6. `/middleware`
*   `authMiddleware.js`: Inspects incoming requests for JWT tokens, decodes them, and attaches the authenticated user's ID to the request object (`req.user`).
*   `errorMiddleware.js`: Catches errors passed to `next(err)` and returns structured JSON responses instead of crashing the process.

### 7. `/services`
*   `cronService.js`: Periodically runs in the background (using `node-cron`) to check the database for reminders that need to be sent out in the next window.
*   `emailService.js`: Constructs html templates for contest alerts and triggers Nodemailer.
*   `trackerService.js`: Interfaces with competitive programming websites to fetch submissions, ratings, and stats for the CP Profile Tracker feature.

---

## 🏛 Why MVC Architecture is Used

The **Model-View-Controller (MVC)** pattern divides application logic into three distinct layers:
1.  **Model**: Manages database schemas, logic, and validation rules (Mongoose).
2.  **View**: In a modern headless API system, the "View" is replaced by the JSON responses returned by the controller, which are consumed by the React frontend.
3.  **Controller**: The intermediate layer processing user input and querying the database models.

### Key Benefits for CP Scheduler:
*   **Separation of Concerns**: Easy to maintain. If you want to change how email alerts are structured, you edit the `services/emailService.js` without touching the route controller or database schemas.
*   **Future Scalability**: When implementing future layers (like an **Admin Panel** or **AI Recommendations**), we can easily add new routes, controllers, and models without risking changes to our current stable code.

---

## 🔄 Request-Response Flow Diagram

When a user registers or saves a contest, the request follows this sequential path:

```text
[ React Frontend Request ]
            │
            ▼
   [ server.js Entry ]
            │
            ▼
     [ Router Entry ]  --> (Routes path: GET /api/contests/saved)
            │
            ▼
 [ Middleware Filter ] --> (Checks JWT validity, rejects if expired)
            │
            ▼
  [ Controller Handler ] -> (Extracts user ID, calls Mongoose query)
            │
            ▼
   [ Mongoose Model ]  --> (Queries MongoDB Atlas cluster)
            │
            ▼
 [ Controller Response ] -> (Converts data to JSON format)
            │
            ▼
[ React Frontend Render ]
```

---

## 🌐 Frontend & Backend Communication

1.  **RESTful JSON API**: The React frontend and Express backend communicate using standard HTTP requests. Data payload is exchanged strictly in **JSON format** (JavaScript Object Notation).
2.  **Axios / Fetch**: The React frontend will call backend endpoints using `fetch()` or `axios` instances.
3.  **Stateless JWT Authentication**: 
    *   When a user logs in, the backend signs a **JSON Web Token (JWT)** containing their user ID and sends it back.
    *   The frontend saves this token (in localStorage or memory) and sends it in the `Authorization: Bearer <token>` header for all secure requests.
4.  **CORS Coordination**: The backend uses the `cors` package to explicitly authorize requests from the frontend development domain (`http://localhost:5173`).
