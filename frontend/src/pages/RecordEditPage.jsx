import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RecordForm from '../features/records/RecordForm';
import { recordFormDefaultValues } from '../features/records/schema';
import { useRecord, useUpdateRecord } from '../features/records/api';

function RecordEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useRecord(id);
  const { mutate, isPending } = useUpdateRecord();
  const [serverError, setServerError] = React.useState('');

  const defaultValues = React.useMemo(() => {
    if (!data) {
      return recordFormDefaultValues;
    }

    const parsedQuantity = Number(data.quantity ?? 0);

    return {
      name: data.name ?? '',
      quantity: Number.isNaN(parsedQuantity) ? 0 : parsedQuantity,
    };
  }, [data]);

  const handleSubmit = (values) => {
    setServerError('');
    mutate(
      { id, data: values },
      {
        onSuccess: () => {
          navigate('/records');
        },
        onError: (mutationError) => {
          setServerError(mutationError.message || 'Failed to update record.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Loading record...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Record not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Record</h1>
        <p className="text-sm text-slate-500">
          Update the record details and save your changes.
        </p>
      </header>

      <RecordForm
        defaultValues={defaultValues}
        submitLabel="Update record"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError}
      />
    </div>
  );
}

export default RecordEditPage;
