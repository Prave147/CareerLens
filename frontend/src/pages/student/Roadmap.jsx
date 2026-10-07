import React, { useState, useEffect } from 'react';
import { roadmapService } from '../../services/jobService';
import {
  Milestone,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const res = await roadmapService.getRoadmap();
        if (res.roadmap) {
          setRoadmap(res.roadmap);
        }
      } catch (err) {
        console.warn('Roadmap fetch error, using default roadmap:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const handleToggle = async (weekNumber) => {
    try {
      const res = await roadmapService.toggleMilestone(weekNumber);
      if (res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      // Local state fallback toggle
      setRoadmap((prev) => {
        const newWeeks = prev.weeks.map((w) =>
          w.weekNumber === weekNumber ? { ...w, completed: !w.completed } : w
        );
        const completedCount = newWeeks.filter((w) => w.completed).length;
        return {
          ...prev,
          weeks: newWeeks,
          currentReadiness: parseFloat((79.3 + completedCount * 3.5).toFixed(1)),
        };
      });
    }
  };

  const currentReadiness = roadmap?.currentReadiness || 79.3;
  const projectedReadiness = 93.8;
  const weeks = roadmap?.weeks || [
    {
      weekNumber: 1,
      title: 'Containerization & Docker Workflow',
      goal: 'Address critical Docker verification gap',
      skills: ['Docker', 'Docker Compose', 'Containerization'],
      task: 'Write a multi-stage Dockerfile for MediRoute frontend & backend. Create docker-compose.yml to spin up Node.js, React, and MongoDB.',
      expectedEvidence: [
        'Dockerfile in repository root',
        'docker-compose.yml with multi-container orchestration',
        'README section with docker-compose up instructions'
      ],
      estimatedImpact: '+4.5 points on Job Readiness',
      completed: false,
    },
    {
      weekNumber: 2,
      title: 'Automated Testing & Code Reliability',
      goal: 'Eliminate unit test deduction (-5 pts)',
      skills: ['Jest', 'Supertest', 'Unit & Integration Testing'],
      task: 'Implement unit tests for auth middleware and integration tests for telemedicine triage REST endpoints.',
      expectedEvidence: [
        'test/ directory with at least 15 passing tests',
        'npm test script in package.json',
        'GitHub Actions CI badge reporting test suite status'
      ],
      estimatedImpact: '+3.5 points on Job Readiness',
      completed: false,
    },
    {
      weekNumber: 3,
      title: 'Cloud Infrastructure & AWS Deployment',
      goal: 'Verify AWS cloud engineering claims',
      skills: ['AWS ECS / EC2', 'S3', 'Cloud Deployment'],
      task: 'Deploy the containerized application to AWS. Configure an S3 bucket for prescription file uploads and add HTTPS via CloudFront/ALB.',
      expectedEvidence: [
        'Live AWS hosted domain URL',
        'Terraform / CloudFormation script or deployment architecture diagram',
        'AWS SDK integration in Node.js backend'
      ],
      estimatedImpact: '+4.0 points on Job Readiness',
      completed: false,
    },
    {
      weekNumber: 4,
      title: 'System Design & High-Concurrency Telemetry',
      goal: 'Demonstrate scalability & architectural maturity',
      skills: ['Redis Caching', 'System Design', 'Rate Limiting'],
      task: 'Introduce Redis caching for patient search queries and implement rate limiting on sensitive auth endpoints.',
      expectedEvidence: [
        'Redis client configuration in Express',
        'Benchmark load test report (k6 / Artillery)',
        'High-level architecture documentation'
      ],
      estimatedImpact: '+2.5 points on Job Readiness',
      completed: false,
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header & Score Trajectory Banner */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-extrabold text-content-primary">Actionable 4-Week Career Roadmap</h1>
            </div>
            <p className="text-xs text-content-secondary mt-1">
              Personalized engineering milestones targeted directly at your profile's highest-penalty evidence gaps.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-brand-50 p-3 rounded-xl border border-brand-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-content-muted">Current</span>
              <p className="text-base font-mono font-extrabold text-content-primary">{currentReadiness}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
            <div>
              <span className="text-[10px] uppercase font-bold text-primary">Projected</span>
              <p className="text-base font-mono font-extrabold text-status-success">{projectedReadiness}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-content-secondary">
          <span>Target Role: <strong className="text-content-primary">Full Stack Developer</strong></span>
          <span className="font-semibold text-primary">Estimated Total Score Gain: +14.5 pts</span>
        </div>
      </div>

      {/* Week-by-Week Milestones */}
      <div className="space-y-4">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`bg-white rounded-2xl border p-6 shadow-subtle transition-all ${
              week.completed
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-surface-border hover:border-brand-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => handleToggle(week.weekNumber)}
                  className="mt-1 text-content-muted hover:text-primary transition-colors shrink-0"
                >
                  {week.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-status-success fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6 hover:text-primary" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Week {week.weekNumber}
                    </span>
                    <span className="text-xs text-content-muted">•</span>
                    <span className="text-xs font-semibold text-content-secondary">{week.goal}</span>
                  </div>
                  <h3 className={`text-base font-extrabold text-content-primary ${week.completed ? 'line-through text-content-muted' : ''}`}>
                    {week.title}
                  </h3>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-brand-50 text-primary border border-brand-200 rounded-lg text-xs font-mono font-bold shrink-0">
                {week.estimatedImpact}
              </span>
            </div>

            {/* Task Details */}
            <div className="mt-4 pl-9 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-surface-border rounded-xl">
                <strong className="text-content-primary block mb-0.5">Assigned Engineering Task:</strong>
                <p className="text-content-secondary leading-relaxed">{week.task}</p>
              </div>

              {/* Expected Evidence Proof */}
              <div>
                <span className="font-bold text-content-primary block mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-status-success" /> Expected Observable Evidence
                </span>
                <ul className="space-y-1 text-content-secondary">
                  {week.expectedEvidence?.map((ev, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {week.skills?.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-white border border-surface-border rounded text-[10px] font-semibold text-content-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
