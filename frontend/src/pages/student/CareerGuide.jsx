import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Layers,
  Building2
} from 'lucide-react';

export const CareerGuide = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await studentService.getCareerReport();
        if (res.success) {
          setReport(res.report);
        }
      } catch (err) {
        console.warn('Report error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Career Intelligence Guide & Report</h1>
          <p className="text-xs text-content-secondary mt-1">
            Comprehensive audit of verified technical proof, skill gaps, role alignment, and roadmap deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white border border-surface-border text-content-primary hover:bg-surface-hover font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-content-secondary" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-white border border-surface-border rounded-2xl p-8 sm:p-10 shadow-card space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-black text-primary tracking-tight">CAREER<span className="text-content-primary">LENS</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-50 text-primary rounded">Employability Intelligence</span>
            </div>
            <h2 className="text-xl font-black text-content-primary">{report?.studentName || 'Alex Kumar'}</h2>
            <p className="text-xs text-content-secondary">{report?.collegeName || 'Apex Institute of Technology'} • Target: {report?.targetRole || 'Full Stack Developer'}</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right">
            <span className="text-[10px] text-content-muted block font-semibold">Job Readiness Index</span>
            <span className="text-3xl font-black text-primary">{report?.readinessScore || 79.3} <span className="text-xs font-semibold text-content-muted">/ 100</span></span>
            <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">{report?.statusBadge || 'Strong candidate'}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-xs font-bold text-content-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Executive Summary
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed bg-surface-bg p-4 rounded-xl border border-surface-border">
            {report?.executiveSummary || 'Candidate exhibits strong full-stack foundations with verified multi-commit repository implementations.'}
          </p>
        </div>

        {/* 6-Pillar Score Breakdown */}
        <div>
          <h3 className="text-xs font-bold text-content-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-primary" />
            Readiness Pillar Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-content-muted block">Technical Capability</span>
              <span className="font-extrabold text-content-primary text-base">25.8 / 30</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">86% Mastery</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-content-muted block">Proof of Work</span>
              <span className="font-extrabold text-content-primary text-base">17.2 / 20</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">86% Corroborated</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-content-muted block">Project Strength</span>
              <span className="font-extrabold text-content-primary text-base">15.6 / 20</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">3 Original Repos</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-content-muted block">Activity Consistency</span>
              <span className="font-extrabold text-content-primary text-base">6.5 / 10</span>
              <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Needs Improvement</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-content-muted block">Role Fit</span>
              <span className="font-extrabold text-content-primary text-base">8.6 / 10</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Strong Alignment</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-content-muted block">Evidence Confidence</span>
              <span className="font-extrabold text-content-primary text-base">8.2 / 10</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">High Confidence</span>
            </div>
          </div>
        </div>

        {/* Verified Skills vs Weak Claims */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Verified Technical Skills ({report?.verifiedSkills?.length || 8})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(report?.verifiedSkills || ['React', 'Node.js', 'MongoDB', 'JavaScript', 'DSA', 'Express.js', 'Socket.IO', 'Git']).map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-300 rounded text-[11px] font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Unverified / Missing Proof ({report?.weakClaims?.length || 3})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(report?.weakClaims || ['Docker & Containers', 'AWS Cloud Deployment', 'Automated Testing']).map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white text-amber-800 border border-amber-300 rounded text-[11px] font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Next Steps */}
        <div className="pt-4 border-t border-surface-border text-xs">
          <h3 className="text-xs font-bold text-content-primary uppercase tracking-wider mb-3">
            Priority Action Deliverables (30-Day Focus)
          </h3>
          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-content-primary">1. Multi-Stage Dockerfile & Docker Compose on MediRoute</span>
              <span className="font-bold text-emerald-700">+4.5 pts</span>
            </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="font-semibold text-content-primary">2. Jest / Supertest Integration Tests (&gt;70% Branch Coverage)</span>
                <span className="font-bold text-emerald-700">+4.0 pts</span>
              </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-content-primary">3. AWS ECS Deployment with HTTPS & S3 Assets</span>
              <span className="font-bold text-emerald-700">+3.5 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
