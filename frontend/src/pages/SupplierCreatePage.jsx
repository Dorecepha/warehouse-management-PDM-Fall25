import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierForm from '../features/suppliers/SupplierForm';
import { supplierFormDefaultValues } from '../features/suppliers/schema';
import { useCreateSupplier } from '../features/suppliers/api';

function SupplierCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateSupplier();
  const [serverError, setServerError] = useState('');

  const handleSubmit = (formData) => {
    setServerError('');
    mutate(formData, {
      onSuccess: () => {
        navigate('/suppliers');
      },
      onError: (err) => {
        setServerError(err.message || 'Failed to create supplier.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create New Supplier
        </h1>
        <p className="text-sm text-slate-500">
          Fill out the form below to add a new supplier.
        </p>
      </header>

      <SupplierForm
        defaultValues={supplierFormDefaultValues}
        submitLabel="Create Supplier"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError || error?.message}
      />
    </div>
  );
}

export default SupplierCreatePage;
