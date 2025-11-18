import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sellSchema, sellFormDefaultValues } from './sellSchema';

function SellForm({
  defaultValues = sellFormDefaultValues,
  onSubmit = () => {},
  isSubmitting: isSubmittingProp = false,
  serverError,
  products = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sellSchema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitting = isSubmitting || isSubmittingProp;

  const onFormSubmit = (formData) => {
    const selectedProduct = products.find((p) => p.id === formData.productId);

    if (!selectedProduct) {
      setError('productId', { message: 'Product not found' });
      return;
    }

    if (formData.quantity > selectedProduct.stockQuantity) {
      setError('quantity', {
        type: 'manual',
        message: `Not enough stock! Only ${selectedProduct.stockQuantity} available.`,
      });
      return;
    }

    clearErrors('quantity');
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="mx-auto max-w-[867px] min-h-[500px] rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm"
      noValidate
    >
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-900">Sell Product</h1>
        <p className="mt-2 text-sm text-slate-500">
          Fill in the form to record a sale and remove stock.
        </p>
      </header>

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-slate-900"
          >
            Select Product
          </label>
          <select
            id="productId"
            className="w-full rounded-lg border-transparent bg-slate-100 px-4 py-3 text-sm focus:border-[#3E3998] focus:bg-white focus:ring-2 focus:ring-[#3E3998]/20"
            {...register('productId', { valueAsNumber: true })}
            aria-invalid={errors.productId ? 'true' : 'false'}
          >
            <option value={0}>Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Qty: {product.stockQuantity})
              </option>
            ))}
          </select>
          {errors.productId ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.productId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-slate-900"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            className="w-full rounded-lg border-transparent bg-slate-100 px-4 py-3 text-sm focus:border-[#3E3998] focus:bg-white focus:ring-2 focus:ring-[#3E3998]/20"
            {...register('quantity', { valueAsNumber: true })}
            aria-invalid={errors.quantity ? 'true' : 'false'}
          />
          {errors.quantity ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.quantity.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-900"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={2}
            className="w-full rounded-lg border-transparent bg-slate-100 px-4 py-3 text-sm focus:border-[#3E3998] focus:bg-white focus:ring-2 focus:ring-[#3E3998]/20"
            {...register('description')}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-slate-900"
          >
            Note
          </label>
          <textarea
            id="note"
            rows={2}
            className="w-full rounded-lg border-transparent bg-slate-100 px-4 py-3 text-sm focus:border-[#3E3998] focus:bg-white focus:ring-2 focus:ring-[#3E3998]/20"
            {...register('note')}
            aria-invalid={errors.note ? 'true' : 'false'}
          />
        </div>
      </div>

      {serverError ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <div className="mt-8">
        <button
          type="submit"
          className="w-full rounded-lg bg-[#3E3998] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Selling...' : 'Sell Product'}
        </button>
      </div>
    </form>
  );
}

export default SellForm;
