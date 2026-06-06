const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const response = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  };

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    response.message = `${field} already exists`;
    res.status(400).json(response);
    return;
  }

  if (err.name === 'CastError') {
    response.message = 'Resource not found';
    res.status(404).json(response);
    return;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };