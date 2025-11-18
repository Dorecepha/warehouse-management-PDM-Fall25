import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseSchema, purchaseFormDefaultValues } from './purchaseSchema';

function PurchaseForm({
  defaultValues = purchaseFormDefaultValues,
  submitLabel = 'Create Purchase',
  onSubmit = () => {},
  isSubmitting: isSubmittingProp = false,
  serverError,
  products = [],
  suppliers = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitting = isSubmitting || isSubmittingProp;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-[867px] min-h-[500px] rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm"
      noValidate
    >
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">
        Receive Inventory
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Add new stock into the inventory and record this transaction.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y- md:col-span-2">
          <label
            htmlFor="supplierId"
            className="block text-sm font-medium text-slate-700"
          >
            Supplier
          </label>
          <select
            id="supplierId"
            className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-sm focus:bg-white focus:border-[#3E3998] focus:ring-2 focus:ring-[#3E3998]/20"
            {...register('supplierId', { valueAsNumber: true })}
            aria-invalid={errors.supplierId ? 'true' : 'false'}
          >
            <option value={0}>Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplierId ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.supplierId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-slate-700"
          >
            Product
          </label>
          <select
            id="productId"
            className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-sm focus:bg-white focus:border-[#3E3998] focus:ring-2 focus:ring-[#3E3998]/20"
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
            className="block text-sm font-medium text-slate-700"
          >
            Quantity to Purchase
          </label>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-sm focus:bg-white focus:border-[#3E3998] focus:ring-2 focus:ring-[#3E3998]/20"
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
            className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-sm focus:bg-white focus:border-[#3E3998] focus:ring-2 focus:ring-[#3E3998]/20"
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
            className="w-full rounded-lg bg-slate-100 border-transparent px-4 py-3 text-sm focus:bg-white focus:border-[#3E3998] focus:ring-2 focus:ring-[#3E3998]/20"
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

      <div className="mt-8">
        <button
          type="submit"
          className="w-full rounded-lg bg-[#3E3998] py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Creating Purchase…' : 'Purchase Product'}
        </button>
      </div>
    </form>
  );
}

export default PurchaseForm;
