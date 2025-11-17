import React, { useState } from 'react';

const NAV_ITEMS = [
  'Dashboard',
  'Transaction',
  'Category',
  'Product',
  'Supplier',
  'Purchase',
  'Sell',
  'Profile',
  'Logout',
];

const FILTER_TABS = ['All Transactions', 'Purchases', 'Sales'];

const TRANSACTION_DATA = [
  {
    id: 1,
    date: '2025-11-16',
    type: 'PURCHASE',
    status: 'Processing',
    totalProducts: 1,
    totalPrice: 49,
    product: 'Bike',
  },
  {
    id: 2,
    date: '2025-11-16',
    type: 'SALE',
    status: 'Pending',
    totalProducts: 20,
    totalPrice: 546,
    product: 'Laptop',
  },
];

const Sidebar = () => (
  <aside className="w-64 min-h-screen bg-blue-800 text-white flex flex-col items-center py-10 space-y-6">
    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-xl font-semibold text-blue-100">
      A
    </div>
    <div className="w-3/4 h-px bg-blue-600" />
    <p className="text-lg font-medium">Name</p>
    <nav className="w-full px-6 space-y-3">
      {NAV_ITEMS.map((item) => (
        <button
          key={item}
          type="button"
          className={`w-full text-left rounded-full px-4 py-2 font-medium transition
            ${item === 'Transaction'
              ? 'bg-white/20 text-white'
              : 'text-blue-100 hover:bg-white/10'}
          `}
        >
          {item}
        </button>
      ))}
    </nav>
  </aside>
);

const TransactionHeader = () => (
  <header className="space-y-1">
    <h1 className="text-3xl font-semibold text-gray-900">Transaction</h1>
    <p className="text-gray-500">View all purchase and sale transactions</p>
  </header>
);

const TransactionSearchBar = () => (
  <div className="mt-6">
    <label htmlFor="transaction-search" className="sr-only">
      Search transactions
    </label>
    <div className="flex items-center rounded-full bg-gray-100 px-4 py-3 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 mr-3"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        id="transaction-search"
        type="text"
        placeholder="Search by reference, party, or product..."
        className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
      />
    </div>
  </div>
);

const TransactionFilters = ({ activeFilter, onFilterChange }) => (
  <div className="mt-6 flex flex-wrap gap-3">
    {FILTER_TABS.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => onFilterChange(tab)}
        className={`rounded-full px-6 py-2 text-sm font-medium transition
          ${activeFilter === tab
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'}
        `}
      >
        {tab}
      </button>
    ))}
  </div>
);

const TypeBadge = ({ type }) => {
  const styles =
    type === 'PURCHASE'
      ? 'bg-red-500/10 text-red-600 border border-red-500/30'
      : 'bg-black text-white';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      <span className="text-base leading-none">↗</span>
      {type}
    </span>
  );
};

const TransactionRow = ({ transaction }) => (
  <tr className="border-b border-gray-100 text-sm text-gray-700 last:border-0">
    <td className="py-4 pr-6 font-medium text-gray-900">{transaction.date}</td>
    <td className="py-4 pr-6"><TypeBadge type={transaction.type} /></td>
    <td className="py-4 pr-6">{transaction.status}</td>
    <td className="py-4 pr-6">{transaction.totalProducts}</td>
    <td className="py-4 pr-6 font-semibold text-gray-900">${transaction.totalPrice}</td>
    <td className="py-4 pr-6">{transaction.product}</td>
    <td className="py-4">
      <button type="button" className="text-indigo-600 font-medium hover:text-indigo-500">
        View Details
      </button>
    </td>
  </tr>
);

const TransactionTable = () => (
  <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
            <th className="py-3 pr-6">Date</th>
            <th className="py-3 pr-6">Type</th>
            <th className="py-3 pr-6">Status</th>
            <th className="py-3 pr-6">Total Products</th>
            <th className="py-3 pr-6">Total Price</th>
            <th className="py-3 pr-6">Product</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {TRANSACTION_DATA.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PaginationControls = () => (
  <div className="mt-8 flex justify-center gap-3">
    {['<< Prev', '1', '2', '3', 'Next >>'].map((label) => (
      <button
        key={label}
        type="button"
        className={`rounded-full px-4 py-2 text-sm font-medium
          ${label === '1'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        `}
      >
        {label}
      </button>
    ))}
  </div>
);

function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState(FILTER_TABS[0]);

  return (
    <div className="min-h-screen bg-gray-800 flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <section className="w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-xl">
          <TransactionHeader />
          <TransactionSearchBar />
          <TransactionFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <TransactionTable />
          <PaginationControls />
        </section>
      </main>
    </div>
  );
}

export default TransactionsPage;
