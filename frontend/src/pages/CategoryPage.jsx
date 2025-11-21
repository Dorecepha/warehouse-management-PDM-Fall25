import React, { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../features/categories/api';
import CategoryForm, {
  categoryFormDefaultValues,
} from '../features/categories/CategoryForm';
import PaginationComponent from '../components/PaginationComponent';

function CategoryPage() {
  const [page, setPage] = useState(1);
  const [editingCategory, setEditingCategory] = useState(null);
  const [serverError, setServerError] = useState('');

  const { data, isLoading, isError, error, isFetching } = useCategories({
    page,
    limit: 10,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = (formData) => {
    setServerError('');
    createMutation.mutate(formData, {
      onSuccess: () => {},
      onError: (err) => {
        setServerError(err.message || 'Failed to create category.');
      },
    });
  };

  const handleUpdate = (formData) => {
    setServerError('');
    if (!editingCategory) return;

    updateMutation.mutate(
      { id: editingCategory.id, data: formData },
      {
        onSuccess: () => {
          setEditingCategory(null);
        },
        onError: (err) => {
          setServerError(err.message || 'Failed to update category.');
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id, {
        onError: (err) => {
          alert(err.message || 'Failed to delete category.');
        },
      });
    }
  };

  const categories = data?.content || data?.categories || [];
  const totalPages = data?.totalPages || data?.meta?.totalPages || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
      <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            {editingCategory
              ? 'Update category details'
              : 'Create a new product category'}
          </p>

          <CategoryForm
            key={editingCategory?.id ?? 'create'}
            defaultValues={editingCategory ?? categoryFormDefaultValues}
            submitLabel={editingCategory ? 'Update Category' : 'Add Category'}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            serverError={serverError}
          />

          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setServerError('');
              }}
              className="w-full mt-3 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Right Column: List (Chiếm 8/12 phần trên desktop) */}
      <div className="lg:col-span-8 order-1 lg:order-2">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-bold text-slate-900">Categories</h2>
            <p className="text-sm text-slate-500 mt-1">
              Organize your categories
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : isError ? (
            <div className="p-6 text-red-600">{error.message}</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No categories found.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-800 pl-2">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-center">
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
