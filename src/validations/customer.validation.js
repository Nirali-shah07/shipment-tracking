import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .trim(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email')
    .trim(),

  phone: z
    .string({ required_error: 'Phone is required' })
    .min(7, 'Phone must be at least 7 characters')
    .trim(),

  address: z
    .string({ required_error: 'Address is required' })
    .min(5, 'Address must be at least 5 characters')
    .trim(),

  companyName: z.string().trim().optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim().optional(),
  email: z.string().email('Please enter a valid email').trim().optional(),
  phone: z.string().min(7, 'Phone must be at least 7 characters').trim().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').trim().optional(),
  companyName: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});
