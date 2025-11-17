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
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Suppliers</h1>
          <p className="text-sm text-slate-500">
            Manage your product suppliers.
          </p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search suppliers..."
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Search
            </button>
          </form>
          <button
            onClick={() => navigate('/suppliers/new')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Add Supplier
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Loading suppliers...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error.message}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No suppliers found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {supplier.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {supplier.contactInfo}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {supplier.address}
                  </td>
                  <td className="flex gap-4 px-4 py-3 text-sm">
                    <button
                      onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      disabled={deleteMutation.isPending}
                      className="font-medium text-red-600 hover:text-red-600/80 disabled:opacity-50"
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

      {totalPages > 1 && (
        <footer className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}{' '}
            {isFetching && !isLoading ? '· Updating…' : ''}
          </p>
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
