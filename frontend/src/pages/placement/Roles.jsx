import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  PieChart,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  Award
} from 'lucide-react';

export const PlacementRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await placementService.getRoles();
        if (res.rolesAnalytics) {
          setRoles(res.rolesAnalytics);
        }
      } catch (err) {
        console.warn('Roles analytics fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const rolesList = roles.length > 0 ? roles : [
    {
      roleName: 'Frontend Developer',
      readyPercentage: 78,
      eligibleCandidates: 85,
      avgScore: 79.4,
      keyStrengths: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
      commonGaps: ['Web Vitals Optimization', 'Unit Testing (Jest)'],
    },
    {
      roleName: 'Backend Developer',
      readyPercentage: 69,
      eligibleCandidates: 72,
      avgScore: 73.1,
      keyStrengths: ['Node.js', 'Express', 'MongoDB', 'SQL'],
      commonGaps: ['Redis Caching', 'Microservices', 'Docker'],
    },
    {
      roleName: 'Full Stack Developer',
      readyPercentage: 64,
      eligibleCandidates: 68,
      avgScore: 71.8,
      keyStrengths: ['MERN Stack', 'Git Workflows', 'Database Design'],
      commonGaps: ['Docker', 'AWS Deployment', 'End-to-End Testing'],
    },
    {
      roleName: 'Data Scientist',
      readyPercentage: 58,
      eligibleCandidates: 38,
      avgScore: 66.5,
      keyStrengths: ['Python', 'Pandas', 'EDA', 'SQL'],
      commonGaps: ['Production Model Deployment', 'Feature Stores'],
    },
    {
      roleName: 'Machine Learning Engineer',
      readyPercentage: 54,
      eligibleCandidates: 32,
      avgScore: 63.8,
      keyStrengths: ['PyTorch Basics', 'Scikit-Learn', 'Math Foundations'],
      commonGaps: ['MLOps Pipelines', 'Docker Containerization', 'CUDA Optimization'],
    },
    {
      roleName: 'DevOps & Cloud Engineer',
      readyPercentage: 42,
      eligibleCandidates: 22,
      avgScore: 58.2,
      keyStrengths: ['Linux Basics', 'Git'],
      commonGaps: ['Terraform', 'Kubernetes', 'AWS Architecture', 'CI/CD'],
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold text-content-primary">Cohort Role Readiness Analytics</h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Benchmark batch competence across primary hiring roles to optimize on-campus recruiter invitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rolesList.map((r) => (
          <div key={r.roleName} className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-content-secondary uppercase tracking-wider">
                  Target Role
                </span>
                <span className="px-2 py-0.5 bg-brand-50 text-primary font-bold text-[11px] rounded border border-brand-200">
                  {r.eligibleCandidates} Eligible
                </span>
              </div>

              <h3 className="text-base font-extrabold text-content-primary mt-1">{r.roleName}</h3>

              <div className="my-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-secondary">{r.readyPercentage}%</span>
                <span className="text-xs text-content-secondary font-medium">Readiness Baseline</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-secondary h-2 rounded-full" style={{ width: `${r.readyPercentage}%` }} />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-content-primary block mb-1">Top Cohort Strengths:</span>
                  <div className="flex flex-wrap gap-1">
                    {r.keyStrengths?.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-emerald-50 text-status-success rounded text-[10px] font-semibold border border-status-success-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="font-bold text-amber-900 block mb-1">Common Batch Gaps:</span>
                  <div className="flex flex-wrap gap-1">
                    {r.commonGaps?.map((g) => (
                      <span key={g} className="px-1.5 py-0.5 bg-amber-50 text-status-warning rounded text-[10px] font-semibold border border-amber-200">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-content-secondary">
              <span>Avg Candidate Score:</span>
              <span className="font-bold font-mono text-content-primary">{r.avgScore} / 100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
