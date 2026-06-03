import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminDashboard } from './AdminDashboard';
import { AdminCakeManager } from './AdminCakeManager';
import { AdminOrderHistory } from './AdminOrderHistory';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '◈' },
  { to: '/admin/cakes', label: 'Cakes', icon: '◉' },
  { to: '/admin/history', label: 'Order History', icon: '◷' },
];

export function AdminApp() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-plum/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-plum flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="px-8 py-8 border-b border-pearl/10">
          <h1 className="font-display text-2xl font-bold text-pearl">
            Artisan<span className="text-gold italic">.</span>
          </h1>
          <p className="font-sans text-xs text-pearl/40 mt-1 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors rounded-sm ${
                  isActive
                    ? 'bg-pearl/10 text-pearl border-l-2 border-gold'
                    : 'text-pearl/50 hover:text-pearl hover:bg-pearl/5'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-pearl/10 flex flex-col gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-sans text-xs text-pearl/40 hover:text-pearl/70 transition-colors"
          >
            View Shop ↗
          </a>
          <button
            onClick={handleLogout}
            className="font-sans text-xs text-dusty-rose hover:text-red-400 transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Mobile Topbar */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-plum border-b border-pearl/10">
          <span className="font-display text-xl font-bold text-pearl">
            Artisan<span className="text-gold italic">.</span>
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className="w-5 h-[2px] bg-pearl block"></span>
            <span className="w-5 h-[2px] bg-pearl block"></span>
            <span className="w-3 h-[2px] bg-pearl block"></span>
          </button>
        </header>

        <main className="flex-1">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="cakes" element={<AdminCakeManager />} />
            <Route path="history" element={<AdminOrderHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
