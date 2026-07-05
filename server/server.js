// Load environment variables first
require('dotenv').config();

// Run environment configuration safety checks
require('./config/envCheck')();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const apiRouter = require('./routes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Main API Routes entrypoint
app.use('/api', apiRouter);

// Sanity check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CP Scheduler API is working!'
  });
});

// Centralized Error Handler (must be the last middleware)
app.use(errorHandler);

// Establish database connection and start listening
connectDB();

// Load the automated background reminder scheduler job
require('./jobs/reminderScheduler');

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
