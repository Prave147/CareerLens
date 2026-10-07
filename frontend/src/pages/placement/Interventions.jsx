import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const PlacementInterventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduledState, setScheduledState] = useState({});

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        setLoading(true);
        const res = await placementService.getInterventions();
        if (res.interventions) setInterventions(res.interventions);
      } catch (err) {
        console.warn('Interventions fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInterventions();
  }, []);

  const handleSchedule = (id) => {
    setScheduledState((prev) => ({ ...prev, [id]: true }));
  };

  const list = interventions.length > 0 ? interventions : [
    {
      id: 'int-1',
      title: 'AWS Cloud Deployment & Infrastructure Workshop',
      status: 'RECOMMENDED',
      priority: 'HIGH',
      targetCohort: '68% of Final & Pre-Final Year (163 Students)',
      duration: '2 Days (Hands-on Lab)',
      recommendedAction: 'Conduct a cloud deployment workshop guiding students through deploying full-stack Dockerized applications to AWS ECS with CloudFront SSL.',
      expectedOutcome: '+18% increase in tier-1 cloud readiness across the batch.',
      estimatedBatchScoreGain: '+5.4 avg readiness points',
    },
    {
      id: 'int-2',
      title: 'Automated Testing & Code Reliability Bootcamp',
      status: 'RECOMMENDED',
      priority: 'HIGH',
      targetCohort: '61% of Candidates with zero test coverage (146 Students)',
      duration: '1 Week Intensive',
      recommendedAction: 'Run automated testing training requiring all capstone projects to integrate Jest/Supertest CI checks before final placement clearance.',
      expectedOutcome: '100% of analyzed GitHub repos will feature green CI test badges.',
      estimatedBatchScoreGain: '+4.8 avg readiness points',
    },
    {
      id: 'int-3',
      title: 'High-Concurrency System Design Seminar',
      status: 'SCHEDULED',
      priority: 'MEDIUM',
      targetCohort: 'Full Stack & Backend cohorts (130 Students)',
      duration: '3 Sessions',
      recommendedAction: 'Invite industry tech leads to run architectural defense reviews on Redis caching, database replication, and load balancing.',
      expectedOutcome: 'Deepened technical defense capabilities for high-tier company rounds.',
      estimatedBatchScoreGain: '+3.2 avg readiness points',
    },
    {
      id: 'int-4',
      title: 'LeetCode OA Speed Sprint 30-Day Program',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      targetCohort: '103 Students with < 1600 LeetCode rating',
      duration: '30 Days (POTD Challenge)',
      recommendedAction: 'Structured daily 2-problem challenge covering Trees, Graphs, and Dynamic Programming with leaderboards.',
      expectedOutcome: '35% improvement in OA screening pass rate.',
      estimatedBatchScoreGain: '+3.8 avg readiness points',
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold text-content-primary">Placement Interventions & Bootcamps</h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Data-driven institutional action plans designed to systematically eliminate batch deficits prior to recruiter drives.
        </p>
      </div>

      <div className="space-y-4">
        {list.map((item) => {
          const isScheduled = scheduledState[item.id] || item.status === 'SCHEDULED' || item.status === 'ACTIVE';

          return (
            <div key={item.id} className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-content-primary">{item.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.priority === 'HIGH' ? 'bg-red-50 text-status-danger border border-red-200' : 'bg-brand-50 text-primary border border-brand-200'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-content-secondary mt-1">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-secondary" /> {item.targetCohort}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-content-muted" /> {item.duration}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-50 text-status-success font-mono font-bold text-xs rounded border border-status-success-border">
                    {item.estimatedBatchScoreGain}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-surface-border rounded-xl text-xs space-y-1">
                <strong className="text-content-primary block">Action Outline:</strong>
                <p className="text-content-secondary leading-relaxed">{item.recommendedAction}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-status-success font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Expected Outcome: {item.expectedOutcome}</span>
                </div>

                <button
                  onClick={() => handleSchedule(item.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm ${
                    isScheduled
                      ? 'bg-emerald-50 text-status-success border border-status-success-border'
                      : 'bg-secondary hover:bg-secondary-hover text-white'
                  }`}
                >
                  {isScheduled ? '✓ Scheduled for Batch' : 'Schedule Workshop'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
