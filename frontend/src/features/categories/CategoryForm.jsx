import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, categoryFormDefaultValues } from './schema';

function CategoryForm({
  defaultValues = categoryFormDefaultValues,
  submitLabel = 'Save Category',
  onSubmit = () => {},
  isSubmitting: isSubmittingProp = false,
  serverError,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitting = isSubmitting || isSubmittingProp;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6" noValidate>
        
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Category Name</label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g. Electronics"
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {serverError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
export { categoryFormDefaultValues };
