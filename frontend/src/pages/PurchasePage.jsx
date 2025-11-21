import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseForm from '../features/transactions/PurchaseForm';
import { purchaseFormDefaultValues } from '../features/transactions/purchaseSchema';
import { usePurchaseTransaction } from '../features/transactions/api';
import { useProducts } from '../features/products/api';
import { useSuppliers } from '../features/suppliers/api';

function PurchasePage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { mutate, isPending, error } = usePurchaseTransaction();

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    limit: 1000,
  });
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers({
    limit: 1000,
  });

  const products = productsData?.products ?? [];
  const suppliers = suppliersData?.suppliers ?? [];

  const handleSubmit = (formData) => {
    setServerError('');
    const payload = {
      ...formData,
      transactionType: 'PURCHASE',
    };

    mutate(payload, {
      onSuccess: () => {
        navigate('/transactions');
      },
      onError: (err) => {
        setServerError(err.message || 'Failed to create purchase.');
      },
    });
  };

  const isLoading = isLoadingProducts || isLoadingSuppliers;

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Loading products and suppliers...
        </div>
      ) : (
        <PurchaseForm
          defaultValues={purchaseFormDefaultValues}
          submitLabel="Create Purchase"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          serverError={serverError || error?.message}
          products={products}
          suppliers={suppliers}
        />
      )}
    </div>
  );
}

export default PurchasePage;
