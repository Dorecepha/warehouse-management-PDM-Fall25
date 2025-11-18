import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, productFormDefaultValues } from './schema';

function ProductForm({
  defaultValues = productFormDefaultValues,
  submitLabel = 'Save Product',
  onSubmit = () => {},
  isSubmitting: isSubmittingProp = false,
  serverError,
  categories = [],
  onImageChange,
  imageUrl,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
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
        <div className="space-y-2">
          <label style={{width: '100%', height: '100%', color: 'black', fontSize: 19, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>
            Product Name
          </label>
          <div style ={{ width: '432px',height: '36px',background: '#F0F0F0',borderRadius: '10px',padding: '0 12px',display: 'flex',alignItems: 'center'}}>
          <input
            id="name"
            type="text"
            style={{width: '100%', height: '60%', background: '#F0F0F0', borderRadius: 10, padding : '0rem 0.5rem'}}
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          </div>
          {errors.name ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-slate-700"
          >
            SKU
          </label>
          <input
            id="sku"
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('sku')}
            aria-invalid={errors.sku ? 'true' : 'false'}
          />
          {errors.sku ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.sku.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-700"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={errors.price ? 'true' : 'false'}
          />
          {errors.price ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.price.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="stockQuantity"
            className="block text-sm font-medium text-slate-700"
          >
            Stock Quantity
          </label>
          <input
            id="stockQuantity"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('stockQuantity', { valueAsNumber: true })}
            aria-invalid={errors.stockQuantity ? 'true' : 'false'}
          />
          {errors.stockQuantity ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.stockQuantity.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('categoryId', { valueAsNumber: true })}
            aria-invalid={errors.categoryId ? 'true' : 'false'}
          >
            <option value={0}>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.categoryId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('description')}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.description.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="imageFile"
          className="block text-sm font-medium text-slate-700"
        >
          Product Image
        </label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-4 h-32 w-32 rounded-md object-cover ring-1 ring-slate-200"
          />
        )}
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

export default ProductForm;
