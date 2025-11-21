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

const METRIC_DETAILS = {
  count: {
    label: 'Daily Transaction Volume',
    title: 'Records (units)',
    subtitle:
      'Calculates counts of purchase and sale records created each day.',
    dataKey: 'count',
    unit: ' Transactions',
  },
  quantity: {
    label: 'Daily Unit Movement',
    title: 'Product Volume (units)',
    subtitle: 'Calculates total number of items moved (in and out) each day.',
    dataKey: 'quantity',
    unit: ' Items',
  },
  amount: {
    label: 'Net Daily Sales Value',
    title: 'Daily Sales (USD)',
    subtitle: 'Calculates daily net currency aggregated from transactions.',
    dataKey: 'amount',
    unit: '$',
  },
};

const transformTransactionData = (transactions, month, year) => {
  const dailyData = {};
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
  }

  if (!transactions || !Array.isArray(transactions)) {
    return Object.values(dailyData);
  }

  transactions.forEach((transaction) => {
    const type = transaction.transactionType || transaction.type;
    
    // Skip 'RETURN_TO_SUPPLIER'
    if (type === 'RETURN_TO_SUPPLIER') {
      return;
    }
    const timestamp = transaction.createdAt || transaction.transactionDate;
    if (!timestamp) return;

    const date = new Date(timestamp);
    if (date.getMonth() + 1 === month && date.getFullYear() === year) {
      const day = date.getDate();
      
      if (dailyData[day]) {
        const priceValue =
          type === 'SALE'
            ? Number(transaction.totalPrice ?? 0)
            : -Number(transaction.totalPrice ?? 0); 

        dailyData[day].count += 1;
        dailyData[day].quantity +=
          transaction.totalProducts ?? transaction.quantity ?? 0;
        dailyData[day].amount += priceValue || 0;
      }
    }
  });

  return Object.values(dailyData);
};

const formatYAxisTick = (value, metric) => {
  if (metric === 'amount') {
    return `$${Math.round(value).toLocaleString()}`;
  }
  return value.toLocaleString();
};

const formatTooltipValue = (value, metric) => {
  if (metric === 'amount') {
    return `$${value.toFixed(2)}`;
  }
  return value.toLocaleString() + METRIC_DETAILS[metric].unit;
};

function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMetric, setSelectedMetric] = useState('amount');

  const currentMetric = METRIC_DETAILS[selectedMetric];

  const {
    data: transactionResponse,
    isLoading,
    isError,
    error,
  } = useTransactionsByMonth(selectedMonth, selectedYear);

  const chartData = useMemo(() => {
    const transactions = transactionResponse?.transactions ?? [];
    return transformTransactionData(transactions, selectedMonth, selectedYear);
  }, [transactionResponse, selectedMonth, selectedYear]);

  const handleMonthChange = (e) =>
    setSelectedMonth(parseInt(e.target.value, 10));
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value, 10));

  const getButtonClass = (metricType) => {
    const isActive = selectedMetric === metricType;
    return `px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#3E3998] text-white shadow-md'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`;
  };

  return (
    <div className="min-h-[600px] rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">{currentMetric.subtitle}</p>
      </header>

      <div className="mb-8 flex flex-col gap-6">
        <div className="flex justify-center gap-4">
          {Object.entries(METRIC_DETAILS).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={getButtonClass(key)}
            >
              {details.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="rounded-lg border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 focus:border-[#3E3998] focus:bg-white focus:ring-2 focus:ring-[#3E3998]/20"
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
            className="rounded-lg border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 focus:border-[#3E3998] focus:bg-white focus:ring-2 focus:ring-[#3E3998]/20"
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

      <div className="h-[500px] w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            Loading chart data...
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center text-red-500">
            {error?.message || 'An error occurred fetching data'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="day"
                axisLine={{ stroke: 'black' }}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={{ stroke: 'black' }}
                tickLine={false}
                tickFormatter={(value) =>
                  formatYAxisTick(value, selectedMetric)
                }
                tick={{ fill: '#64748b', fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => [
                  formatTooltipValue(value, selectedMetric),
                  currentMetric.title,
                ]}
              />
              <Legend verticalAlign="top" height={36} />

              <Line
                type="monotone"
                dataKey={currentMetric.dataKey}
                name={currentMetric.title}
                stroke="#3E3998"
                strokeWidth={3}
                dot={{ fill: '#3E3998', r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;