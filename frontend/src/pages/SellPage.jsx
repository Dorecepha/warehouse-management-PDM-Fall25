import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellForm from '../features/transactions/SellForm';
import { sellFormDefaultValues } from '../features/transactions/sellSchema';
import { useSellTransaction } from '../features/transactions/api';
import { useProducts } from '../features/products/api';

function SellPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { mutate, isPending, error } = useSellTransaction();

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
