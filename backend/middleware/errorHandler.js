const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Enhanced error logging
    console.error(`[${new Date().toISOString()}] Error:`, {
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body,
    });
  
    // Handle different error types
    switch (true) {
      case err.name === 'CastError':
        error = { message: `Resource not found with id of ${err.value}`, status: 404 };
        break;
      case err.code === 11000:
        error = { message: 'Duplicate field value entered', status: 400 };
        break;
      case err.name === 'ValidationError':
        error = { message: Object.values(err.errors).map(val => val.message), status: 400 };
        break;
      case err.name === 'JsonWebTokenError':
        error = { message: 'Invalid token', status: 401 };
        break;
      case err.name === 'TokenExpiredError':
        error = { message: 'Token expired', status: 401 };
        break;
      case err.name === 'RateLimitError':
        error = { message: 'Too many requests', status: 429 };
        break;
      default:
        error.status = error.status || 500;
    }
  
    res.status(error.status).json({
      success: false,
      error: error.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = errorHandler;
