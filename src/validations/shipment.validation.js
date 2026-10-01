import { z } from 'zod';

export const createShipmentSchema = z.object({
  customerId: z
    .string({ required_error: 'Customer ID is required' })
    .regex(/^[a-f\d]{24}$/i, 'Invalid Customer ID format'),

  invoiceNumber: z
    .string({ required_error: 'Invoice number is required' })
    .min(1, 'Invoice number cannot be empty')
    .trim(),

  invoiceValue: z
    .number({ required_error: 'Invoice value is required' })
    .positive('Invoice value must be a positive number'),

  currency: z.string().trim().toUpperCase().optional(),

  origin: z
    .string({ required_error: 'Origin is required' })
    .min(2, 'Origin must be at least 2 characters')
    .trim(),

  destination: z
    .string({ required_error: 'Destination is required' })
    .min(2, 'Destination must be at least 2 characters')
    .trim(),

  vehicleNumber: z
    .string({ required_error: 'Vehicle number is required' })
    .min(2, 'Vehicle number must be at least 2 characters')
    .trim(),

  shipmentType: z.enum(['Import', 'Export'], {
    required_error: 'Shipment type is required',
    message: 'Shipment type must be Import or Export',
  }),

  status: z
    .enum(['Created', 'In Transit', 'Delivered', 'Cancelled'], {
      message: 'Invalid status value',
    })
    .optional(),

  description: z.string().trim().optional(),
});

export const updateShipmentSchema = z.object({
  customerId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid Customer ID format')
    .optional(),

  invoiceNumber: z.string().min(1).trim().optional(),

  invoiceValue: z.number().positive('Invoice value must be a positive number').optional(),

  currency: z.string().trim().toUpperCase().optional(),

  origin: z.string().min(2).trim().optional(),

  destination: z.string().min(2).trim().optional(),

  vehicleNumber: z.string().min(2).trim().optional(),

  shipmentType: z.enum(['Import', 'Export']).optional(),

  status: z.enum(['Created', 'In Transit', 'Delivered', 'Cancelled']).optional(),

  description: z.string().trim().optional(),
});
