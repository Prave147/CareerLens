import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ArrowRight, AlertCircle, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StudentSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2026,
  });
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await authService.getColleges();
        if (res.success && res.colleges?.length > 0) {
          setColleges(res.colleges);
          setFormData((prev) => ({ ...prev, college: res.colleges[0].name }));
        }
      } catch (err) {
        console.warn('Could not load college directory:', err.message);
      }
    };
    fetchColleges();
  }, []);

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

    if (!formData.college) {
      setError('Please select a registered college.');
      return;
    }

    setLoading(true);
    try {
      await signupStudent(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-surface-border p-8 shadow-card">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-sm">
            CL
          </div>
          <h2 className="text-2xl font-extrabold text-content-primary">Create your CareerLens account</h2>
          <p className="text-xs text-content-secondary mt-1">Start building your verified, proof-backed employability intelligence.</p>
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
              <label className="block font-bold text-content-primary mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Kumar"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Registered College Dropdown */}
          <div>
            <label className="block font-bold text-content-primary mb-1">
              Select Registered College / Placement Cell
            </label>
            <div className="relative">
              <select
                name="college"
                required
                value={formData.college}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              >
                {colleges.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name} {c.location ? `(${c.location})` : ''}
                  </option>
                ))}
                {colleges.length === 0 && (
                  <option value="Apex Institute of Technology">Apex Institute of Technology (AIT-ENG-2026)</option>
                )}
              </select>
            </div>
            <p className="text-[11px] text-content-muted mt-1">
              🔒 Your profile will start as <span className="font-semibold text-amber-700">PENDING</span> until your college placement cell accepts your membership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-content-primary mb-1">Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="B.Tech">B.Tech</option>
                <option value="B.E.">B.E.</option>
                <option value="B.Sc">B.Sc</option>
                <option value="BCA">BCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Branch</label>
              <input
                type="text"
                name="branch"
                required
                value={formData.branch}
                onChange={handleChange}
                placeholder="Computer Science"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Grad Year</label>
              <input
                type="number"
                name="graduationYear"
                required
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Creating Student Profile...' : 'Complete Registration'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-surface-border text-center text-xs text-content-secondary">
          Already registered?{' '}
          <Link to="/student/login" className="text-primary font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
