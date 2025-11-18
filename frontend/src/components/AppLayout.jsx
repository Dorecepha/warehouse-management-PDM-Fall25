import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../features/users/api';

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
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'MANAGER'] },
  { to: '/transactions', label: 'Transaction', roles: ['ADMIN', 'MANAGER'] },
  { to: '/categories', label: 'Category', roles: ['ADMIN'] },
  { to: '/products', label: 'Product', roles: ['ADMIN'] },
  { to: '/suppliers', label: 'Supplier', roles: ['ADMIN'] },
  { to: '/purchase', label: 'Purchase', roles: ['ADMIN', 'MANAGER'] },
  { to: '/sell', label: 'Sell', roles: ['ADMIN', 'MANAGER'] },
  { to: '/profile', label: 'Profile', roles: ['ADMIN', 'MANAGER'] },
];

function AppLayout() {
  const navigate = useNavigate();
  const { isAuth, isAdmin } = useAuth();
  const { data: currentUserData, isLoading } = useCurrentUser();

  const handleLogout = () => {
    logout(navigate);
  };

  const initials = (currentUserData?.name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#1f5f89]">
      <aside className="hidden w-64 flex-shrink-0 p-6 text-white lg:block">
        {/* This profile section is already centered */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-3xl font-semibold">
            {isLoading ? '...' : initials}
          </div>
          <p className="mt-4 text-lg font-semibold">
            {isLoading ? 'Loading...' : currentUserData?.name}
          </p>
          <div className="mt-4 h-px w-full bg-white/30" />
        </div>
        <nav className="mt-6 space-y-2 text-sm font-medium">
          {isAuth &&
            navItems.map((item) => {
              const hasPermission = item.roles.includes(
                isAdmin ? 'ADMIN' : 'MANAGER'
              );
              if (!hasPermission) return null;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex w-full items-center rounded-full px-4 py-2 transition text-left ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center rounded-full px-4 py-2 text-left transition hover:bg-white/10"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex flex-1 items-center justify-center overflow-auto rounded-l-[32px] bg-white p-4 shadow-lg sm:p-10">
        <div className="h-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
