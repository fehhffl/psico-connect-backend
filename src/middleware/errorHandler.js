const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      message: message.join(', '),
      statusCode: 400
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = {
      message: `${field} já está em uso`,
      statusCode: 400
    };
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = {
      message: 'Recurso não encontrado',
      statusCode: 404
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro no servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
