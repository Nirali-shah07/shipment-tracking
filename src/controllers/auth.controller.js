import { registerUser, loginUser } from '../services/auth.service.js';
import apiResponse from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    return apiResponse(res, 201, 'User registered successfully', user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return apiResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};
