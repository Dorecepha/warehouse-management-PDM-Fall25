import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  return {
    isAuth: !!token,
    isAdmin: role === 'ADMIN',
  };
};

const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  navigate('/login');
};

const navItems = [
  { to: '/records', label: 'Records', roles: ['ADMIN', 'MANAGER'] },
  { to: '/records/new', label: 'New Record', roles: ['ADMIN', 'MANAGER'] },
  { to: '/reports', label: 'Reports', roles: ['ADMIN'] },
];

function AppLayout() {
  const navigate = useNavigate();
  const { isAuth, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold text-primary">
            Warehouse Manager
          </span>
          <div className="flex items-center gap-4 text-sm font-medium">
            {isAuth &&
              navItems.map((item) => {
                const hasPermission = item.roles.includes(
                  isAdmin ? 'ADMIN' : 'MANAGER'
                );

                if (!hasPermission) {
                  return null;
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded px-3 py-2 transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            {isAuth && (
              <button
                onClick={() => logout(navigate)}
                className="rounded px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
