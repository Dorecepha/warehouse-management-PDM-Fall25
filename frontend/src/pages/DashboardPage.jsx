import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTransactionsByMonth } from '../features/transactions/api';

const transformTransactionData = (transactions, month, year) => {
  const dailyData = {};
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
  }

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    const day = transactionDate.getDate();
    if (dailyData[day]) {
      dailyData[day].count += 1;
      dailyData[day].quantity += transaction.totalProducts;
      dailyData[day].amount += transaction.totalPrice;
    }
  });

  return Object.values(dailyData);
};

function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState('amount');

  const {
    data: transactionResponse,
    isLoading,
    isError,
    error,
  } = useTransactionsByMonth({
    month: selectedMonth,
    year: selectedYear,
  });

  const transactionData = useMemo(() => {
    const transactions = transactionResponse?.transactions ?? [];
    return transformTransactionData(transactions, selectedMonth, selectedYear);
  }, [transactionResponse, selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const getButtonClass = (metric) => {
    const base =
      'rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm';
    if (metric === selectedData) {
      return `${base} bg-primary text-white`;
    }
    return `${base} bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50`;
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Analyze your transaction data for {selectedMonth}/{selectedYear}.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 rounded-md bg-white p-2 shadow-sm ring-1 ring-slate-200">
          <button
            onClick={() => setSelectedData('amount')}
            className={getButtonClass('amount')}
          >
            Amount
          </button>
          <button
            onClick={() => setSelectedData('quantity')}
            className={getButtonClass('quantity')}
          >
            Quantity
          </button>
          <button
            onClick={() => setSelectedData('count')}
            className={getButtonClass('count')}
          >
            Count
          </button>
        </div>

        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center text-slate-600">
            Loading chart data...
          </div>
        ) : isError ? (
          <div className="flex h-96 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {error.message}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                label={{
                  value: 'Day of the Month',
                  position: 'insideBottomRight',
                  offset: -5,
                }}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedData}
                stroke="#1d4ed8"
                fill="#1d4ed8"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
