import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sellSchema, sellFormDefaultValues } from './sellSchema';

function SellForm({
  defaultValues = sellFormDefaultValues,
  submitLabel = 'Create Sale',
  onSubmit = () => {},
  isSubmitting: isSubmittingProp = false,
  serverError,
  products = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sellSchema),
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-slate-700"
          >
            Product
          </label>
          <select
            id="productId"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('productId', { valueAsNumber: true })}
            aria-invalid={errors.productId ? 'true' : 'false'}
          >
            <option value={0}>Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Available Qty: {product.stockQuantity})
              </option>
            ))}
          </select>
          {errors.productId ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.productId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-slate-700"
          >
            Quantity to Sell
          </label>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min="1"
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

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={2}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('description')}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-slate-700"
          >
            Note (Optional)
          </label>
          <textarea
            id="note"
            rows={2}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('note')}
            aria-invalid={errors.note ? 'true' : 'false'}
          />
        </div>
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
          {submitting ? 'Creating Sale…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default SellForm;
