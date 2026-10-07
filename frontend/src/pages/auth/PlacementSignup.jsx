import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const PlacementSignup = () => {
  const [formData, setFormData] = useState({
    officerName: '',
    officialEmail: '',
    password: '',
    confirmPassword: '',
    institutionName: '',
    institutionCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupPlacement } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signupPlacement(formData);
      navigate('/placement');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check institution details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-indigo-200 p-8 shadow-card">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-content-primary">Register your Placement Cell</h2>
          <p className="text-xs text-content-secondary mt-1">Start understanding your students' career readiness.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-status-danger text-xs font-semibold rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-content-primary mb-1">Placement Officer Name</label>
              <input
                type="text"
                name="officerName"
                required
                value={formData.officerName}
                onChange={handleChange}
                placeholder="Dr. Sarah Jenkins"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Official University Email</label>
              <input
                type="email"
                name="officialEmail"
                required
                value={formData.officialEmail}
                onChange={handleChange}
                placeholder="placement@apex.edu"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-content-primary mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-content-primary mb-1">Institution Name</label>
              <input
                type="text"
                name="institutionName"
                required
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="Apex Institute of Technology"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Institute Code</label>
              <input
                type="text"
                name="institutionCode"
                required
                value={formData.institutionCode}
                onChange={handleChange}
                placeholder="AIT-2026"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 bg-secondary hover:bg-secondary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Setting up Placement Cell...' : 'Register Institutional Portal'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-surface-border text-center text-xs text-content-secondary">
          Already registered?{' '}
          <Link to="/placement/login" className="text-secondary font-bold hover:underline">
            Sign In to Placement Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
