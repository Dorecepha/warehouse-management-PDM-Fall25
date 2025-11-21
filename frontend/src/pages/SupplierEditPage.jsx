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
    <div className="py-8 px-4 mx-auto max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Edit Supplier</h1>
        <p className="text-slate-500 mt-2">
          Update the information for {supplierData.supplier.name}
        </p>
      </div>

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
