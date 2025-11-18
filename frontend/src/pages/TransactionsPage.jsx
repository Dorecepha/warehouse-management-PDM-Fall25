import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../features/transactions/api';
import PaginationComponent from '../components/PaginationComponent';

// --- Helper Components for Badges ---

const ArrowDownRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="7" x2="17" y2="17"></line>
    <polyline points="17 7 17 17 7 17"></polyline>
  </svg>
);

const ArrowUpRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const TypeBadge = ({ type }) => {
  if (type === 'PURCHASE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border-[3px] border-white bg-[#FF5252] px-3 py-1 text-xs font-bold text-white shadow-sm">
        <ArrowDownRight />
        PURCHASE
      </span>
    );
  }
  if (type === 'SALE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border-[3px] border-white bg-black px-3 py-1 text-xs font-bold text-white shadow-sm">
        <ArrowUpRight />
        SALE
      </span>
    );
  }
  return <span className="text-sm text-slate-600">{type}</span>;
};

// --- Main Page Component ---

function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'PURCHASE', 'SALE'
  const navigate = useNavigate();

  const { data, isLoading, isError, error, isFetching } = useTransactions({
    page,
    search,
    limit: 10,
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  // Filter logic (Client-side filtering for now)
  const allTransactions = data?.transactions ?? [];
  const displayedTransactions = useMemo(() => {
    if (filterType === 'ALL') return allTransactions;
    return allTransactions.filter((tx) => tx.transactionType === filterType);
  }, [allTransactions, filterType]);

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="min-h-[600px] rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      {/* 1. Header Section */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Transaction</h1>
        <p className="text-sm text-slate-500">
          View all purchase and sale transactions
        </p>
      </header>

      {/* 2. Search Bar & Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by reference, party, or product..."
            className="w-full rounded-xl border-transparent bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </form>

        {/* Filter Tabs */}
        <div className="flex w-fit items-center rounded-full border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setFilterType('ALL')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filterType === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilterType('PURCHASE')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filterType === 'PURCHASE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setFilterType('SALE')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filterType === 'SALE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sales
          </button>
        </div>
      </div>

      {/* 3. Table Section */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          Loading transactions...
        </div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">{error.message}</div>
      ) : displayedTransactions.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Total Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {displayedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                    {new Date(tx.createdAt).toLocaleDateString('en-CA')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <TypeBadge type={tx.transactionType} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {tx.status.charAt(0).toUpperCase() +
                      tx.status.slice(1).toLowerCase()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {tx.totalProducts}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {tx.totalPrice}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {tx.product?.name || 'Unknown Product'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      onClick={() => navigate(`/transactions/${tx.id}`)}
                      className="font-medium text-primary hover:text-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
