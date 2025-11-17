import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseForm from '../features/transactions/PurchaseForm';
import { purchaseFormDefaultValues } from '../features/transactions/purchaseSchema';
import { useCreateTransaction } from '../features/transactions/api';
import { useProducts } from '../features/products/api';
import { useSuppliers } from '../features/suppliers/api';

function PurchasePage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { mutate, isPending, error } = useCreateTransaction();

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
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create New Purchase
        </h1>
        <p className="text-sm text-slate-500">
          Add new stock to your inventory by recording a purchase.
        </p>
      </header>

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
