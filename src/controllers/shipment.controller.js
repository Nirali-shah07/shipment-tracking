import {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  uploadInvoiceFile,
} from '../services/shipment.service.js';
import apiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

export const create = async (req, res, next) => {
  try {
    const shipment = await createShipment(req.body);
    return apiResponse(res, 201, 'Shipment created successfully', shipment);
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const result = await getAllShipments(req.query);
    return apiResponse(res, 200, 'Shipments fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const shipment = await getShipmentById(req.params.id);
    return apiResponse(res, 200, 'Shipment fetched successfully', shipment);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const shipment = await updateShipment(req.params.id, req.body);
    return apiResponse(res, 200, 'Shipment updated successfully', shipment);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteShipment(req.params.id);
    return apiResponse(res, 200, 'Shipment deleted successfully', null);
  } catch (error) {
    next(error);
  }
};

export const uploadInvoice = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'No file uploaded'));
    }

    const fileInfo = {
      originalName: req.file.originalname,
      fileName: req.file.filename || req.file.key,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storageType: req.file.location ? 's3' : 'local',
      path: req.file.path || null,
      url: req.file.location || `/uploads/invoices/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    const shipment = await uploadInvoiceFile(req.params.id, fileInfo);
    return apiResponse(res, 200, 'Invoice uploaded successfully', shipment);
  } catch (error) {
    next(error);
  }
};
