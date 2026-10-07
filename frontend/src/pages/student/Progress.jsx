import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Milestone,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const Progress = () => {
  const trajectoryData = [
    { month: 'Nov 2025', score: 58, label: 'Initial Profile' },
    { month: 'Dec 2025', score: 64, label: 'MediRoute Added' },
    { month: 'Jan 2026', score: 71, label: 'LeetCode 300+' },
    { month: 'Feb 2026', score: 74, label: 'Internship Verified' },
    { month: 'Mar 2026', score: 79.3, label: 'Current Score' },
    { month: 'Apr 2026 (Est.)', score: 86.5, label: 'Docker + Tests' },
    { month: 'May 2026 (Est.)', score: 93.8, label: 'AWS Deploy + Redis' },
  ];

  const milestonesCompleted = [
    { title: 'Connected GitHub Organization', date: 'Mar 15, 2026', impact: '+6.5 pts' },
    { title: 'Synced LeetCode (427 Solved)', date: 'Mar 18, 2026', impact: '+8.2 pts' },
    { title: 'Verified Telemedicine REST Endpoints', date: 'Mar 20, 2026', impact: '+4.0 pts' },
    { title: 'Reconciled 2 Software Internships', date: 'Mar 22, 2026', impact: '+5.5 pts' }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold text-content-primary">Readiness Progress & Trajectory</h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Track your employability growth curve over time and see estimated impact projections from ongoing milestones.
        </p>
      </div>

      {/* Trajectory Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
          <span className="text-xs font-bold text-content-secondary">Current Job Readiness</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-content-primary">79.3</span>
            <span className="text-xs text-status-success font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.3 this month
            </span>
          </div>
          <p className="text-[11px] text-content-muted mt-1">Tier-2 Ready (Targeting 90+)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
          <span className="text-xs font-bold text-content-secondary">Completed Evidence Actions</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">12</span>
            <span className="text-xs text-content-muted font-medium">Verifications</span>
          </div>
          <p className="text-[11px] text-content-muted mt-1">4 active repository scans</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200 bg-brand-50/30 shadow-subtle">
          <span className="text-xs font-bold text-primary">Projected Readiness</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-status-success">93.8</span>
            <span className="text-[11px] text-content-secondary font-semibold">Estimated</span>
          </div>
          <p className="text-[11px] text-content-muted mt-1">Upon 4-week roadmap completion</p>
        </div>
      </div>

      {/* Progress Area Chart */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-bold text-content-primary">Readiness Growth Trajectory</h3>
            <p className="text-xs text-content-secondary">Historical timeline vs roadmap projection curve</p>
          </div>
          <span className="text-xs font-mono font-bold text-primary bg-brand-50 px-2 py-0.5 rounded">
            Estimated Impact Model
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis domain={[40, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value) => [`${value} / 100`, 'Readiness Index']}
              />
              <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-surface-border flex items-start gap-2 text-xs text-content-secondary">
          <AlertCircle className="w-4 h-4 text-content-muted shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Projections are labeled as <em>Estimated Impact</em> based on typical rubric weightings. Actual score improvements depend on code quality and live test coverage validation.
          </span>
        </div>
      </div>

      {/* Verified Milestones Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <h3 className="text-sm font-bold text-content-primary">Recent Verified Milestones</h3>
        <div className="divide-y divide-surface-border text-xs">
          {milestonesCompleted.map((m, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-status-success" />
                <div>
                  <p className="font-bold text-content-primary">{m.title}</p>
                  <p className="text-[11px] text-content-muted flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> {m.date}
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-primary bg-brand-50 px-2 py-0.5 rounded">
                {m.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
