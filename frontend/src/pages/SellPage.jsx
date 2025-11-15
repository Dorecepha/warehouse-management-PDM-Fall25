import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellForm from '../features/transactions/SellForm';
import { sellFormDefaultValues } from '../features/transactions/sellSchema';
import { useCreateTransaction } from '../features/transactions/api';
import { useProducts } from '../features/products/api';

function SellPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { mutate, isPending, error } = useCreateTransaction();

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    limit: 1000,
  });
  const products = productsData?.products ?? [];

  const handleSubmit = (formData) => {
    setServerError('');
    const payload = {
      ...formData,
      transactionType: 'SALE',
    };

    mutate(payload, {
      onSuccess: () => {
        navigate('/transactions');
      },
      onError: (err) => {
        setServerError(err.message || 'Failed to create sale.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Record New Sale
        </h1>
        <p className="text-sm text-slate-500">
          Remove stock from your inventory by recording a sale.
        </p>
      </header>

      {isLoadingProducts ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Loading products...
        </div>
      ) : (
        <SellForm
          defaultValues={sellFormDefaultValues}
          submitLabel="Create Sale"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          serverError={serverError || error?.message}
          products={products}
        />
      )}
    </div>
  );
}

export default SellPage;
