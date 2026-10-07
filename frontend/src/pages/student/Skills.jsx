import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Milestone,
  Sparkles,
  HelpCircle,
  Code2,
  Layers
} from 'lucide-react';

export const Skills = () => {
  const [gaps, setGaps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const res = await studentService.getSkillGaps();
        if (res.skillGaps) {
          setGaps(res.skillGaps);
        }
      } catch (err) {
        console.warn('Gaps fetch error, using default set:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  const critical = gaps?.criticalGaps || [
    {
      skill: 'Docker & Containerization',
      category: 'DevOps & Deployment',
      penalty: -7.0,
      whyItMatters: 'Standard in modern SaaS companies for reproducible environments, CI/CD pipelines, and microservices.',
      currentEvidence: 'Claimed on resume & LinkedIn. Zero Dockerfiles or docker-compose.yml files in repositories.',
      expectedEvidence: 'Dockerfile in repo root, multi-container compose file, and Docker Hub image registry link.',
      recommendedAction: 'Containerize MediRoute full-stack project with frontend, backend, and MongoDB services.'
    },
    {
      skill: 'Automated Unit & Integration Testing',
      category: 'Software Quality & Reliability',
      penalty: -5.0,
      whyItMatters: 'Essential for maintainable enterprise applications and preventing regression bugs in production.',
      currentEvidence: '3 rudimentary test files found across all repositories (Code coverage < 20%).',
      expectedEvidence: 'Jest/Mocha test suites covering controllers, middleware, and business logic with > 70% branch coverage.',
      recommendedAction: 'Write integration test suites for authentication and telemedicine triage endpoints.'
    },
    {
      skill: 'Cloud Infrastructure (AWS/GCP)',
      category: 'Cloud Engineering',
      penalty: -4.0,
      whyItMatters: 'Hiring teams expect candidates to have hands-on experience deploying, monitoring, and configuring cloud services.',
      currentEvidence: 'Listed on resume, but projects are hosted only on free PaaS platforms without AWS infrastructure code.',
      expectedEvidence: 'Deployment architecture diagram, AWS S3/EC2/ECS integration, or Infrastructure as Code (Terraform).',
      recommendedAction: 'Deploy MediRoute to AWS ECS or EC2 with CloudFront SSL/TLS termination.'
    }
  ];

  const moderate = gaps?.moderateGaps || [
    {
      skill: 'High-Concurrency Caching (Redis)',
      category: 'System Design & Performance',
      penalty: -2.5,
      whyItMatters: 'Critical for optimizing database queries and handling heavy traffic in scalable web applications.',
      currentEvidence: 'Direct MongoDB queries on every request with no cache layer.',
      expectedEvidence: 'Redis integration for caching frequent read queries and rate-limiting.',
      recommendedAction: 'Implement Redis caching layer for telemedicine appointment slots search.'
    },
    {
      skill: 'Formal System Architecture Docs',
      category: 'Engineering Communication',
      penalty: -1.5,
      whyItMatters: 'Demonstrates senior architectural thinking and clear communication for cross-functional engineering teams.',
      currentEvidence: 'Basic README files with install instructions only.',
      expectedEvidence: 'Sequence diagrams, API endpoint specifications (Swagger/Postman), and data flow charts.',
      recommendedAction: 'Add architecture diagrams and Open API 3.0 specs to MediRoute repository.'
    }
  ];

  const minor = gaps?.minorGaps || [
    {
      skill: 'CI/CD Pipeline Automation',
      category: 'DevOps',
      penalty: -1.0,
      whyItMatters: 'Automates testing, linting, and build verification on every pull request.',
      currentEvidence: 'Manual deployments without GitHub Actions workflow badges.',
      expectedEvidence: '.github/workflows/ci.yml running tests on push.',
      recommendedAction: 'Set up GitHub Actions to automatically run linter and test suites on push.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary">Skill Gap Intelligence</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Deductions and missing evidence components currently separating your profile from target role readiness.
          </p>
        </div>

        <Link
          to="/roadmap"
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Milestone className="w-3.5 h-3.5" />
          <span>Convert Gaps to Roadmap</span>
        </Link>
      </div>

      {/* Critical Gaps */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-status-danger inline-block"></span>
          <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
            Critical Gaps (High Score Penalty)
          </h3>
        </div>

        <div className="space-y-4">
          {critical.map((gap) => (
            <div key={gap.skill} className="bg-white rounded-2xl border border-red-200 p-5 shadow-subtle space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-content-primary">{gap.skill}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-content-secondary">
                      {gap.category}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-red-50 text-status-danger border border-red-200 rounded-lg font-mono font-extrabold text-xs shrink-0">
                  {gap.penalty} pts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-content-secondary text-[11px] block mb-1">Why It Matters</span>
                  <p className="text-content-primary leading-relaxed">{gap.whyItMatters}</p>
                </div>
                <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                  <span className="font-bold text-red-900 text-[11px] block mb-1">Current Evidence</span>
                  <p className="text-content-secondary leading-relaxed">{gap.currentEvidence}</p>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <span className="font-bold text-emerald-900 text-[11px] block mb-1">Expected Evidence</span>
                  <p className="text-content-secondary leading-relaxed">{gap.expectedEvidence}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-surface-border text-xs">
                <div className="flex items-center gap-1.5 text-primary font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended Action: {gap.recommendedAction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderate Gaps */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-status-warning inline-block"></span>
          <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
            Moderate Gaps (Optimization Opportunities)
          </h3>
        </div>

        <div className="space-y-3">
          {moderate.map((gap) => (
            <div key={gap.skill} className="bg-white rounded-xl border border-amber-200 p-4 shadow-subtle space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-content-primary text-sm">{gap.skill}</h4>
                <span className="px-2 py-0.5 bg-amber-50 text-status-warning border border-amber-200 rounded font-mono font-bold text-xs">
                  {gap.penalty} pts
                </span>
              </div>
              <p className="text-content-secondary">{gap.whyItMatters}</p>
              <div className="p-2.5 bg-slate-50 rounded-lg text-content-primary">
                <strong>Action:</strong> {gap.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minor Gaps */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
          <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
            Minor Enhancements
          </h3>
        </div>

        <div className="space-y-2">
          {minor.map((gap) => (
            <div key={gap.skill} className="bg-white rounded-xl border border-surface-border p-4 shadow-subtle flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-content-primary">{gap.skill}</h4>
                <p className="text-content-secondary text-[11px] mt-0.5">{gap.recommendedAction}</p>
              </div>
              <span className="font-mono font-bold text-content-secondary">{gap.penalty} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
