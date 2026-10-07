import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlacementGaps = () => {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const res = await placementService.getGaps();
        if (res.gaps) setGaps(res.gaps);
      } catch (err) {
        console.warn('Placement gaps fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  const gapList = gaps.length > 0 ? gaps : [
    {
      id: 'gap-cloud',
      title: 'Cloud Infrastructure & Deployment Deficit',
      affectedStudentsPercentage: 68,
      affectedCount: 163,
      description: 'Over 68% of candidates list AWS/GCP on resumes, but fewer than 24% have verifiable live cloud deployments or Infrastructure-as-Code configurations in public code repositories.',
      impactOnPlacement: 'High risk of rejection during DevOps and Cloud architecture rounds for product companies.',
      suggestedIntervention: 'Conduct hands-on AWS Deployment Hackathon with free tier VPC, ECS, and S3 exercises.',
    },
    {
      id: 'gap-testing',
      title: 'Automated Testing Deficit',
      affectedStudentsPercentage: 61,
      affectedCount: 146,
      description: '61% of student codebases completely lack unit, integration, or mocking test suites. Hiring engineers at tier-1 product companies treat this as an immediate red flag.',
      impactOnPlacement: 'Blocks shortlisting for standard Senior Software Engineer (SDE-1) interviews at top tech firms.',
      suggestedIntervention: 'Execute mandatory 1-week Test-Driven Development (TDD) bootcamp with Jest and PyTest.',
    },
    {
      id: 'gap-sysdesign',
      title: 'System Design & Scalability Deficit',
      affectedStudentsPercentage: 54,
      affectedCount: 130,
      description: 'Students build monolithic backends without caching (Redis), message queues (Kafka/RabbitMQ), or database indexing strategies.',
      impactOnPlacement: 'Reduces performance in mid-round technical discussions for high-LPA packages.',
      suggestedIntervention: 'Organize interactive system design workshops focusing on scaling from 1k to 100k users.',
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary">Institutional Skill Gap Analysis</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Identify batch-level technical vulnerabilities that lead to recruiter interview drop-offs.
          </p>
        </div>

        <Link
          to="/placement/interventions"
          className="px-3.5 py-1.5 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Launch Recommended Interventions</span>
        </Link>
      </div>

      <div className="space-y-4">
        {gapList.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-status-warning flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-content-primary">{g.title}</h3>
                  <span className="text-[11px] text-content-secondary">
                    Affecting {g.affectedCount} Students ({g.affectedStudentsPercentage}% of active cohort)
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-status-warning border border-amber-200 rounded-lg text-xs font-mono font-bold">
                {g.affectedStudentsPercentage}% Batch Deficit
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-content-primary block">Root Cause in Repository Evidence:</span>
                <p className="text-content-secondary leading-relaxed">{g.description}</p>
              </div>
              <div className="p-3.5 bg-red-50/40 border border-red-100 rounded-xl space-y-1">
                <span className="font-bold text-red-900 block">Placement Impact:</span>
                <p className="text-content-secondary leading-relaxed">{g.impactOnPlacement}</p>
              </div>
            </div>

            <div className="p-3.5 bg-secondary-light/40 border border-indigo-100 rounded-xl flex items-center justify-between text-xs gap-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-secondary block">Suggested Institutional Intervention:</strong>
                  <span className="text-content-secondary">{g.suggestedIntervention}</span>
                </div>
              </div>
              <Link
                to="/placement/interventions"
                className="px-3 py-1.5 bg-secondary hover:bg-secondary-hover text-white font-bold text-xs rounded-lg shrink-0 transition-colors"
              >
                Schedule
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
