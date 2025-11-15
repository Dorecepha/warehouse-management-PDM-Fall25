import { z } from 'zod';

export const profileSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.password && data.password.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: 'Password must be at least 6 characters long',
      path: ['password'],
    }
  );

export const profileFormDefaultValues = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};
