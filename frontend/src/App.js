import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RecordsListPage from './pages/RecordsListPage';
import RecordCreatePage from './pages/RecordCreatePage';
import RecordEditPage from './pages/RecordEditPage';

const Placeholder = ({ title, description }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    {description ? (
      <p className="mt-4 text-slate-600">{description}</p>
    ) : (
      <p className="mt-4 text-slate-500">This page is coming soon.</p>
    )}
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/records" replace />} />
        <Route path="/records" element={<RecordsListPage />} />
        <Route path="/records/new" element={<RecordCreatePage />} />
        <Route path="/records/:id/edit" element={<RecordEditPage />} />
        <Route
          path="/reports"
          element={
            <Placeholder
              title="Reports"
              description="Analyze performance and trends."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/records" replace />} />
    </Routes>
  );
}

export default App;
