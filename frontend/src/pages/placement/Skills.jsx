import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlacementSkills = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await placementService.getSkills();
        if (res.skillsAnalytics) {
          setData(res.skillsAnalytics);
        }
      } catch (err) {
        console.warn('Placement skills fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const verifiedLeaderboard = data?.verifiedSkillsLeaderboard || [
    { name: 'JavaScript (ES6+)', verifiedPercentage: 88, count: 211, trend: '+4%' },
    { name: 'Python', verifiedPercentage: 79, count: 190, trend: '+6%' },
    { name: 'Java / OOP', verifiedPercentage: 74, count: 178, trend: '+1%' },
    { name: 'React.js', verifiedPercentage: 72, count: 173, trend: '+8%' },
    { name: 'SQL & DBMS', verifiedPercentage: 69, count: 166, trend: '+2%' },
    { name: 'Node.js & Express', verifiedPercentage: 65, count: 156, trend: '+5%' },
    { name: 'Git & Version Control', verifiedPercentage: 82, count: 197, trend: '+3%' },
    { name: 'MongoDB', verifiedPercentage: 63, count: 151, trend: '+7%' },
  ];

  const unverifiedDeficits = data?.unverifiedClaimDeficits || [
    { name: 'Cloud Infrastructure (AWS / GCP)', unverifiedRate: 68, resumeClaimsCount: 182, verifiedProofCount: 58 },
    { name: 'Automated Testing (Jest / PyTest)', unverifiedRate: 61, resumeClaimsCount: 155, verifiedProofCount: 60 },
    { name: 'System Design & High Concurrency', unverifiedRate: 54, resumeClaimsCount: 140, verifiedProofCount: 64 },
    { name: 'Docker Containerization', unverifiedRate: 59, resumeClaimsCount: 162, verifiedProofCount: 66 },
    { name: 'Advanced Algorithms & DP', unverifiedRate: 43, resumeClaimsCount: 190, verifiedProofCount: 108 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary">Batch Skill Analytics & Claim Deficits</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Identify batch-wide technical strengths and widespread unverified claims across 240 candidates.
          </p>
        </div>

        <Link
          to="/placement/interventions"
          className="px-3.5 py-1.5 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Plan Skill Bootcamps</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Verified Skills */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-content-primary">Top Verified Skills Leaderboard</h3>
              <p className="text-xs text-content-secondary">Proven with code repositories and test benchmarks</p>
            </div>
            <span className="text-xs font-bold text-status-success bg-emerald-50 px-2 py-0.5 rounded border border-status-success-border">
              High Confidence
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {verifiedLeaderboard.map((item) => (
              <div key={item.name} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-content-primary">{item.name}</span>
                  <span className="font-mono text-content-secondary font-bold">
                    {item.verifiedPercentage}% <span className="text-content-muted">({item.count} students)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${item.verifiedPercentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widespread Unverified Deficits */}
        <div className="bg-white p-6 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-amber-900">Unverified Claim Deficits (High Risk)</h3>
              <p className="text-xs text-content-secondary">Skills frequently claimed on resumes but missing code proof</p>
            </div>
            <span className="text-xs font-bold text-status-warning bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              Needs Training
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {unverifiedDeficits.map((d) => (
              <div key={d.name} className="p-3 bg-white border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-content-primary">{d.name}</span>
                  <span className="font-mono font-bold text-status-warning">{d.unverifiedRate}% Deficit</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-content-secondary">
                  <span>Claimed on CV: {d.resumeClaimsCount} students</span>
                  <span className="text-status-success font-semibold">Verified Proof: {d.verifiedProofCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
