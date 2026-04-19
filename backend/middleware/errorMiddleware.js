// Middleware to catch 404 Not Found errors for any unmatched routes
const notFound = (req, res, next) => {
  const error = new Error(`route not found $`);
  res.status(404);
  next(error);
};

// Global error handling middleware.
 
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

   
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
    message = 'Bad Request: Invalid input data format';
  }
  
 
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized: Invalid or missing token';
  }

  
  if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden: You do not have access to this resource';
  }

 
  if (statusCode === 404) {
    message = message || 'Not Found: The resource you requested does not exist';
  }
 
  if (statusCode === 500) {
    message = err.message
  }

  console.error(` ${statusCode} ${message}`);

  // Send the error response

  res.status(statusCode).json({
    message: message,
 
  });
};

export { notFound, errorHandler };
