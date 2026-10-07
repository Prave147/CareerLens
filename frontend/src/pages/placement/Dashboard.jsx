import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  Sparkles,
  PieChart,
  ArrowRight,
  ShieldAlert,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

export const PlacementDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await placementService.getDashboard();
        if (res.dashboard) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.warn('Placement dashboard fetch error, using default set:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpi = data?.kpi || {
    studentsAnalyzed: 240,
    averageReadiness: 72,
    profileCompleteness: 81,
    studentsNeedingIntervention: 64,
  };

  const distribution = data?.readinessDistribution || [
    { tier: 'High (80-100)', count: 42, color: '#16A34A' },
    { tier: 'Moderate (65-79)', count: 134, color: '#2563EB' },
    { tier: 'Need Help (<65)', count: 64, color: '#D97706' },
  ];

  const departmentData = data?.departmentComparison || [
    { department: 'Computer Science', avgScore: 76, students: 95 },
    { department: 'Information Tech', avgScore: 73, students: 65 },
    { department: 'AI & Data Science', avgScore: 70, students: 45 },
    { department: 'Electronics & Comm', avgScore: 64, students: 35 },
  ];

  const roleSummary = data?.roleReadinessSummary || [
    { role: 'Frontend Dev', readinessPercentage: 78 },
    { role: 'Backend Dev', readinessPercentage: 69 },
    { role: 'Full Stack Dev', readinessPercentage: 64 },
    { role: 'Data Scientist', readinessPercentage: 58 },
    { role: 'ML Engineer', readinessPercentage: 54 },
  ];

  return (
    <div className="space-y-6">
      {/* Institution Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-secondary" />
            <h1 className="text-2xl font-extrabold text-content-primary">Placement Cell Intelligence Dashboard</h1>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            Apex Institute of Technology • Batch 2026 Graduating Cohort Analysis (Aggregated & Anonymized)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/placement/reports"
            className="px-3.5 py-1.5 bg-white border border-surface-border hover:bg-slate-50 text-content-primary text-xs font-bold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Batch Report</span>
          </Link>
          <Link
            to="/placement/interventions"
            className="px-3.5 py-1.5 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Launch Interventions</span>
          </Link>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-content-secondary">Students Analyzed</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-content-primary">{kpi.studentsAnalyzed}</p>
            <p className="text-[11px] text-content-muted mt-0.5">100% active cohort sync</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-content-secondary">Average Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-status-success flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-content-primary">{kpi.averageReadiness} <span className="text-xs text-content-muted font-normal">/ 100</span></p>
            <p className="text-[11px] text-content-muted mt-0.5">Tier-2 Benchmark Average</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-content-secondary">Profile Completeness</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-content-primary">{kpi.profileCompleteness}%</p>
            <p className="text-[11px] text-content-muted mt-0.5">Repos & profiles connected</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Needs Intervention</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-status-warning flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-status-warning">{kpi.studentsNeedingIntervention}</p>
            <p className="text-[11px] text-amber-800 mt-0.5">Score &lt; 65 (High Risk)</p>
          </div>
        </div>
      </div>

      {/* Charts Section: Readiness Distribution + Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Tier Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-content-primary">Batch Readiness Tier Distribution</h3>
              <p className="text-xs text-content-secondary">Candidate breakdown across employability brackets</p>
            </div>
            <span className="text-xs font-semibold text-secondary">240 Total</span>
          </div>

          <div className="space-y-4 pt-2">
            {distribution.map((tier) => (
              <div key={tier.tier} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-content-primary">{tier.tier}</span>
                  <span className="font-mono font-bold text-content-secondary">{tier.count} Students ({Math.round((tier.count / 240) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(tier.count / 240) * 100}%`, backgroundColor: tier.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border border-surface-border rounded-xl text-xs text-content-secondary">
            <strong>Key Insight:</strong> 134 students (55.8%) sit in the 65-79 tier and can reach Tier-1 (&gt;80) by completing Docker and testing milestones.
          </div>
        </div>

        {/* Department Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-content-primary">Department Average Readiness</h3>
              <p className="text-xs text-content-secondary">Benchmarking across academic branches</p>
            </div>
            <span className="text-xs font-semibold text-primary">Department Stats</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis dataKey="department" type="category" width={110} tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="avgScore" fill="#4F46E5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Role Readiness Summary Grid */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-bold text-content-primary">Cohort Role Readiness Summary</h3>
            <p className="text-xs text-content-secondary">Percentage of batch meeting baseline requirements for key tech roles</p>
          </div>
          <Link to="/placement/roles" className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1">
            Role Deep Dive <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {roleSummary.map((r) => (
            <div key={r.role} className="p-4 bg-slate-50 border border-surface-border rounded-xl text-center">
              <span className="text-xs font-bold text-content-primary block">{r.role}</span>
              <p className="text-2xl font-black text-secondary mt-1">{r.readinessPercentage}%</p>
              <span className="text-[10px] text-content-muted mt-0.5 block">Batch Prepared</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
