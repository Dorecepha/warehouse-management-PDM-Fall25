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

  const handleCreate = (formData, { reset }) => {
    setServerError('');
    createMutation.mutate(formData, {
      onSuccess: () => {
        reset(categoryFormDefaultValues);
      },
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

  const categories = data?.categories ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-1">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-sm text-slate-500">
            {editingCategory
              ? `Updating "${editingCategory.name}"`
              : 'Add a new category to the system.'}
          </p>
        </header>

        <CategoryForm
          key={editingCategory?.id ?? 'create'}
          defaultValues={editingCategory ?? categoryFormDefaultValues}
          submitLabel={editingCategory ? 'Update Category' : 'Create Category'}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          serverError={serverError}
        />
        {editingCategory && (
          <button
            type="button"
            onClick={() => setEditingCategory(null)}
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="space-y-6 lg:col-span-2">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">
            Existing Categories
          </h1>
          <p className="text-sm text-slate-500">
            Browse and manage all categories.
          </p>
        </header>

        {isLoading ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            Loading categories...
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {error.message}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No categories found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-200">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between p-4"
                >
                  <span className="text-sm font-medium text-slate-900">
                    {category.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteMutation.isPending}
                      className="text-sm font-medium text-red-600 hover:text-red-600/80 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {totalPages > 1 && (
          <footer className="flex items-center justify-between">
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
    </div>
  );
}

export default CategoryPage;
