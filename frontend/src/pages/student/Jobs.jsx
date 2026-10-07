import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Briefcase,
  Layers,
  FileText
} from 'lucide-react';

export const Jobs = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('full-stack-developer');
  const [jobDescription, setJobDescription] = useState(
    'We are looking for a Full Stack Developer proficient in React, Node.js, Express, MongoDB, Docker containerization, AWS cloud deployment, unit testing with Jest, and strong system design foundations.'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState({
    matchPercentage: 74,
    summary: 'Strong candidate for core MERN stack development, but unverified cloud infrastructure (AWS) and missing Docker containerization evidence reduce match confidence.',
    matchedSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Git'],
    partialSkills: ['Testing (Jest)', 'System Design'],
    missingSkills: ['Docker & Compose', 'AWS Deployment'],
    recommendations: [
      'Containerize MediRoute using Docker and add docker-compose.yml to the public repository.',
      'Deploy the backend to an AWS EC2/ECS cluster with CloudFront HTTPS integration.'
    ]
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await jobService.getRoles();
        if (res.roles) setRoles(res.roles);
      } catch (err) {
        console.warn('Job roles fallback:', err.message);
      }
    };
    fetchRoles();
  }, []);

  const handleAnalyzeJD = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const res = await jobService.analyzeJobMatch({
        roleId: selectedRole,
        jobDescription,
      });
      if (res.analysis) {
        setMatchResult(res.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold text-content-primary">Target Roles & Job Description Matcher</h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Select target career paths or paste real job descriptions to benchmark your verified evidence against hiring requirements.
        </p>
      </div>

      {/* Target Role Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {[
          { id: 'full-stack-developer', title: 'Full Stack Developer', match: '74%', demand: 'High' },
          { id: 'frontend-developer', title: 'Frontend Developer', match: '88%', demand: 'High' },
          { id: 'backend-developer', title: 'Backend Developer', match: '81%', demand: 'High' },
          { id: 'software-engineer', title: 'Software Engineer', match: '76%', demand: 'Very High' },
          { id: 'devops-engineer', title: 'DevOps & Cloud', match: '42%', demand: 'High' },
          { id: 'data-scientist', title: 'Data Scientist', match: '48%', demand: 'High' },
        ].map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedRole(r.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedRole === r.id
                ? 'bg-brand-50 border-primary shadow-sm ring-1 ring-primary'
                : 'bg-white border-surface-border hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-content-primary">{r.title}</span>
              <span className="font-mono font-bold text-primary">{r.match}</span>
            </div>
            <p className="text-[11px] text-content-secondary mt-1">Market Demand: {r.demand}</p>
          </div>
        ))}
      </div>

      {/* JD Paste & Analyzer */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-content-primary">Paste Real Job Description (JD)</h3>
          </div>
          <span className="text-[11px] text-content-secondary">Instant Skill Extraction</span>
        </div>

        <form onSubmit={handleAnalyzeJD} className="space-y-3">
          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete hiring requirements from LinkedIn, Indeed, or company job posts..."
            className="w-full p-3 text-xs bg-surface-bg border border-surface-border rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{analyzing ? 'Analyzing Match...' : 'Calculate Job Match'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Matching Results */}
      {matchResult && (
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                Compatibility Analysis
              </span>
              <h3 className="text-lg font-extrabold text-content-primary">
                Target Role Match: {matchResult.matchPercentage}%
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">{matchResult.summary}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs text-content-muted block">Estimated OA Shortlist Chance</span>
                <span className="text-xl font-extrabold text-primary font-mono">High (78%)</span>
              </div>
            </div>
          </div>

          {/* Matched, Partial, Missing Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-status-success">
                <CheckCircle2 className="w-4 h-4" /> Matched & Verified ({matchResult.matchedSkills?.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchedSkills?.map((s) => (
                  <span key={s} className="px-2 py-1 bg-white border border-emerald-200 rounded text-emerald-900 font-semibold text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-status-warning">
                <AlertCircle className="w-4 h-4" /> Partial Evidence ({matchResult.partialSkills?.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.partialSkills?.map((s) => (
                  <span key={s} className="px-2 py-1 bg-white border border-amber-200 rounded text-amber-900 font-semibold text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-status-danger">
                <XCircle className="w-4 h-4" /> Missing / Unverified ({matchResult.missingSkills?.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills?.map((s) => (
                  <span key={s} className="px-2 py-1 bg-white border border-red-200 rounded text-red-900 font-semibold text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="pt-2">
            <span className="font-bold text-xs text-content-primary block mb-2">
              To Reach 90%+ Match on this Job Post:
            </span>
            <div className="space-y-2 text-xs">
              {matchResult.recommendations?.map((r, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-surface-border rounded-lg flex items-start gap-2 text-content-secondary">
                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
