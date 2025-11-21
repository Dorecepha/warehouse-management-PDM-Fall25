import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useTransaction,
  useUpdateTransaction,
} from '../features/transactions/api';

const DetailCard = ({ title, children }) => (
  <div className="h-full rounded-xl border border-slate-400 bg-white p-5">
    <h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
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
      { id, status },
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
      <div className="py-20 text-center text-slate-500">
        Loading transaction...
      </div>
    );
  }

  if (isError || !data?.transaction) {
    return (
      <div className="py-20 text-center text-red-500">
        {error?.message || 'Transaction not found.'}
      </div>
    );
  }

  const tx = data.transaction;

  return (
    <div className="min-h-[600px] rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Transaction Details
        </h1>
        <p className="text-sm text-slate-500">
          ID: {tx.id} ({tx.transactionType})
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
            value={new Date(tx.createdAt).toLocaleDateString()}
          />
          <DetailRow label="Description" value={tx.description || 'N/A'} />
          <DetailRow label="Note" value={tx.note || 'N/A'} />
        </DetailCard>

        <DetailCard title="Product Information">
          <DetailRow label="Name" value={tx.product?.name || 'Unknown'} />
          <DetailRow label="SKU" value={tx.product?.sku || 'N/A'} />
          <DetailRow
            label="Price"
            value={tx.product?.price ? `$${tx.product.price}` : 'N/A'}
          />
        </DetailCard>

        <DetailCard title="User Information">
          <DetailRow label="Name" value={tx.user?.name || 'Unknown'} />
          <DetailRow label="Email" value={tx.user?.email || 'N/A'} />
          <DetailRow label="Phone" value={tx.user?.phoneNumber || 'N/A'} />
          <DetailRow label="Role" value={tx.user?.role || 'N/A'} />
        </DetailCard>

        {tx.supplier ? (
          <DetailCard title="Supplier Information">
            <DetailRow label="Name" value={tx.supplier.name} />
            <DetailRow label="Contact" value={tx.supplier.contactInfo} />
            <DetailRow label="Address" value={tx.supplier.address} />
          </DetailCard>
        ) : (
          <div className="hidden lg:block"></div>
        )}

        <div className="rounded-xl border border-slate-400 bg-white p-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Update Status
          </h3>
          <div className="space-y-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3E3998] focus:ring-1 focus:ring-[#3E3998]"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={updateMutation.isPending}
              className="w-full rounded-lg bg-[#3E3998] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Status'}
            </button>
            {serverError && (
              <p className="text-xs text-red-600">{serverError}</p>
            )}
          </div>
        </div>

        <div className="flex items-end justify-end">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg bg-[#3E3998] px-6 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            GO BACK
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsPage;
