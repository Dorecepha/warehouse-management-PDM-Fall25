import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SupplierForm from '../features/suppliers/SupplierForm';
import { supplierFormDefaultValues } from '../features/suppliers/schema';
import { useSupplier, useUpdateSupplier } from '../features/suppliers/api';

function SupplierEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: supplierData,
    isLoading: isLoadingSupplier,
    isError: isErrorSupplier,
    error: supplierError,
  } = useSupplier(id);

  const { mutate, isPending, error: updateError } = useUpdateSupplier();
  const [serverError, setServerError] = useState('');

  const defaultValues = useMemo(() => {
    if (!supplierData) {
      return supplierFormDefaultValues;
    }
    return {
      name: supplierData.supplier.name ?? '',
      contactInfo: supplierData.supplier.contactInfo ?? '',
      address: supplierData.supplier.address ?? '',
    };
  }, [supplierData]);

  const handleSubmit = (formData) => {
    setServerError('');
    mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate('/suppliers');
        },
        onError: (err) => {
          setServerError(err.message || 'Failed to update supplier.');
        },
      }
    );
  };

  if (isLoadingSupplier) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Loading supplier...
      </div>
    );
  }

  if (isErrorSupplier) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        {supplierError.message || 'Failed to load supplier.'}
      </div>
    );
  }

  if (!supplierData) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Supplier not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Supplier: {supplierData.supplier.name}
        </h1>
        <p className="text-sm text-slate-500">
          Update the supplier details and save your changes.
        </p>
      </header>

      <SupplierForm
        defaultValues={defaultValues}
        submitLabel="Update Supplier"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError || updateError?.message}
      />
    </div>
  );
}

export default SupplierEditPage;
