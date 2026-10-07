import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { SkillEvidenceModal } from '../../components/SkillEvidenceModal';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FolderGit2,
  FileText,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Layers,
  Milestone
} from 'lucide-react';

export const Skills = () => {
  const { skills, summary, loading, refreshEvidence } = useSkillEvidence();
  const [filter, setFilter] = useState('ALL'); // ALL, VERIFIED, PARTIALLY_VERIFIED, UNVERIFIED
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'gaps'

  const filteredSkills = skills.filter((item) => {
    if (filter === 'VERIFIED') {
      if (item.status !== 'VERIFIED' && item.status !== 'STRONGLY_VERIFIED') return false;
    } else if (filter === 'PARTIALLY_VERIFIED') {
      if (item.status !== 'PARTIALLY_VERIFIED') return false;
    } else if (filter === 'UNVERIFIED') {
      if (item.status !== 'UNVERIFIED' && item.status !== 'NOT_FOUND') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.skill.toLowerCase().includes(q);
      const matchCat = (item.category || '').toLowerCase().includes(q);
      const matchReason = (item.reason || '').toLowerCase().includes(q);
      return matchName || matchCat || matchReason;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    if (status === 'VERIFIED' || status === 'STRONGLY_VERIFIED') {
      return (
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-extrabold inline-flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          VERIFIED
        </span>
      );
    }
    if (status === 'PARTIALLY_VERIFIED') {
      return (
        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-extrabold inline-flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          PARTIALLY VERIFIED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[11px] font-extrabold inline-flex items-center gap-1">
        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
        UNVERIFIED
      </span>
    );
  };

  const getConfidenceBadge = (conf) => {
    switch (conf) {
      case 'HIGH':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">HIGH CONFIDENCE</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">MEDIUM</span>;
      default:
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
              Proof-Backed Capability
            </span>
            <span className="text-xs text-content-secondary">
              Deterministic Employability Verification
            </span>
          </div>
          <h1 className="text-2xl font-black text-content-primary">Skills & Evidence Matrix</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Cross-references claimed skills from your resume with actual observable code in GitHub repositories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'matrix' ? 'bg-white text-primary shadow-subtle' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Evidence Matrix ({skills.length})
            </button>
            <button
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'gaps' ? 'bg-white text-status-warning shadow-subtle' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Actionable Gaps ({summary?.unverifiedCount || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-content-muted">Total Tracked</span>
            <p className="text-2xl font-black text-content-primary">{summary.totalSkills}</p>
            <span className="text-[11px] text-content-secondary block">Claims & technologies</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-card space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Verified Skills</span>
            <p className="text-2xl font-black text-emerald-700">{summary.verifiedCount}</p>
            <span className="text-[11px] text-emerald-600 font-medium block">Confirmed in codebase</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-card space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Partially Verified</span>
            <p className="text-2xl font-black text-amber-700">{summary.partiallyVerifiedCount}</p>
            <span className="text-[11px] text-amber-600 font-medium block">Forks or moderate proof</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-card space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Evidence Coverage</span>
            <p className="text-2xl font-black text-primary">{summary.evidenceCoveragePercentage}%</p>
            <span className="text-[11px] text-primary/80 font-medium block">Resume claims verified</span>
          </div>
        </div>
      )}

      {activeTab === 'matrix' ? (
        /* Evidence Matrix View */
        <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 space-y-5">
          {/* Controls: Search + Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, categories, evidence..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'ALL', label: `All (${skills.length})` },
                { id: 'VERIFIED', label: `Verified (${summary?.verifiedCount || 0})` },
                { id: 'PARTIALLY_VERIFIED', label: `Partial (${summary?.partiallyVerifiedCount || 0})` },
                { id: 'UNVERIFIED', label: `Pending (${summary?.unverifiedCount || 0})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === f.id ? 'bg-white text-primary shadow-subtle' : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Evidence Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-surface-border bg-white hover:border-primary/40 hover:shadow-subtle transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Skill Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-content-secondary uppercase">
                          {item.category || 'Core Technology'}
                        </span>
                        {getConfidenceBadge(item.confidence)}
                      </div>
                      <h3 className="text-base font-black text-content-primary">{item.skill}</h3>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  {/* Why Verified Explanation */}
                  <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs leading-relaxed text-content-secondary">
                    {item.reason}
                  </div>

                  {/* Sources Connected Chips */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[11px] font-bold text-content-muted">Sources:</span>
                    {item.sources.map((src, sidx) => (
                      <span
                        key={sidx}
                        className="px-2 py-0.5 bg-slate-100 text-content-primary font-mono text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        {src === 'RESUME' && <FileText className="w-3 h-3 text-primary" />}
                        {src === 'GITHUB' && <FolderGit2 className="w-3 h-3 text-emerald-600" />}
                        {src}
                      </span>
                    ))}
                    {item.repositories?.length > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        ({item.repositories.length} {item.repositories.length === 1 ? 'repo' : 'repos'})
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                  <span className="text-[10px] text-content-muted font-medium">
                    Evidence Confidence: {item.confidenceScore}%
                  </span>
                  <button
                    onClick={() => setSelectedSkillModal(item)}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-surface-border text-xs text-content-muted space-y-2">
              <HelpCircle className="w-8 h-8 text-content-muted mx-auto" />
              <p className="font-semibold text-content-primary">No skills match the current filter.</p>
              <p>Try switching to "All" or connecting additional evidence sources.</p>
            </div>
          )}
        </div>
      ) : (
        /* Actionable Skill Gaps View */
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
            <h4 className="font-extrabold uppercase text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Closing Detected Verification Gaps
            </h4>
            <p className="leading-relaxed">
              The following skills are claimed on your resume but lack observable public repository proofs. You can verify them by pushing projects with dependencies or linking existing code.
            </p>
          </div>

          <div className="space-y-3">
            {skills
              .filter((s) => s.status === 'UNVERIFIED' || s.status === 'NOT_FOUND')
              .map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-content-primary">{gap.skill}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-content-secondary">
                          {gap.category}
                        </span>
                      </div>
                      <p className="text-xs text-content-secondary mt-1">{gap.reason}</p>
                    </div>

                    <button
                      onClick={() => setSelectedSkillModal(gap)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-content-primary font-extrabold text-xs rounded-xl shrink-0 transition-all"
                    >
                      Audit Proof
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-content-secondary">
                    <span className="flex items-center gap-1.5 text-primary font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended Action: Push a repository containing {gap.skill} configuration or dependency files.
                    </span>
                    <Link to="/github" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                      GitHub Sync <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Interactive Modal */}
      {selectedSkillModal && (
        <SkillEvidenceModal
          skill={selectedSkillModal}
          onClose={() => setSelectedSkillModal(null)}
        />
      )}
    </div>
  );
};
