import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, productFormDefaultValues } from './schema';

function ProductForm({
  defaultValues = productFormDefaultValues,
  submitLabel = 'Save Product',
  onSubmit = () => {},
  mode = 'create',
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

  const nameBoxRef = React.useRef(null);
  const descBoxRef = React.useRef(null);
  const rightColRef = React.useRef(null);
  const previewRef = React.useRef(null);

  React.useEffect(() => {
    function syncPreview() {
      const nb = nameBoxRef.current;
      const db = descBoxRef.current;
      const rc = rightColRef.current;
      const pv = previewRef.current;
      if (!nb || !db || !rc || !pv) return;
      pv.style.marginBottom = '32px';

      const isMd = window.matchMedia('(min-width: 768px)').matches;
      if (!isMd) {
        pv.style.height = '';
        pv.style.width = '';
        pv.style.marginTop = '';
        pv.style.marginLeft = '';
        pv.style.marginRight = '';
        return;
      }

      const nameTop = nb.getBoundingClientRect().top;
      const descBottom = db.getBoundingClientRect().bottom;
      const rightTop = rc.getBoundingClientRect().top;

      const measuredHeight = Math.max(0, Math.round(descBottom - nameTop));
      const offsetTop = Math.max(0, Math.round(nameTop - rightTop));

      const rcStyles = getComputedStyle(rc);
      const rcWidth =
        rc.getBoundingClientRect().width -
        parseFloat(rcStyles.paddingLeft) -
        parseFloat(rcStyles.paddingRight);

      const side = Math.max(0, Math.min(measuredHeight, rcWidth));

      pv.style.marginTop = `${offsetTop}px`;
      pv.style.width = `${side}px`;
      pv.style.height = `${side}px`;
      pv.style.marginLeft = 'auto';
      pv.style.marginRight = 'auto';
    }

    const ro = new ResizeObserver(syncPreview);
    nameBoxRef.current && ro.observe(nameBoxRef.current);
    descBoxRef.current && ro.observe(descBoxRef.current);
    rightColRef.current && ro.observe(rightColRef.current);

    window.addEventListener('resize', syncPreview);
    requestAnimationFrame(syncPreview);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncPreview);
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-[40px] border border-slate-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <div className="space-y-1 mb-6">
        <h2 className="text-[40px] font-inter font-bold text-slate-800">
          {mode === 'create' ? 'New Product' : 'Edit Product'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-1">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-[19px] font-inter font-normal text-slate-700"
            >
              Product Name
            </label>
            <div
              ref={nameBoxRef}
              className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300"
            >
              <input
                id="name"
                type="text"
                className="w-full bg-transparent outline-none"
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="sku"
              className="block text-[19px] font-inter font-normal text-slate-700"
            >
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
            {errors.sku && (
              <p className="text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-[19px] font-normal font-inter text-slate-700"
            >
              Description
            </label>
            <div
              ref={descBoxRef}
              className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300"
            >
              <textarea
                id="description"
                rows={8}
                className="w-full bg-transparent outline-none"
                {...register('description')}
                aria-invalid={errors.description ? 'true' : 'false'}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-[19px] font-normal font-inter text-slate-700"
            >
              Price
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
              <input
                id="price"
                type="number"
                className="w-full bg-transparent outline-none"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stockQuantity"
              className="block text-[19px] font-inter font-normal text-slate-700"
            >
              Stock Quantity
            </label>
            <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
              <input
                id="stockQuantity"
                type="number"
                className="w-full bg-transparent outline-none"
                {...register('stockQuantity', { valueAsNumber: true })}
              />
              {errors.stockQuantity && (
                <p className="text-sm text-red-600">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          ref={rightColRef}
          className="space-y-4 md:col-span-1 md:flex md:flex-col md:items-center"
        >
          <div
            ref={previewRef}
            className="
              w-2/3 md:w-auto aspect-square md:aspect-auto mx-auto
              grid place-items-center
              bg-gray-200 rounded-[30px] hover:bg-gray-300
              transition duration-300 ease-in-out overflow-hidden
            "
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <span className="text-sm text-slate-500 text-center">
                Image preview
              </span>
            )}
          </div>
          <div className="md:self-start w-full mt-10">
            <div className="flex items-center justify-between gap-3 w-full">
              <label className="text-[19px] font-inter font-normal text-slate-700 whitespace-nowrap">
                Product Image
              </label>

              <div className="flex-1">
                <div className="px-3 py-2 bg-gray-100 rounded-full border border-black text-sm text-slate-700 truncate">
                  {imageUrl ? imageUrl.split('/').pop() : 'No file selected'}
                </div>
              </div>

              <label
                htmlFor="imageFile"
                className="cursor-pointer bg-black text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-black/80 transition whitespace-nowrap"
              >
                Browse
              </label>
            </div>

            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />

            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
            <div className="space-y-2 mt-5">
              <label
                htmlFor="categoryId"
                className="block text-[19px] font-inter font-normal text-slate-700"
              >
                Category
              </label>
              <div className="bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition duration-300">
                <select
                  id="categoryId"
                  className="w-full bg-transparent outline-none"
                  {...register('categoryId', { valueAsNumber: true })}
                >
                  <option value={0}>Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="w-full flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
