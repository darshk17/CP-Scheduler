# Phase 4: Backend Setup Documentation

This phase initializes the backend foundation for **CP Scheduler** using Node.js and Express.js. No database connections or authentication layers are configured yet. We verify that the basic HTTP routing, environment variables, and folder patterns are operational.

---

## 🛠 Installed Dependencies

We have installed the following packages to configure our server:

| Dependency | Category | Purpose |
| :--- | :--- | :--- |
| `express` | Production | Core web framework to manage routes and HTTP requests. |
| `dotenv` | Production | Loads configurations and environment variables from a `.env` file into `process.env`. |
| `cors` | Production | Configures Cross-Origin Resource Sharing so our React frontend can query the API. |
| `mongoose` | Production | ODM (Object Data Modeling) library for MongoDB. |
| `jsonwebtoken` | Production | Generates and verifies JWT credentials for user sessions. |
| `bcryptjs` | Production | Hashing utility to encrypt and secure user passwords in the database. |
| `nodemailer` | Production | Email client library to send out contest reminder alerts. |
| `node-cron` | Production | Handles background scheduling tasks to check for upcoming reminder offsets. |
| `nodemon` | Development | Monitors backend source files and automatically restarts the local server on changes. |

---

## 📂 Initialization Steps

1.  **Created Directories**:
    *   `server/config/`
    *   `server/controllers/`
    *   `server/middleware/`
    *   `server/models/`
    *   `server/routes/`
    *   `server/services/`
    *   `server/utils/`
2.  **Configured `package.json`**:
    *   Setup dependencies and scripts: `"start": "node server.js"` and `"dev": "nodemon server.js"`.
3.  **Wrote `server.js`**:
    *   Starts a basic Express application listening on `PORT 5000` (or dynamic environment port).
    *   Serves a sanity check route: `GET /` returning `{ "status": "ok", "message": "CP Scheduler API is working!" }`.
4.  **Wrote `.env` & `.gitignore`**:
    *   Configures placeholder environment variables.
    *   Excludes `node_modules` and confidential `.env` files from Git commits.

---

## 🚀 Running the Server Locally

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the backend packages:
   ```bash
   npm install
   ```
3. Start the dev server with nodemon auto-refresh:
   ```bash
   npm run dev
   ```
4. Verify by opening your browser to `http://localhost:5000/`. You should receive:
   ```json
   {
     "status": "ok",
     "message": "CP Scheduler API is working!"
   }
   ```
