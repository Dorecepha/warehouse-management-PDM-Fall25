import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../features/products/ProductForm';
import { productFormDefaultValues } from '../features/products/schema';
import { useCreateProduct } from '../features/products/api';
import { useCategories } from '../features/categories/api';

function ProductCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateProduct();
  const [serverError, setServerError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const { data: categoriesData } = useCategories({ limit: 1000 });
  const categories = categoriesData?.categories ?? [];

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

    mutate(data, {
      onSuccess: () => {
        navigate('/products');
      },
      onError: (err) => {
        setServerError(err.message || 'Failed to create product.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create New Product
        </h1>
        <p className="text-sm text-slate-500">
          Fill out the form below to add a new product to the inventory.
        </p>
      </header>

      <ProductForm
        defaultValues={productFormDefaultValues}
        submitLabel="Create Product"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError || error?.message}
        categories={categories}
        onImageChange={handleImageChange}
        imageUrl={imageUrl}
      />
    </div>
  );
}

export default ProductCreatePage;
