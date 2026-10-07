import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Layers,
  Sparkles,
  Target,
  Milestone,
  FolderGit2,
  GitFork,
  Code2,
  Compass,
  BookOpen,
  MessageSquareCode,
  FileSpreadsheet,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Clock
} from 'lucide-react';

export const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'EVIDENCE & INTELLIGENCE',
      items: [
        { name: 'GitHub Intelligence', path: '/github', icon: FolderGit2 },
        { name: 'Evidence Matrix', path: '/evidence', icon: Layers },
        { name: 'Skill Gaps', path: '/skills', icon: Sparkles },
        { name: 'Projects & Ownership', path: '/projects', icon: GitFork },
        { name: 'Coding Activity', path: '/coding-activity', icon: Code2 },
        { name: 'Resume Claims', path: '/resume', icon: FileText },
      ]
    },
    {
      label: 'CAREER & TRANSITION',
      items: [
        { name: 'Career Path Alignment', path: '/career-path', icon: Compass },
        { name: 'Target Role & Jobs', path: '/jobs', icon: Target },
        { name: 'Course → Proof Pipeline', path: '/courses', icon: BookOpen },
        { name: 'Personalized Roadmap', path: '/roadmap', icon: Milestone },
        { name: 'Career Guide & Report', path: '/career-guide', icon: FileSpreadsheet },
        { name: 'AI Career Advisor', path: '/advisor', icon: MessageSquareCode },
      ]
    },
    {
      label: 'SETTINGS',
      items: [
        { name: 'Profile & Handles', path: '/profile', icon: User },
        { name: 'Account Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-surface-bg flex">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-surface-border flex flex-col transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-surface-border flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
              CL
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-content-primary">
                Career<span className="text-primary">Lens</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-primary">
                Student Intelligence
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-content-secondary hover:text-content-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-3 text-[10px] font-bold tracking-wider text-content-muted uppercase mb-1.5">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all
                        ${isActive 
                          ? 'bg-brand-50 text-primary border border-brand-100 shadow-sm' 
                          : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'}
                      `}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-surface-border bg-slate-50/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-content-primary truncate">{user?.name || 'Alex Kumar'}</p>
                <p className="text-[10px] text-content-secondary truncate">{user?.email || 'alex.kumar@example.com'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-status-danger bg-status-danger-bg border border-status-danger-border hover:bg-red-100 rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-surface-border px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-hover"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, evidence, projects..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-bg border border-surface-border rounded-lg text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-3">
            {/* Placement Cell Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold">
              <Clock className="w-3 h-3" />
              <span>Placement Status: PENDING</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Evidence Engine Active</span>
            </div>

            {/* Profile Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-surface-border hover:bg-surface-hover transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-bold text-content-primary hidden sm:inline">
                {user?.name || 'Alex Kumar'}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
