import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useTransaction,
  useUpdateTransaction,
} from '../features/transactions/api';

const DetailCard = ({ title, children }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    </div>
    <div className="space-y-3 p-4">{children}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

function TransactionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useTransaction(id);
  const [status, setStatus] = useState('');
  const [serverError, setServerError] = useState('');

  const updateMutation = useUpdateTransaction();

  useEffect(() => {
    if (data?.transaction) {
      setStatus(data.transaction.status);
    }
  }, [data]);

  const handleUpdateStatus = () => {
    setServerError('');
    updateMutation.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          navigate('/transactions');
        },
        onError: (err) => {
          setServerError(err.message || 'Failed to update status.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Loading transaction...
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

  const tx = data?.transaction;

  if (!tx) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Transaction not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Transaction Details
        </h1>
        <p className="text-sm text-slate-500">
          ID: {tx.id} ({tx.transactionType})
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailCard title="Transaction Information">
          <DetailRow label="Type" value={tx.transactionType} />
          <DetailRow label="Status" value={tx.status} />
          <DetailRow label="Total Products" value={tx.totalProducts} />
          <DetailRow
            label="Total Price"
            value={`$${tx.totalPrice?.toFixed(2)}`}
          />
          <DetailRow
            label="Created At"
            value={new Date(tx.createdAt).toLocaleString()}
          />
          {tx.updatedAt && (
            <DetailRow
              label="Updated At"
              value={new Date(tx.updatedAt).toLocaleString()}
            />
          )}
          <DetailRow label="Description" value={tx.description || 'N/A'} />
          <DetailRow label="Note" value={tx.note || 'N/A'} />
        </DetailCard>

        <DetailCard title="Product Information">
          <DetailRow label="Name" value={tx.product.name} />
          <DetailRow label="SKU" value={tx.product.sku} />
          <DetailRow label="Price" value={`$${tx.product.price?.toFixed(2)}`} />
        </DetailCard>

        <DetailCard title="User Information">
          <DetailRow label="Name" value={tx.user.name} />
          <DetailRow label="Email" value={tx.user.email} />
          <DetailRow label="Phone" value={tx.user.phoneNumber} />
          <DetailRow label="Role" value={tx.user.role} />
        </DetailCard>

        {tx.supplier && (
          <DetailCard title="Supplier Information">
            <DetailRow label="Name" value={tx.supplier.name} />
            <DetailRow label="Contact" value={tx.supplier.contactInfo} />
            <DetailRow label="Address" value={tx.supplier.address} />
          </DetailCard>
        )}

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-700"
          >
            Update Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button
            onClick={handleUpdateStatus}
            disabled={updateMutation.isPending}
            className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending ? 'Updating…' : 'Update Status'}
          </button>
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsPage;
