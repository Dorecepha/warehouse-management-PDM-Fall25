import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import api from '../lib/axios';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const defaultValues = {
  email: '',
  password: '',
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/dashboard';
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const response = await api.post('/auth/login', values);

      const token = response.data?.token;
      const role = response.data?.role;

      if (!token || !role) {
        setServerError('Login succeeded but no token or role was returned.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to sign in.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e7f1fb] p-4">
      <div className="flex min-h-[calc(100vh-2rem)] w-full items-center justify-center rounded-[48px] border-[18px] border-[#1f5f89] bg-white p-6">
        <div className="w-full max-w-sm rounded-2xl bg-[#1f5f89] px-8 py-10 text-white">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold leading-tight">Login</h1>
            <p className="text-lg font-medium text-white/90">
              Warehouse Management System
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white"
              >
                Username
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Enter your username"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email ? (
                <p className="text-xs text-red-200" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/50 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f89] focus:outline-none"
                placeholder="Enter your password"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password ? (
                <p className="text-xs text-red-200" role="alert">
                  {errors.password.message}
                </p>
              ) : null}
              {serverError ? (
                <p className="text-xs font-semibold text-red-300">
                  Username or Password is incorrect
                </p>
              ) : null}
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/60 bg-white px-6 py-2 text-sm font-bold text-slate-900 transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'SIGN IN'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-white/80">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-white">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
