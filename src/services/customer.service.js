import Customer from '../models/customer.model.js';
import ApiError from '../utils/apiError.js';

export const createCustomer = async (data) => {
  const existing = await Customer.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(400, 'A customer with this email already exists');
  }
  const customer = await Customer.create(data);
  return customer;
};

export const getAllCustomers = async (query) => {
  const { page = 1, limit = 10, search, isActive } = query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }
  return customer;
};

export const updateCustomer = async (id, data) => {
  if (data.email) {
    const existing = await Customer.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(400, 'A customer with this email already exists');
    }
  }

  const customer = await Customer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  return customer;
};
