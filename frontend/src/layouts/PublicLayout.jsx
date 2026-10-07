import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, ArrowRight, BookOpen, Layers, Users, Award, ExternalLink } from 'lucide-react';

export const PublicLayout = () => {
  const { isAuthenticated, user, loginDemoStudent, loginDemoPlacement } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    loginDemoStudent();
    navigate('/dashboard');
  };

  const handlePlacementDemoClick = () => {
    loginDemoPlacement();
    navigate('/placement');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-content-primary">
      {/* Top Bar Announcement */}
      <div className="bg-brand-50 border-b border-brand-100 py-2 px-4 text-center text-xs sm:text-sm font-medium text-primary flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Evidence-based career readiness intelligence is live. No self-reported guesswork.</span>
        <button
          onClick={handleDemoClick}
          className="ml-2 font-bold underline hover:text-primary-hover inline-flex items-center gap-1"
        >
          Explore Live Demo <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm font-bold text-lg tracking-tight">
              CL
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-content-primary leading-none">
                Career<span className="text-primary">Lens</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-content-secondary mt-0.5">
                Employability Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-content-secondary">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#for-students" className="hover:text-primary transition-colors">For Students</a>
            <a href="#placement-cell" className="hover:text-primary transition-colors">For Placement Cell</a>
            <a href="#evidence-engine" className="hover:text-primary transition-colors">Evidence Engine</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'STUDENT' ? '/dashboard' : '/placement'}
                className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/student/login"
                  className="text-sm font-semibold text-content-secondary hover:text-primary px-3 py-2 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/placement/login"
                  className="hidden sm:inline-flex text-sm font-semibold text-secondary hover:text-secondary-hover px-3 py-2 transition-colors border border-indigo-200 bg-secondary-light rounded-lg"
                >
                  Placement Cell
                </Link>
                <Link
                  to="/student/signup"
                  className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base">
                  CL
                </div>
                <span className="text-xl font-extrabold tracking-tight text-content-primary">
                  Career<span className="text-primary">Lens</span>
                </span>
              </div>
              <p className="mt-3 text-sm text-content-secondary max-w-sm leading-relaxed">
                The evidence-based career readiness platform reconciling claimed resume skills with observable code repositories, competitive programming performance, and live deployments.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-status-success border border-status-success-border">
                  <ShieldCheck className="w-3.5 h-3.5" /> Deterministic Verification
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-content-secondary font-medium">
                <li><a href="#how-it-works" className="hover:text-primary">How It Works</a></li>
                <li><a href="#evidence-engine" className="hover:text-primary">Evidence Engine</a></li>
                <li><a href="#scoring" className="hover:text-primary">Deterministic Scoring</a></li>
                <li><button onClick={handleDemoClick} className="hover:text-primary text-left">Live Candidate Demo</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">For Institutions</h4>
              <ul className="mt-4 space-y-2 text-sm text-content-secondary font-medium">
                <li><Link to="/placement/login" className="hover:text-primary">Placement Portal</Link></li>
                <li><Link to="/placement/signup" className="hover:text-primary">Register Institution</Link></li>
                <li><button onClick={handlePlacementDemoClick} className="hover:text-primary text-left">Placement Analytics Demo</button></li>
                <li><a href="#placement-cell" className="hover:text-primary">Curriculum Interventions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">Security & Roles</h4>
              <ul className="mt-4 space-y-2 text-sm text-content-secondary font-medium">
                <li><Link to="/student/login" className="hover:text-primary">Student Sign In</Link></li>
                <li><Link to="/placement/login" className="hover:text-primary">Officer Sign In</Link></li>
                <li><span className="text-content-muted">Role-Based Access Control</span></li>
                <li><span className="text-content-muted">Privacy & Aggregated Data</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between text-xs text-content-secondary">
            <p>© {new Date().getFullYear()} CareerLens Technologies. Built with deterministic evidence scoring.</p>
            <p className="mt-2 sm:mt-0">Enterprise Grade • Light Professional SaaS Architecture</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
