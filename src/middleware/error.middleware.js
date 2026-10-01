import ApiError from '../utils/apiError.js';
import { logger } from '../utils/logger.js';


export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return next(new ApiError(400, 'Validation failed', errors));
  }

  req.body = result.data;
  next();
};

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} → ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode && err.statusCode < 500 ? err.message : 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
