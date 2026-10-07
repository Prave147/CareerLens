import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginStudent, loginDemoStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginStudent({ email, password });
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    loginDemoStudent();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-surface-border p-8 shadow-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-sm">
            CL
          </div>
          <h2 className="text-2xl font-extrabold text-content-primary">Welcome back</h2>
          <p className="text-xs text-content-secondary mt-1">Continue your career readiness journey.</p>
        </div>

        {/* Demo Quick Fill Banner */}
        <div className="mb-6 p-3.5 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between">
          <div className="text-xs">
            <p className="font-bold text-primary">Test Candidate Mode</p>
            <p className="text-[11px] text-content-secondary">Instant access as Alex Kumar (79/100 score)</p>
          </div>
          <button
            onClick={handleQuickDemo}
            type="button"
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
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
            <label className="block text-xs font-bold text-content-primary mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.kumar@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-content-primary">Password</label>
              <span className="text-[11px] text-primary cursor-pointer hover:underline">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In to Student Portal'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-content-secondary">
          <p>
            Don't have an account?{' '}
            <Link to="/student/signup" className="text-primary font-bold hover:underline">
              Create Student Account
            </Link>
          </p>
          <p className="mt-2 text-[11px]">
            Placement Officer?{' '}
            <Link to="/placement/login" className="text-secondary font-bold hover:underline">
              Placement Cell Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
