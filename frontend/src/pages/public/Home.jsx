import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Code2,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Building2,
  Compass,
  FileSpreadsheet,
  Award,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react';

export const Home = () => {
  const { loginDemoStudent, loginDemoPlacement } = useAuth();
  const navigate = useNavigate();

  const handleStudentDemo = () => {
    loginDemoStudent();
    navigate('/dashboard');
  };

  const handlePlacementDemo = () => {
    loginDemoPlacement();
    navigate('/placement');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-primary text-xs sm:text-sm font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Deterministic Evidence Reconciliation Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-content-primary leading-[1.15]">
            Know what you're capable of.<br />
            <span className="text-primary">Know what employers expect.</span><br />
            Know what to build next.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-content-secondary max-w-2xl mx-auto leading-relaxed">
            CareerLens verifies your skills using evidence from your projects, coding activity, professional profile and experience — then creates a personalized path to career readiness.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/student/signup"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-card transition-all duration-200 flex items-center justify-center gap-2"
            >
              Analyze My Profile <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleStudentDemo}
              className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-content-primary bg-white hover:bg-slate-50 border border-surface-border rounded-xl shadow-subtle transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Live Demo
            </button>
            <button
              onClick={handlePlacementDemo}
              className="w-full sm:w-auto px-5 py-3.5 text-sm font-semibold text-secondary bg-secondary-light hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-secondary" /> Placement Portal Demo
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-content-secondary font-medium">
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-status-success" /> No API Keys Needed</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-status-success" /> Multi-Platform Verification</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-status-success" /> Deterministic Scoring</span>
          </div>
        </div>

        {/* HERO VISUAL MOCK DASHBOARD */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-2xl border border-surface-border shadow-elevated p-5 sm:p-7 relative overflow-hidden">
          {/* Top Bar simulation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-surface-border gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center font-bold text-primary">
                AK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-content-primary text-base">Alex Kumar</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-status-success font-semibold border border-status-success-border">
                    Candidate Verified
                  </span>
                </div>
                <p className="text-xs text-content-secondary">Target Role: Full Stack Developer • Apex Institute of Technology</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-content-secondary">Overall Readiness:</span>
              <span className="px-3 py-1 bg-brand-50 border border-brand-200 text-primary font-extrabold text-sm rounded-lg">
                79.3 / 100
              </span>
            </div>
          </div>

          {/* Grid Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-surface-border">
              <span className="text-xs font-semibold text-content-secondary">Verified Skills</span>
              <p className="text-2xl font-extrabold text-content-primary mt-1">18 <span className="text-xs text-status-success font-semibold">Stack Proven</span></p>
              <p className="text-[11px] text-content-muted mt-1">React, Node, MongoDB, Socket.IO</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-surface-border">
              <span className="text-xs font-semibold text-content-secondary">Evidence Sources</span>
              <p className="text-2xl font-extrabold text-content-primary mt-1">5 <span className="text-xs text-primary font-semibold">Active</span></p>
              <p className="text-[11px] text-content-muted mt-1">GitHub, LeetCode, GFG, Portfolio, CV</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-surface-border">
              <span className="text-xs font-semibold text-content-secondary">Profile Completeness</span>
              <p className="text-2xl font-extrabold text-content-primary mt-1">87%</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
              <span className="text-xs font-semibold text-amber-900">Critical Skill Gaps</span>
              <p className="text-2xl font-extrabold text-status-warning mt-1">3 <span className="text-xs font-semibold">Remediable</span></p>
              <p className="text-[11px] text-amber-800 mt-1">Docker (-7), Testing (-5), AWS (-4)</p>
            </div>
          </div>

          {/* Evidence Matrix Snippet Preview */}
          <div className="mt-6 pt-5 border-t border-surface-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-content-secondary">Multi-Source Verification Chain Sample</span>
              <span className="text-xs font-semibold text-primary">Live Trace Reconciled</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-content-primary">React.js</span>
                  <p className="text-[11px] text-content-secondary">GitHub MediRoute + Portfolio</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-status-success font-bold text-[11px] rounded border border-status-success-border">
                  VERIFIED (92%)
                </span>
              </div>
              <div className="p-3 bg-white border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-content-primary">DSA / Problem Solving</span>
                  <p className="text-[11px] text-content-secondary">LeetCode 427 + GFG 180</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-status-success font-bold text-[11px] rounded border border-status-success-border">
                  VERIFIED (90%)
                </span>
              </div>
              <div className="p-3 bg-white border border-red-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-content-primary">Docker Containerization</span>
                  <p className="text-[11px] text-content-secondary">Resume claim only (0 Repos)</p>
                </div>
                <span className="px-2 py-0.5 bg-red-50 text-status-danger font-bold text-[11px] rounded border border-red-200">
                  UNVERIFIED (20%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Workflow</h2>
          <p className="text-3xl font-extrabold text-content-primary tracking-tight">How CareerLens Works</p>
          <p className="text-sm text-content-secondary mt-2">A systematic 6-step engineering pipeline turning self-claimed resumes into verified employability milestones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Build Your Profile', desc: 'Add your target career path, academic background, and repository identifiers without complex setups.' },
            { step: '02', title: 'Connect Your Evidence', desc: 'Connect GitHub repos, LeetCode handles, GFG profiles, LinkedIn claims, and deployed portfolio URLs.' },
            { step: '03', title: 'Verify Your Skills', desc: 'Our reconciliation engine cross-checks claims against commit histories, test coverage, and problem metrics.' },
            { step: '04', title: 'Compare Target Roles', desc: 'Benchmark verified competencies against real job market requirements for Full Stack, Backend, AI, and DevOps.' },
            { step: '05', title: 'Discover Skill Gaps', desc: 'Identify precise deductions reducing your readiness score (e.g., missing Dockerfiles or lacking unit tests).' },
            { step: '06', title: 'Follow Action Roadmap', desc: 'Execute weekly personalized milestones to eliminate unverified deficits and elevate your candidate score.' },
          ].map((item) => (
            <div key={item.step} className="p-6 bg-white rounded-xl border border-surface-border card-shadow card-hover relative">
              <span className="text-3xl font-black text-brand-100 absolute top-5 right-5">{item.step}</span>
              <h3 className="text-base font-bold text-content-primary mt-2">{item.title}</h3>
              <p className="text-xs text-content-secondary mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EVIDENCE-BASED ANALYSIS ================= */}
      <section id="evidence-engine" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-border p-8 sm:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-50 text-primary text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" /> Evidence vs Claims
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
                Resume claims are no longer blindly trusted.
              </h3>
              <p className="mt-4 text-sm text-content-secondary leading-relaxed">
                Traditional hiring relies on keywords that anyone can copy-paste. CareerLens compares resume statements with <strong>observable proof</strong>: repository commit counts, architecture modularity, algorithmic contest rankings, and live URLs.
              </p>
              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-status-success flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <strong className="text-content-primary">Verified Status:</strong> Requires minimum 2 corroborating proof sources (e.g. 87 GitHub commits + live demo).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-status-warning flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <strong className="text-content-primary">Unverified Penalty:</strong> Claiming Docker or AWS without proof triggers explicit scoring deductions.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-surface-border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-secondary mb-3">
                Deterministic Scoring Pillars
              </h4>
              {[
                { name: 'Technical Skills Stack', weight: '30%', score: '25.8 / 30', desc: 'Verified framework & language depth' },
                { name: 'Project Evidence', weight: '25%', score: '20.5 / 25', desc: 'Commits, repository health & deployments' },
                { name: 'DSA & Problem Solving', weight: '15%', score: '11.7 / 15', desc: 'LeetCode / GFG medium & hard distributions' },
                { name: 'Professional Experience', weight: '15%', score: '10.5 / 15', desc: 'Internships and industry certifications' },
                { name: 'Engineering Consistency', weight: '15%', score: '10.8 / 15', desc: 'Active commit streak & continuous learning' },
              ].map((p) => (
                <div key={p.name} className="p-3 bg-white rounded-lg border border-surface-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-content-primary">{p.name} <span className="text-[10px] text-primary font-semibold">({p.weight})</span></p>
                    <p className="text-[11px] text-content-muted">{p.desc}</p>
                  </div>
                  <span className="font-mono font-bold text-content-primary bg-slate-100 px-2 py-1 rounded">
                    {p.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MULTI-PLATFORM EVIDENCE ================= */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Connected Proof</h2>
          <p className="text-3xl font-extrabold text-content-primary tracking-tight">Multi-Platform Evidence Aggregation</p>
          <p className="text-sm text-content-secondary mt-2">Corroborate engineering skills across the platforms technical recruiters actually care about.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'GitHub', icon: GitBranch, metrics: 'Commits, repos, test suites & architectures' },
            { name: 'LeetCode', icon: Code2, metrics: '427 solved, contest rating & topic metrics' },
            { name: 'GeeksforGeeks', icon: Award, metrics: 'Coding score, articles & certifications' },
            { name: 'LinkedIn', icon: FileCheck2, metrics: 'Internship dates, roles & endorsements' },
            { name: 'Portfolio', icon: Compass, metrics: 'Case studies, live demos & UI design' },
            { name: 'Resume', icon: FileSpreadsheet, metrics: 'Structured claim extraction & validation' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="p-4 bg-white rounded-xl border border-surface-border text-center card-hover card-shadow">
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-primary flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-content-primary">{item.name}</h4>
                <p className="text-[11px] text-content-secondary mt-1">{item.metrics}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FOR PLACEMENT CELL ================= */}
      <section id="placement-cell" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-secondary-light/40 border border-indigo-200 rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-100 text-secondary text-xs font-bold mb-3">
                <Building2 className="w-4 h-4" /> Institutional Career Intelligence
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
                For Placement Cells & University Directors
              </h3>
              <p className="mt-4 text-sm text-content-secondary leading-relaxed">
                Gain macro-level visibility into your entire graduating batch. Detect batch-wide skill deficits (e.g. 68% weak cloud evidence) weeks before placement season begins, and launch targeted bootcamps that directly increase campus placement ratios.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handlePlacementDemo}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-secondary hover:bg-secondary-hover rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  Explore Placement Intelligence <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/placement/signup"
                  className="px-5 py-2.5 text-xs font-bold text-secondary bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Register Placement Cell
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-indigo-100 p-5 space-y-4 shadow-sm text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <span className="font-bold text-content-primary">Batch 2026 Macro Metrics</span>
                <span className="text-[11px] text-secondary font-semibold">240 Analyzed</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-content-secondary text-[11px]">Avg Batch Readiness</span>
                  <p className="text-xl font-extrabold text-content-primary mt-0.5">72 / 100</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-amber-900 text-[11px]">Need Intervention</span>
                  <p className="text-xl font-extrabold text-status-warning mt-0.5">64 Students</p>
                </div>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <p className="font-semibold text-secondary">Recommended Institutional Action:</p>
                <p className="text-content-secondary text-[11px] mt-0.5">Run 2-Day AWS ECS deployment workshop to resolve cloud deficit affecting 163 students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-white border border-surface-border rounded-2xl p-10 sm:p-14 shadow-card">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            Ready to understand your career readiness?
          </h2>
          <p className="mt-3 text-base text-content-secondary max-w-xl mx-auto">
            Stop guessing whether your resume passes technical scrutiny. Reconcile your evidence today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/student/signup"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-card transition-all duration-200"
            >
              Get Started Now
            </Link>
            <button
              onClick={handleStudentDemo}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-content-primary bg-slate-50 hover:bg-slate-100 border border-surface-border rounded-xl transition-all duration-200"
            >
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
