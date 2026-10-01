import express from 'express';
import {
  create,
  list,
  getOne,
  update,
  remove,
  uploadInvoice,
} from '../controllers/shipment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { validateObjectId } from '../middleware/validateId.middleware.js';
import { createShipmentSchema, updateShipmentSchema } from '../validations/shipment.validation.js';
import { uploadMiddleware, handleMulterError } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createShipmentSchema), create);
router.get('/', list);
router.get('/:id', validateObjectId('id'), getOne);
router.put('/:id', validateObjectId('id'), validate(updateShipmentSchema), update);
router.delete('/:id', validateObjectId('id'), remove);

router.post(
  '/:id/invoice',
  validateObjectId('id'),
  uploadMiddleware,
  handleMulterError,
  uploadInvoice
);

export default router;
