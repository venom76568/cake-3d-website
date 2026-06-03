import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function AdminLogin() {
  const { login, error } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = login(password);
    if (success) {
      navigate('/admin/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-plum flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-pearl">
            Artisan<span className="text-gold italic">.</span>
          </h1>
          <p className="mt-3 font-sans text-sm text-pearl/50 uppercase tracking-widest">
            Admin Access
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-pearl/5 border border-pearl/10 p-8 backdrop-blur-sm"
        >
          <h2 className="font-display text-xl text-pearl mb-8">Sign In</h2>

          <div className="flex flex-col gap-2 mb-6">
            <label
              htmlFor="admin-password"
              className="font-sans text-xs uppercase tracking-widest text-pearl/60"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full bg-transparent border border-pearl/20 text-pearl placeholder-pearl/30 font-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {error && (
            <p className="text-dusty-rose font-sans text-xs mb-6 flex items-center gap-2">
              <span>⚠</span> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-gold text-plum font-sans font-semibold text-sm uppercase tracking-widest py-3 hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying…' : 'Enter Panel'}
          </button>
        </form>

        <p className="mt-8 text-center font-sans text-xs text-pearl/30">
          <a href="/" className="hover:text-pearl/60 transition-colors">
            ← Back to shop
          </a>
        </p>
      </div>
    </div>
  );
}
