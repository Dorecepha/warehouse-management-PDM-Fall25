import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuppliers, useDeleteSupplier } from '../features/suppliers/api';
import PaginationComponent from '../components/PaginationComponent';

function SupplierPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, error, isFetching } = useSuppliers({
    page,
    search,
    limit: 10,
  });

  const deleteMutation = useDeleteSupplier();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteMutation.mutate(id, {
        onError: (err) => {
          alert(err.message || 'Failed to delete supplier');
        },
      });
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Name' },
      { key: 'contactInfo', header: 'Contact Info' },
      { key: 'address', header: 'Address' },
      { key: 'actions', header: 'Actions' },
    ],
    []
  );

  const suppliers = data?.suppliers ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">
      {/* Header & Search Section */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Suppliers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your product suppliers
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          <button
            onClick={() => navigate('/suppliers/new')}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all"
          >
            <span className="text-lg leading-none">+</span> Add Supplier
          </button>
        </div>
      </header>

      {/* Table Section */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          Loading suppliers...
        </div>
      ) : isError ? (
        <div className="p-4 text-red-700 bg-red-50 rounded-lg border border-red-100">
          {error.message}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          No suppliers found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {supplier.contactInfo}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {supplier.address}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-3">
                    <button
                      onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Pagination */}
      {totalPages > 1 && (
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}{' '}
            {isFetching && !isLoading ? '(Updating...)' : ''}
          </span>
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </footer>
      )}
    </div>
  );
}

export default SupplierPage;
