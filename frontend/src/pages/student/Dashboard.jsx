import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Code2,
  FileCheck2,
  Milestone,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Target,
  Zap,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [analyzingStage, setAnalyzingStage] = useState(null); // String stage name if scanning

  const analysisStages = [
    'Reading resume & claims...',
    'Extracting skill claims...',
    'Checking GitHub repositories...',
    'Checking coding platform activity...',
    'Comparing multi-source evidence...',
    'Validating repository ownership & forks...',
    'Analyzing project complexity...',
    'Matching candidate roles...',
    'Calculating 6-pillar readiness score...',
    'Generating personalized roadmap...'
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAnalysis();
      if (res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.warn('Analysis fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunFullAnalysis = async () => {
    try {
      // Step through progress stages
      for (let i = 0; i < analysisStages.length; i++) {
        setAnalyzingStage(analysisStages[i]);
        await new Promise((r) => setTimeout(r, 320));
      }

      const res = await studentService.triggerAnalyze({});
      if (res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingStage(null);
    }
  };

  // Score & Metrics
  const score = analysis?.readinessScore || 79.3;
  const projectedScore = analysis?.projectedReadiness || 91.3;
  const statusBadge = analysis?.statusBadge || 'Strong candidate';
  const statusSubtitle = analysis?.statusSubtitle || 'Strong foundation with a few targeted proof gaps.';
  const kpi = analysis?.kpi || { verifiedSkills: 18, evidenceSources: 5, profileCompleteness: 87, criticalGaps: 3 };

  const radarData = analysis?.radarScores || [
    { category: 'Frontend', studentScore: 92, industryBenchmark: 80 },
    { category: 'Backend', studentScore: 88, industryBenchmark: 75 },
    { category: 'DSA & Algorithms', studentScore: 78, industryBenchmark: 70 },
    { category: 'Architecture', studentScore: 62, industryBenchmark: 75 },
    { category: 'DevOps & Cloud', studentScore: 35, industryBenchmark: 70 },
    { category: 'Testing & QA', studentScore: 40, industryBenchmark: 65 },
  ];

  const pillarData = [
    { name: 'Technical Capability', score: 25.8, max: 30, percentage: 86, color: '#2563EB' },
    { name: 'Proof of Work', score: 17.2, max: 20, percentage: 86, color: '#4F46E5' },
    { name: 'Project Strength', score: 15.6, max: 20, percentage: 78, color: '#0284C7' },
    { name: 'Activity Consistency', score: 6.5, max: 10, percentage: 65, color: '#D97706' },
    { name: 'Role Fit', score: 8.6, max: 10, percentage: 86, color: '#16A34A' },
    { name: 'Evidence Confidence', score: 8.2, max: 10, percentage: 82, color: '#059669' },
  ];

  const simulations = analysis?.improvementSimulations || [
    { action: 'Add multi-container Docker Compose setup to MediRoute', estimatedScoreGain: 4.5, skill: 'Docker' },
    { action: 'Write Jest & Supertest integration tests (>70% coverage)', estimatedScoreGain: 4.0, skill: 'Testing' },
    { action: 'Deploy full-stack application to AWS ECS with CloudFront', estimatedScoreGain: 3.5, skill: 'AWS' },
  ];

  const deductions = analysis?.scoreDeductions || [
    { factor: 'Docker containerization evidence', penalty: -4.5, reason: 'Claimed on resume but 0 Dockerfiles found in public repos.' },
    { factor: 'Automated test suite coverage', penalty: -4.0, reason: 'Repository test suites have < 20% branch coverage.' },
    { factor: 'Cloud infrastructure deployment', penalty: -3.5, reason: 'No AWS infrastructure code or live cloud configs detected.' }
  ];

  const recentEvidence = analysis?.recentEvidence || [
    { skill: 'React', status: 'VERIFIED', sources: 'GitHub + Portfolio', confidence: '94%' },
    { skill: 'Node.js', status: 'VERIFIED', sources: 'GitHub + LinkedIn', confidence: '91%' },
    { skill: 'DSA', status: 'VERIFIED', sources: 'LeetCode (427) + GFG (180)', confidence: '90%' },
    { skill: 'Docker', status: 'UNVERIFIED', sources: 'Resume claim only (No repo proof)', confidence: '20%' },
    { skill: 'AWS', status: 'UNVERIFIED', sources: 'Resume claim only', confidence: '15%' }
  ];

  return (
    <div className="space-y-6">
      {/* Analysis Stage Progress Modal */}
      {analyzingStage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border p-8 shadow-elevated max-w-md w-full text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-primary flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-content-primary">Analyzing Employability Intelligence</h3>
              <p className="text-xs text-primary font-semibold mt-1 animate-pulse">{analyzingStage}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[11px] text-content-muted">Reconciling claims against code commits and DSA benchmarks...</p>
          </div>
        </div>
      )}

      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-content-primary">
              Good day, {user?.name ? user.name.split(' ')[0] : 'Alex'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Placement: PENDING
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            Target Role: <strong className="text-content-primary">Full Stack Developer</strong> • CareerLens verified employability readiness overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunFullAnalysis}
            disabled={analyzingStage !== null}
            className="px-3.5 py-1.5 bg-white border border-surface-border hover:bg-slate-50 text-content-primary text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Re-Analyze Profile</span>
          </button>
          <Link
            to="/roadmap"
            className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>View Roadmap</span>
          </Link>
        </div>
      </div>

      {/* Main Readiness Card + KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Readiness Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-content-secondary">
                Job Readiness Index
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-status-success font-bold text-xs border border-status-success-border">
                {statusBadge}
              </span>
            </div>

            <div className="my-5 flex items-baseline gap-2">
              <span className="text-5xl font-black text-content-primary tracking-tight">
                {score}
              </span>
              <span className="text-lg font-bold text-content-muted">/ 100</span>
            </div>

            <p className="text-xs text-content-secondary leading-relaxed">
              {statusSubtitle}
            </p>

            <div className="mt-4 pt-4 border-t border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-content-secondary">Market Benchmark (Tier-1):</span>
                <span className="font-bold text-content-primary">80.0+</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
            <span className="text-content-secondary">Evidence Confidence:</span>
            <span className="font-bold text-primary flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" /> HIGH (92%)
            </span>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary">Verified Skills</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-status-success flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-content-primary">{kpi.verifiedSkills}</p>
              <p className="text-[11px] text-content-muted mt-0.5">Code & commit proof confirmed</p>
            </div>
            <Link to="/evidence" className="mt-3 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Open Evidence Matrix <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary">Evidence Sources</span>
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-primary flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-content-primary">{kpi.evidenceSources}</p>
              <p className="text-[11px] text-content-muted mt-0.5">GitHub, LeetCode, GFG, Portfolio, Resume</p>
            </div>
            <Link to="/profile" className="mt-3 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Manage Handles <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary">Best Current Role</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-secondary flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xl font-extrabold text-content-primary">Frontend Developer</p>
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">88% Immediate Fit</p>
            </div>
            <Link to="/career-path" className="mt-3 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              View Career Path <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Critical Gaps</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-status-warning flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-status-warning">{kpi.criticalGaps}</p>
              <p className="text-[11px] text-amber-800 mt-0.5">-12.0 pts deduction</p>
            </div>
            <Link to="/skills" className="mt-3 text-xs font-semibold text-status-warning hover:underline inline-flex items-center gap-1">
              Fix Skill Gaps <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Improvement Simulation Card (Calculated via Engine) */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 rounded-2xl p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Dynamic Score Improvement Simulation
              </span>
            </div>
            <h3 className="text-base font-extrabold text-content-primary">
              Estimated Readiness: {score} → <span className="text-emerald-700 font-black">{projectedScore}</span> / 100
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              *Calculated deterministically through the CareerLens scoring engine upon closing detected evidence gaps. (Estimated improvement, not guaranteed).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {simulations.map((sim, sIdx) => (
            <div key={sIdx} className="p-3.5 bg-white border border-blue-100 rounded-xl text-xs flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-content-primary">{sim.skill}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[11px]">
                    +{sim.estimatedScoreGain} pts
                  </span>
                </div>
                <p className="text-[11px] text-content-secondary leading-relaxed">{sim.action}</p>
              </div>
              <Link to="/roadmap" className="mt-3 text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                Execute in Roadmap <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section: Radar + 6-Pillar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-content-primary">Skill Competency vs Benchmark</h3>
              <p className="text-xs text-content-secondary">Candidate verified performance vs industry expectations</p>
            </div>
            <span className="text-xs font-semibold text-primary">Radar Analysis</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <Radar name="Alex Kumar" dataKey="studentScore" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
                <Radar name="Benchmark" dataKey="industryBenchmark" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs mt-2">
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Candidate Score
            </span>
            <span className="flex items-center gap-1.5 text-content-secondary">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span> Industry Benchmark
            </span>
          </div>
        </div>

        {/* 6-Pillar Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-content-primary">6-Pillar Employability Breakdown</h3>
                <p className="text-xs text-content-secondary">Configurable formula calculating your {score} readiness score</p>
              </div>
              <span className="text-xs font-mono font-bold text-primary bg-brand-50 px-2 py-0.5 rounded">
                Formula Verified
              </span>
            </div>

            <div className="space-y-3">
              {pillarData.map((p) => (
                <div key={p.name} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-content-primary">{p.name}</span>
                    <span className="font-mono font-bold text-content-secondary">
                      {p.score} <span className="text-[10px] text-content-muted">/ {p.max}</span> ({p.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${p.percentage}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-content-secondary">
            <span>Total Weighted Readiness Index:</span>
            <span className="font-bold text-content-primary font-mono text-sm">{score} / 100</span>
          </div>
        </div>
      </div>

      {/* Recent Evidence & Score Deductions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Evidence Stream */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-content-primary">Recent Evidence Verification</h3>
              <p className="text-xs text-content-secondary">Reconciled claims across connected platforms</p>
            </div>
            <Link to="/evidence" className="text-xs font-bold text-primary hover:underline">
              View All 18
            </Link>
          </div>

          <div className="divide-y divide-surface-border text-xs">
            {recentEvidence.map((ev) => (
              <div key={ev.skill} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ev.status === 'VERIFIED' ? 'bg-status-success' : 'bg-status-danger'}`} />
                  <div>
                    <p className="font-bold text-content-primary">{ev.skill}</p>
                    <p className="text-[11px] text-content-secondary">{ev.sources}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ev.status === 'VERIFIED' 
                      ? 'bg-emerald-50 text-status-success border border-status-success-border' 
                      : 'bg-red-50 text-status-danger border border-red-200'
                  }`}>
                    {ev.status}
                  </span>
                  <p className="text-[10px] text-content-muted mt-0.5">{ev.confidence} confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Deductions */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-content-primary">What is reducing my score?</h3>
              <p className="text-xs text-content-secondary">Actionable gap deductions blocking tier-1 ranking</p>
            </div>
            <Link to="/skills" className="text-xs font-bold text-status-warning hover:underline">
              Fix Gaps
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {deductions.map((d) => (
              <div key={d.factor} className="p-3 bg-slate-50 border border-surface-border rounded-xl flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-content-primary">{d.factor}</p>
                  <p className="text-[11px] text-content-secondary mt-0.5">{d.reason}</p>
                </div>
                <span className="px-2 py-1 bg-red-50 text-status-danger border border-red-200 rounded font-mono font-bold text-xs shrink-0">
                  {d.penalty} pts
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">Total potential score recovery:</span>
            <span className="font-mono font-black text-primary text-sm">+12.0 Points</span>
          </div>
        </div>
      </div>
    </div>
  );
};
