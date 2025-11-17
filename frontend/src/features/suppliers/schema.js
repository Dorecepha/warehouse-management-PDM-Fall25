import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactInfo: z.string().min(1, 'Contact info is required'),
  address: z.string().min(1, 'Address is required'),
});

export const supplierFormDefaultValues = {
  name: '',
  contactInfo: '',
  address: '',
};
