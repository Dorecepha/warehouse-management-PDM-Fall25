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
    limit: 9,
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
    <div className="w-full px-10">
      <div className="rounded-3xl bg-white shadow p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-inter font-semibold text-slate-900">
              Product
            </h1>
            <p className="text-sm text-slate-500">
              Manage your product inventory
            </p>
          </div>
          <button
            onClick={() => navigate('/products/new')}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80 transition"
          >
            <span className="text-lg font-bold">+</span>
            Add Product
          </button>
        </header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <form onSubmit={handleSearchSubmit} className="flex-1 ">
            <div className="flex items-center rounded-full bg-slate-100 px-4 py-3 border border-slate-300">
              <span className="text-slate-500 mr-3">🔍</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </form>
          <select
            className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
            onChange={() => {}}
          >
            <option>All Categories</option>
          </select>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <img
                  className="h-52 w-full object-cover bg-slate-100"
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                />

                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500">SKU: {product.sku}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-xs text-slate-500">
                      Qty: {product.stockQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-primary hover:bg-slate-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-red-600 border-l border-slate-200 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <footer className="flex justify-center pt-10">
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </footer>
      </div>
    </div>
  );
}

export default ProductPage;
