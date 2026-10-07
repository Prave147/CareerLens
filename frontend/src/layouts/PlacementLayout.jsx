import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  BarChart3,
  Users,
  UserCheck,
  Sparkles,
  Layers,
  PieChart,
  ShieldAlert,
  GraduationCap,
  FileSpreadsheet,
  Settings,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

export const PlacementLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Placement Overview', path: '/placement', icon: BarChart3 },
      ]
    },
    {
      label: 'COHORT MANAGEMENT',
      items: [
        { name: 'Accepted Students', path: '/placement/students', icon: Users },
        { name: 'Pending Approvals', path: '/placement/pending', icon: UserCheck },
      ]
    },
    {
      label: 'INTELLIGENCE & GAPS',
      items: [
        { name: 'Skill Intelligence', path: '/placement/skills', icon: Sparkles },
        { name: 'Claim vs Proof Matrix', path: '/placement/claim-proof', icon: Layers },
        { name: 'Role Readiness', path: '/placement/roles', icon: PieChart },
        { name: 'Institutional Gaps', path: '/placement/gaps', icon: ShieldAlert },
      ]
    },
    {
      label: 'INTERVENTIONS & REPORTS',
      items: [
        { name: 'Interventions & Bootcamps', path: '/placement/interventions', icon: GraduationCap },
        { name: 'Batch Intelligence Reports', path: '/placement/reports', icon: FileSpreadsheet },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { name: 'Institution Settings', path: '/placement/settings', icon: Settings },
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
          <Link to="/placement" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white font-bold text-base shadow-sm">
              PL
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-content-primary">
                Career<span className="text-secondary">Lens</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-secondary">
                Placement Intelligence
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
                      end={item.path === '/placement'}
                      className={({ isActive }) => `
                        flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all
                        ${isActive 
                          ? 'bg-secondary-light text-secondary border border-indigo-200 shadow-sm' 
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

        {/* Officer Card & Logout Footer */}
        <div className="p-4 border-t border-surface-border bg-slate-50/60">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-content-primary truncate">{user?.name || 'Dr. Sarah Jenkins'}</p>
              <p className="text-[10px] text-content-secondary truncate">{user?.institution || user?.collegeName || 'Apex Institute'}</p>
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
            
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary" />
              <span className="text-xs sm:text-sm font-bold text-content-primary">{user?.collegeName || 'Apex Institute of Technology'}</span>
              <span className="hidden sm:inline text-xs text-content-secondary">• Academic Year 2025-2026</span>
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-brand-50 text-primary border border-brand-200 rounded-full text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>240 Accepted Cohort Candidates</span>
            </div>

            <Link
              to="/placement/settings"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-surface-border hover:bg-surface-hover transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <span className="text-xs font-bold text-content-primary hidden sm:inline">
                {user?.name || 'Placement Officer'}
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
