import { z } from 'zod';

export const recordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
});

export const recordFormDefaultValues = {
  name: '',
  quantity: 0,
};
