import React, { useMemo, useState } from 'react';
import { useRecords } from '../features/records/api';

function RecordsListPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, isError, error } = useRecords({
    page,
    limit,
    search,
  });

  const items = data?.items ?? data?.records ?? [];
  const total = data?.meta?.total ?? items.length;
  const totalPages = data?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  const columns = useMemo(
    () => [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'status', header: 'Status' },
    ],
    []
  );

  const rows = useMemo(
    () =>
      items.map((record) => ({
        id: record.id,
        name: record.name,
        status: record.status ?? 'Pending',
      })),
    [items]
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Records</h1>
          <p className="text-sm text-slate-500">Manage your warehouse records and track key details.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search records..."
            className={[
              'flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            ].join(' ')}
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
          >
            Search
          </button>
        </form>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Loading records...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error.message}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No records found. Try adjusting your filters or add a new record.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Example: swap the markup below with your custom <Table columns={columns} rows={rows} /> component. */}
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
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
                      {row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate-500">
          Page {page} of {totalPages} {isFetching && !isLoading ? '· Updating…' : ''}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}

export default RecordsListPage;
