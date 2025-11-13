import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecordForm from '../features/records/RecordForm';
import { recordFormDefaultValues } from '../features/records/schema';
import { useCreateRecord } from '../features/records/api';

function RecordCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateRecord();
  const [serverError, setServerError] = React.useState('');

  const handleSubmit = (values) => {
    setServerError('');
    mutate(values, {
      onSuccess: () => {
        navigate('/records');
      },
      onError: (error) => {
        setServerError(error.message || 'Failed to create record.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Create Record</h1>
        <p className="text-sm text-slate-500">Fill out the form below to add a new warehouse record.</p>
      </header>

      <RecordForm
        defaultValues={recordFormDefaultValues}
        submitLabel="Create record"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        serverError={serverError}
      />
    </div>
  );
}

export default RecordCreatePage;
