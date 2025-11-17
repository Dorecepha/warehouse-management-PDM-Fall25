import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../features/products/api';
import PaginationComponent from '../components/PaginationComponent';

function ProductPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, error, isFetching } = useProducts({
    page,
    search,
    limit: 10,
  });

  const deleteMutation = useDeleteProduct();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id, {
        onError: (err) => {
          alert(err.message || 'Failed to delete product');
        },
      });
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">
            Manage your product inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
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
            onClick={() => navigate('/add-product')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Add Product
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Loading products...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error.message}
        </div>
      ) : data.products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No products found. Try adjusting your search or add a new product.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <img
                className="h-48 w-full object-cover"
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.name}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${product.price}
                  </span>
                  <span className="text-sm text-slate-600">
                    Qty: {product.stockQuantity}
                  </span>
                </div>
              </div>
              <div className="flex border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 border-l border-slate-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate-500">
          Page {page} of {totalPages}{' '}
          {isFetching && !isLoading ? '· Updating…' : ''}
        </p>
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </footer>
    </div>
  );
}

export default ProductPage;
