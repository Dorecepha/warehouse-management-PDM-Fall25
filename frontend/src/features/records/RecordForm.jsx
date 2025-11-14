import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recordSchema, recordFormDefaultValues } from './schema';

function RecordForm({
  defaultValues = recordFormDefaultValues,
  submitLabel = 'Save record',
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
    resolver: zodResolver(recordSchema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitting = isSubmitting || isSubmittingProp;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Enter record name"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-slate-700"
        >
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register('quantity', { valueAsNumber: true })}
          aria-invalid={errors.quantity ? 'true' : 'false'}
        />
        {errors.quantity ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.quantity.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RecordForm;
