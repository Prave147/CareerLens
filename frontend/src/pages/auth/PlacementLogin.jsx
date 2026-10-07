import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const PlacementLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginPlacement, loginDemoPlacement } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginPlacement({ email, password });
      navigate('/placement');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify official credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    loginDemoPlacement();
    navigate('/placement');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-indigo-200 p-8 shadow-card">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-content-primary">Placement Cell Login</h2>
          <p className="text-xs text-content-secondary mt-1">Access institution-level career intelligence.</p>
        </div>

        {/* Demo Placement Banner */}
        <div className="mb-6 p-3.5 bg-secondary-light border border-indigo-200 rounded-xl flex items-center justify-between">
          <div className="text-xs">
            <p className="font-bold text-secondary">Demo Officer Mode</p>
            <p className="text-[11px] text-content-secondary">Apex Institute (240 Cohort Analytics)</p>
          </div>
          <button
            onClick={handleQuickDemo}
            type="button"
            className="px-3 py-1.5 bg-secondary hover:bg-secondary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            Load Demo
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-status-danger text-xs font-semibold rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Official University Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="placement@apex.edu"
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-content-primary">Password</label>
              <span className="text-[11px] text-secondary cursor-pointer hover:underline">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-secondary hover:bg-secondary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In to Placement Portal'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-content-secondary">
          <p>
            Need to onboard your institution?{' '}
            <Link to="/placement/signup" className="text-secondary font-bold hover:underline">
              Register Placement Cell
            </Link>
          </p>
          <p className="mt-2 text-[11px]">
            Student looking for your dashboard?{' '}
            <Link to="/student/login" className="text-primary font-bold hover:underline">
              Student Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
