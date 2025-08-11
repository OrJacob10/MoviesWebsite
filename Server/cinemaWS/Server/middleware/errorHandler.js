// error handler is a middleware that stracturing an error with status code and message
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      error: {
        status: statusCode,
        message: err.message || "Internal Server Error",
      },
    });
  };
  
module.exports = errorHandler;