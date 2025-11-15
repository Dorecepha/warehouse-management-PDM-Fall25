import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../features/products/ProductForm';
import { productFormDefaultValues } from '../features/products/schema';
import { useProduct, useUpdateProduct } from '../features/products/api';
import { useCategories } from '../features/categories/api';

function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: productError,
  } = useProduct(id);

  const { data: categoriesData } = useCategories({ limit: 1000 });
  const categories = categoriesData?.categories ?? [];

  const { mutate, isPending, error: updateError } = useUpdateProduct();
  const [serverError, setServerError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const defaultValues = useMemo(() => {
    if (!productData) {
      return productFormDefaultValues;
    }

    setImageUrl(productData.product.imageUrl || '');

    return {
      name: productData.product.name ?? '',
      sku: productData.product.sku ?? '',
      price: productData.product.price ?? 0,
      stockQuantity: productData.product.stockQuantity ?? 0,
      description: productData.product.description ?? '',
      categoryId: productData.product.categoryId ?? 0,
    };
  }, [productData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (formData) => {
    setServerError('');

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (imageFile) {
      data.append('imageFile', imageFile);
    }

    mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate('/products');
        },
        onError: (err) => {
          setServerError(err.message || 'Failed to update product.');
        },
      }
    );
  };

  if (isLoadingProduct) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Loading product...
      </div>
    );
  }

  if (isErrorProduct) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        {productError.message || 'Failed to load product.'}
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Product: {productData.product.name}
        </h1>
        <p className="text-sm text-slate-500">
          Update the product details and save your changes.
        </p>
      </header>

      <ProductForm
        defaultValues={defaultValues}
        submitLabel="Update Product"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError || updateError?.message}
        categories={categories}
        onImageChange={handleImageChange}
        imageUrl={imageUrl}
      />
    </div>
  );
}

export default ProductEditPage;
