import React from 'react';

function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseButtonClass =
    'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-60';
  const activeButtonClass =
    'rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={baseButtonClass}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo; Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          type="button"
          className={
            currentPage === number ? activeButtonClass : baseButtonClass
          }
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        className={baseButtonClass}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next &raquo;
      </button>
    </div>
  );
}

export default PaginationComponent;
