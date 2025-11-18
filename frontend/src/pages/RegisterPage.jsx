import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import api from '../lib/axios';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const defaultValues = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await api.post('/auth/register', values);
      navigate('/login');
    } catch (error) {
      setServerError(error.message || 'Unable to register.');
    }
  };

  const hasValidationError = Object.keys(errors).length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e7f1fb] p-4">
      <div className="flex min-h-[calc(100vh-2rem)] w-full items-center justify-center rounded-[48px] border-[18px] border-[#1f5f89] bg-white p-6">
        <div className="w-full max-w-sm rounded-2xl bg-[#1f5f89] px-8 py-10 text-white">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold leading-tight">Register</h1>
            <p className="text-lg font-medium text-white/90">
              Warehouse Management System
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
            noValidate
          >
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-white"
              >
                Username
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Enter your username"
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="sr-only" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Enter your email"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="sr-only" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-white"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="text"
                autoComplete="tel"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Enter your phone number"
                {...register('phoneNumber')}
                aria-invalid={errors.phoneNumber ? 'true' : 'false'}
              />
              {errors.phoneNumber && (
                <p className="sr-only" role="alert">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Enter your password"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="sr-only" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-white"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && (
                <p className="sr-only" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {hasValidationError && (
              <p className="text-xs font-semibold text-red-300">
                Please fill out all the fields correctly
              </p>
            )}

            {serverError && (
              <p className="text-xs font-semibold text-red-100">
                {serverError}
              </p>
            )}

            <div className="pt-1 text-center">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/60 bg-white px-8 py-2 text-sm font-bold text-slate-900 transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up…' : 'SIGN UP'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-white/80">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
