import Shipment from '../models/shipment.model.js';
import Customer from '../models/customer.model.js';
import ApiError from '../utils/apiError.js';

export const createShipment = async (data) => {
  const customer = await Customer.findById(data.customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const shipment = await Shipment.create(data);
  return shipment.populate('customerId', 'name email companyName');
};

export const getAllShipments = async (query) => {
  const { page = 1, limit = 10, status, shipmentType, customerId, search } = query;

  const filter = {};

  if (status) filter.status = status;
  if (shipmentType) filter.shipmentType = shipmentType;
  if (customerId) filter.customerId = customerId;

  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { origin: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } },
      { vehicleNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [shipments, total] = await Promise.all([
    Shipment.find(filter)
      .populate('customerId', 'name email companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Shipment.countDocuments(filter),
  ]);

  return {
    shipments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getShipmentById = async (id) => {
  const shipment = await Shipment.findById(id).populate('customerId', 'name email phone companyName address');
  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }
  return shipment;
};

export const updateShipment = async (id, data) => {
  if (data.customerId) {
    const customer = await Customer.findById(data.customerId);
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }
  }

  const shipment = await Shipment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('customerId', 'name email companyName');

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  return shipment;
};

export const deleteShipment = async (id) => {
  const shipment = await Shipment.findByIdAndDelete(id);
  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }
  return shipment;
};

export const uploadInvoiceFile = async (id, fileInfo) => {
  const shipment = await Shipment.findByIdAndUpdate(
    id,
    { invoiceFile: fileInfo },
    { new: true, runValidators: true }
  ).populate('customerId', 'name email companyName');

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  return shipment;
};
