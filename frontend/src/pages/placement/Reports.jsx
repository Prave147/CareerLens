import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Award,
  Users,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const PlacementReports = () => {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = (format) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary">Institutional Reports & Batch Exports</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Export comprehensive, anonymized batch readiness analytics for accreditation and corporate recruiter presentations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('CSV')}
            disabled={downloading}
            className="px-3.5 py-2 bg-white border border-surface-border hover:bg-slate-50 text-content-primary text-xs font-bold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleDownload('PDF')}
            disabled={downloading}
            className="px-4 py-2 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Executive PDF</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-status-success-border text-status-success text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Report generated and exported successfully.</span>
        </div>
      )}

      {/* Executive Report Preview Card */}
      <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
          <div>
            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block">Executive Placement Brief</span>
            <h2 className="text-xl font-black text-content-primary mt-1">
              Apex Institute of Technology — Class of 2026
            </h2>
            <p className="text-xs text-content-secondary mt-0.5">
              Comprehensive Multi-Source Employability Audit • Verified via CareerLens Engine
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-content-muted block">Batch Size</span>
            <span className="text-2xl font-black text-content-primary font-mono">240 Students</span>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-content-secondary text-[11px]">Average Readiness</span>
            <p className="text-xl font-black text-content-primary mt-0.5">72.4 / 100</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-content-secondary text-[11px]">Tier-1 Candidates</span>
            <p className="text-xl font-black text-status-success mt-0.5">42 Students (17.5%)</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl">
            <span className="text-content-secondary text-[11px]">Tier-2 Candidates</span>
            <p className="text-xl font-black text-primary mt-0.5">134 Students (55.8%)</p>
          </div>
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
            <span className="text-amber-900 text-[11px]">Intervention Required</span>
            <p className="text-xl font-black text-status-warning mt-0.5">64 Students (26.7%)</p>
          </div>
        </div>

        {/* Recruiter Readiness Matching */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
            Corporate Hiring Sector Readiness Matches
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { company: 'Global IT Services & Consulting', match: '91%', desc: 'Full eligibility on core languages, SQL, and Git.' },
              { company: 'Product Startups & Scaleups', match: '84%', desc: 'High React & Node.js repository density.' },
              { company: 'FinTech & HealthTech Enterprises', match: '76%', desc: 'Strong DSA foundation with rising security competence.' },
              { company: 'Tier-1 Tech Giants (FAANG/MAMAA)', match: '62%', desc: 'Requires completion of AWS & test suite milestones.' }
            ].map((s) => (
              <div key={s.company} className="p-4 bg-slate-50 border border-surface-border rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-content-primary">{s.company}</strong>
                  <span className="font-mono font-bold text-secondary">{s.match} Match</span>
                </div>
                <p className="text-content-secondary text-[11px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
