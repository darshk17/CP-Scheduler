/**
 * Centralized global error handling middleware for the Express application.
 */
module.exports = (err, req, res, next) => {
  console.error('💥 ERROR DETAILS:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      status: 'error',
      message: `Invalid input data: ${messages.join(', ')}`
    });
  }

  // Handle duplicate key errors (e.g. email duplication)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: 'error',
      message: `Duplicate value entered for field: ${field}. Please use another value.`
    });
  }

  // Handle generic JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'error', message: 'Invalid token. Please log in again.' });
  }

  // Handle expired JWT error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'error', message: 'Your token has expired. Please log in again.' });
  }

  // Default server errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';

  res.status(statusCode).json({
    status: err.status || 'error',
    message
  });
};
