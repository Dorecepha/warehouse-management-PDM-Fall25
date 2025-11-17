import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be a positive number'),
  stockQuantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  description: z.string().optional(),
  categoryId: z
    .number({ invalid_type_error: 'You must select a category' })
    .min(1, 'You must select a category'),
});

export const productFormDefaultValues = {
  name: '',
  sku: '',
  price: 0,
  stockQuantity: 0,
  description: '',
  categoryId: 0,
};
