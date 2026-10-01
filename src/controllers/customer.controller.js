import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from '../services/customer.service.js';
import apiResponse from '../utils/apiResponse.js';

export const create = async (req, res, next) => {
  try {
    const customer = await createCustomer(req.body);
    return apiResponse(res, 201, 'Customer created successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const result = await getAllCustomers(req.query);
    return apiResponse(res, 200, 'Customers fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);
    return apiResponse(res, 200, 'Customer fetched successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    return apiResponse(res, 200, 'Customer updated successfully', customer);
  } catch (error) {
    next(error);
  }
};
