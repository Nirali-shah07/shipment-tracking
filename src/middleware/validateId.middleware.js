import mongoose from 'mongoose';
import ApiError from '../utils/apiError.js';

export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, `Invalid ${paramName}: '${id}' is not a valid ID`));
  }
  next();
};
