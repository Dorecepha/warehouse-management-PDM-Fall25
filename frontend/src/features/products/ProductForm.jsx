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
        <div className="space-y-4 md:col-span-1">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-[19px] font-inter font-normal text-slate-700">
              Product Name
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
              <input
                id="name"
                type="text"
                className="w-full bg-transparent outline-none"
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
            <label htmlFor="sku" className="block text-[19px] font-inter font-normal text-slate-700">
              SKU
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
            <input
              id="sku"
              type="text"
              className="w-full bg-transparent outline-none"
              {...register('sku')}
              aria-invalid={errors.sku ? 'true' : 'false'}
            />
            </div>
            {errors.sku ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.sku.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-[19px] font-normal font-inter text-slate-700">
              Description
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
            <textarea
              id="description"
              rows={3}
              className="w-full bg-transparent outline-none"
              {...register('description')}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            </div>
            {errors.description ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="block text-[19px] font-normal font-inter text-slate-700">
              Price
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
            <input
              id="price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="w-full bg-transparent outline-none"
              {...register('price', { valueAsNumber: true })}
              aria-invalid={errors.price ? 'true' : 'false'}
            />
            {errors.price ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.price.message}
              </p>
            ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="stockQuantity" className="block text-[19px] font-inter font-normal text-slate-700">
              Stock Quantity
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
            <input
              id="stockQuantity"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              className="w-full bg-transparent outline-none "
              {...register('stockQuantity', { valueAsNumber: true })}
              aria-invalid={errors.stockQuantity ? 'true' : 'false'}
            />
            {errors.stockQuantity ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.stockQuantity.message}
              </p>
            ) : null}
          </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
            <select
              id="categoryId"
              className="w-full bg-transparent outline-none"
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
          </div>
        </div>

<div className="space-y-4 md:col-span-1 md:flex md:flex-col md:items-center md:mt-9">
  <div className="w-2/3 aspect-square flex items-center justify-center bg-gray-200 rounded-[30px] hover:bg-gray-300 transition duration-300 ease-in-out overflow-hidden">
    {imageUrl ? (
      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover object-center" />
    ) : (
      <span className="text-sm text-slate-500">Image preview</span>
    )}
  </div>

  <div className="md:self-start">
    <label htmlFor="imageFile" className="block text-sm font-medium text-slate-700">
      Product Image
    </label>
    <input
      id="imageFile"
      type="file"
      accept="image/*"
      onChange={onImageChange}
      className="w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
    />
  </div>
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
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
