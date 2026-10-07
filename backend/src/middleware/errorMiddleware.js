const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
