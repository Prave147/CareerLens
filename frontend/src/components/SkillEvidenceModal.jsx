import React from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  FolderGit2,
  GitFork,
  Star,
  ExternalLink,
  Code2,
  FileText,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
  Cpu
} from 'lucide-react';

export const SkillEvidenceModal = ({ skill, onClose }) => {
  if (!skill) return null;

  const isVerified = skill.status === 'VERIFIED' || skill.status === 'STRONGLY_VERIFIED';
  const isPartial = skill.status === 'PARTIALLY_VERIFIED';
  const isUnverified = skill.status === 'UNVERIFIED' || skill.status === 'NOT_FOUND';

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 shadow-subtle">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          VERIFIED
        </span>
      );
    }
    if (isPartial) {
      return (
        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 shadow-subtle">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          PARTIALLY VERIFIED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 shadow-subtle">
        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
        UNVERIFIED (PENDING)
      </span>
    );
  };

  const getConfidenceBadge = () => {
    switch (skill.confidence) {
      case 'HIGH':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">HIGH CONFIDENCE</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">MEDIUM CONFIDENCE</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold text-[10px]">LOW CONFIDENCE</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl border border-surface-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-surface-border flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-primary/10 text-primary uppercase">
                {skill.category || 'Core Technology'}
              </span>
              {getConfidenceBadge()}
            </div>
            <h2 className="text-2xl font-black text-content-primary flex items-center gap-2">
              <span>{skill.skill}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-content-muted hover:text-content-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Why Verified Explanation Box */}
          <div className={`p-4 rounded-2xl border ${
            isVerified ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' :
            isPartial ? 'bg-amber-50/50 border-amber-200 text-amber-950' :
            'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <h4 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-1 text-content-primary">
              <Sparkles className="w-4 h-4 text-primary" />
              Evidence Verification Analysis
            </h4>
            <p className="text-xs leading-relaxed font-medium">
              {skill.reason}
            </p>
          </div>

          {/* Sources Summary Grid */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-secondary mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Connected Proof Sources
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Resume Claim Source */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                skill.isResumeClaim
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 ${skill.isResumeClaim ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-content-primary">Resume Claim</span>
                    {skill.isResumeClaim && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">Claimed</span>
                    )}
                  </div>
                  <p className="text-[11px] text-content-secondary mt-0.5">
                    {skill.isResumeClaim
                      ? 'Extracted directly from candidate technical resume.'
                      : 'Not explicitly detected in uploaded resume.'}
                  </p>
                </div>
              </div>

              {/* GitHub Evidence Source */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                skill.repositories && skill.repositories.length > 0
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 ${
                  skill.repositories && skill.repositories.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                }`}>
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-content-primary">GitHub Codebase</span>
                    {skill.repositories && skill.repositories.length > 0 ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                        {skill.repositories.length} {skill.repositories.length === 1 ? 'Repo' : 'Repos'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded">Pending</span>
                    )}
                  </div>
                  <p className="text-[11px] text-content-secondary mt-0.5">
                    {skill.repositories && skill.repositories.length > 0
                      ? `Observable in ${skill.repositories.length} public GitHub repository codebases.`
                      : 'No matching repository proof found.'}
                  </p>
                </div>
              </div>

              {/* LeetCode Evidence Source */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                skill.isLeetCodeVerified || skill.sources?.includes('LEETCODE')
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 ${
                  skill.isLeetCodeVerified || skill.sources?.includes('LEETCODE') ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-400'
                }`}>
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-content-primary">LeetCode Proof</span>
                    {(skill.isLeetCodeVerified || skill.sources?.includes('LEETCODE')) ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 rounded">Verified</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded">Pending</span>
                    )}
                  </div>
                  <p className="text-[11px] text-content-secondary mt-0.5">
                    {(skill.isLeetCodeVerified || skill.sources?.includes('LEETCODE'))
                      ? 'Verified via solved problems & algorithmic stats on LeetCode.'
                      : 'No algorithmic volume proof linked for this skill.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Repository Evidence List */}
          {skill.repositories && skill.repositories.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-secondary flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                  Supporting GitHub Repositories ({skill.repositories.length})
                </h4>
              </div>

              <div className="space-y-2.5">
                {skill.repositories.map((repo, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-surface-border bg-slate-50/50 hover:bg-slate-50 hover:border-primary/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-extrabold text-content-primary hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3 h-3 text-content-muted" />
                        </a>
                        {repo.description && (
                          <p className="text-[11px] text-content-secondary line-clamp-1 mt-0.5">
                            {repo.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {repo.ownership === 'OWNED' && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-extrabold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Original Owner
                          </span>
                        )}
                        {(repo.ownership === 'FORKED' || repo.isFork) && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-extrabold flex items-center gap-1">
                            <GitFork className="w-3 h-3 text-amber-600" />
                            Forked Repo
                          </span>
                        )}
                        {repo.stars > 0 && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {repo.stars}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-content-secondary">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {repo.dependencyFiles?.length > 0 ? (
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-primary">
                            Dependency: {repo.dependencyFiles.join(', ')}
                          </span>
                        ) : (
                          <span>Language: {repo.primaryLanguage || 'Codebase'}</span>
                        )}
                      </div>
                      <span className="font-semibold text-slate-500">
                        Strength: {repo.evidenceStrength}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            isUnverified && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-surface-border text-xs text-content-secondary space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-content-primary">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>How to verify this skill?</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  CareerLens did not find public repository proof for this claim. You can verify it by:
                </p>
                <ul className="text-[11px] space-y-1 list-disc list-inside text-content-muted pl-1">
                  <li>Pushing an original GitHub project that includes dependencies in <code>package.json</code>, <code>requirements.txt</code>, or <code>Dockerfile</code>.</li>
                  <li>Ensuring your connected GitHub profile handle matches your active repositories.</li>
                  <li>Clicking <strong>"Re-Analyze GitHub"</strong> on the GitHub Intelligence page.</li>
                </ul>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-surface-border bg-slate-50/70 flex items-center justify-between rounded-b-3xl">
          <span className="text-[11px] text-content-muted font-medium">
            CareerLens Deterministic Evidence Verification Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-surface-border hover:bg-slate-100 text-content-primary text-xs font-extrabold rounded-xl shadow-subtle transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
