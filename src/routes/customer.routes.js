import express from 'express';
import { create, list, getOne, update } from '../controllers/customer.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { validateObjectId } from '../middleware/validateId.middleware.js';
import { createCustomerSchema, updateCustomerSchema } from '../validations/customer.validation.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createCustomerSchema), create);
router.get('/', list);
router.get('/:id', validateObjectId('id'), getOne);
router.put('/:id', validateObjectId('id'), validate(updateCustomerSchema), update);

export default router;
