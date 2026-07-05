# Phase 5: MongoDB Integration Instructions

This phase explains how to connect your backend application to MongoDB Atlas using Mongoose, featuring proper connection configurations and error safety nets.

---

## 📚 Core Database Concepts

Before writing any code, it is important to understand the role of each component in your data layer:

### 1. What is MongoDB?
MongoDB is a **NoSQL (non-relational) database** that stores data in flexible, JSON-like formats called BSON (Binary JSON). Unlike relational databases (SQL) that require strict tables, columns, and relationships, MongoDB allows you to store variable structures easily.

### 2. What is Mongoose?
Mongoose is an **ODM (Object Data Modeling) library** for MongoDB and Node.js. It acts as a bridge between your application code and the database, allowing you to define structured schemas, validate input data, and query documents using clean JavaScript methods instead of raw database commands.

### 3. What is a Collection?
A **Collection** in NoSQL is equivalent to a **Table** in relational databases. It is a grouping of related documents. For example, you will have a `users` collection for user accounts and a `contests` collection for scheduled contest metadata.

### 4. What is a Document?
A **Document** is a single record in a collection, equivalent to a **Row** in SQL. It is written as a set of key-value pairs. Here is an example of a User Document:
```json
{
  "_id": "60d5ec49f1b2c82b988f0a2c",
  "username": "alex_coder",
  "email": "alex@example.com"
}
```

### 5. Why use MongoDB Atlas?
MongoDB Atlas is a **fully managed cloud database service**. Instead of downloading, configuring, and hosting MongoDB locally on your laptop (which is hard to deploy and share), Atlas hosts it on AWS/Google Cloud. It provides:
*   A free tier cluster.
*   Automatic scaling and cloud backups.
*   Easy dashboard access to view your data from anywhere.

---

## 🛠 Step-by-Step Connection Guide

Follow these steps to connect your server:

### Step 1: Update your Environment variables
Open `server/.env` and replace `MONGODB_URI` with your connection string obtained from the MongoDB Atlas console (make sure to replace `<password>` and the database name inside the connection string):
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/cp-scheduler?retryWrites=true&w=majority
```

### Step 2: Create the Database Connection Script
Create a new file at `server/config/db.js` and write the connection function:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // Stop the server process if connection fails
  }
};

module.exports = connectDB;
```

### Step 3: Call the script in `server.js`
Open `server/server.js` and edit it to import the connection script and call it before starting your server:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // 1. Import connection script

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB(); // 2. Trigger connection

// Middleware
app.use(cors());
app.use(express.json());

// Sanity check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CP Scheduler API is working!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
```

---

## 🔍 Verifying the Connection
1. Save your files.
2. If your server is running in development mode (`npm run dev`), the terminal will automatically restart.
3. Check the logs. If successful, you will see:
   ```text
   Server is running in development mode on port 5000
   MongoDB Connected: cluster-name.mongodb.net
   ```
4. If it fails, check if your MongoDB Atlas IP Whitelist allows access, and verify that the password in `.env` does not contain unescaped special characters.
