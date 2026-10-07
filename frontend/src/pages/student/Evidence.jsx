import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { SkillEvidenceModal } from '../../components/SkillEvidenceModal';
import {
  Layers,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  X,
  Sparkles,
  PlusCircle,
  Upload,
  Link as LinkIcon,
  FileCheck2,
  Check
} from 'lucide-react';

export const Evidence = () => {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, VERIFIED, UNVERIFIED, PARTIALLY_VERIFIED
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    skill: '',
    proofType: 'CERTIFICATE',
    title: '',
    url: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      const res = await studentService.getEvidenceMatrix();
      if (res.evidenceMatrix) {
        setMatrix(res.evidenceMatrix);
      }
    } catch (err) {
      console.warn('Matrix fetch error, using default matrix:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const handleOpenSubmit = (skillName) => {
    setSubmitForm({
      skill: skillName || (matrix.length > 0 ? matrix[0].skill : 'Docker'),
      proofType: 'GITHUB_REPO',
      title: '',
      url: '',
      description: '',
    });
    setSubmitSuccess('');
    setShowSubmitModal(true);
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await studentService.submitEvidence(submitForm);
      if (res.success) {
        setSubmitSuccess(res.message);
        setTimeout(() => {
          setShowSubmitModal(false);
          fetchMatrix();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredList = matrix.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'VERIFIED') return item.finalStatus === 'VERIFIED' || item.finalStatus === 'STRONGLY_VERIFIED';
    return item.finalStatus === filter;
  });

  const renderBadge = (status) => {
    switch (status) {
      case 'STRONGLY_VERIFIED':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-status-success border border-status-success-border">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-status-warning border border-amber-200">
            <AlertCircle className="w-3 h-3" /> PARTIAL
          </span>
        );
      case 'WEAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3 h-3" /> WEAK PROOF
          </span>
        );
      case 'UNVERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-status-danger border border-red-200">
            <XCircle className="w-3 h-3" /> UNVERIFIED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-content-muted">
            NOT FOUND
          </span>
        );
    }
  };

  const renderLevel = (val) => {
    if (!val || val.level === '—' || val.level === '') return <span className="text-content-muted">—</span>;
    if (val.level === '✓✓✓') return <span className="text-emerald-700 font-extrabold text-sm">✓✓✓</span>;
    if (val.level === '✓✓') return <span className="text-emerald-600 font-bold text-sm">✓✓</span>;
    if (val.level === '✓' || val.level === 'Claimed') return <span className="text-brand-600 font-bold text-sm">✓</span>;
    if (val.level === '✗' || val.level === 'Not Found') return <span className="text-red-500 font-bold text-sm">✗</span>;
    return <span className="text-xs text-content-secondary">{val.level}</span>;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary">Evidence Matrix & Claim Verification</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Deterministic cross-platform reconciliation comparing resume & profile claims against observable code and metrics.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenSubmit()}
            className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Proof for Skill
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-surface-border shadow-subtle text-xs w-fit">
        {['ALL', 'VERIFIED', 'PARTIALLY_VERIFIED', 'UNVERIFIED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filter === tab
                ? 'bg-primary text-white shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Evidence Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                <th className="py-3.5 px-4">Skill</th>
                <th className="py-3.5 px-3 text-center">Resume</th>
                <th className="py-3.5 px-3 text-center">GitHub</th>
                <th className="py-3.5 px-3 text-center">LeetCode</th>
                <th className="py-3.5 px-3 text-center">GFG</th>
                <th className="py-3.5 px-3 text-center">LinkedIn</th>
                <th className="py-3.5 px-3 text-center">Portfolio</th>
                <th className="py-3.5 px-4 text-center">Final Status</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredList.map((item) => (
                <tr
                  key={item.skill}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td 
                    onClick={() => setSelectedSkill(item)}
                    className="py-3.5 px-4 font-bold text-content-primary cursor-pointer hover:underline"
                  >
                    {item.skill}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {renderLevel(item.evidenceSources?.resume)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {renderLevel(item.evidenceSources?.github)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {renderLevel(item.evidenceSources?.leetcode)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {renderLevel(item.evidenceSources?.gfg)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {renderLevel(item.evidenceSources?.linkedIn)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {renderLevel(item.evidenceSources?.portfolio)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {renderBadge(item.finalStatus)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-content-primary font-mono text-[11px]">
                      {item.confidence} ({item.confidencePercentage}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedSkill(item)}
                        className="text-primary hover:underline font-semibold text-xs inline-flex items-center gap-0.5"
                      >
                        Inspect
                      </button>
                      {(item.finalStatus === 'UNVERIFIED' || item.finalStatus === 'WEAK') && (
                        <button
                          onClick={() => handleOpenSubmit(item.skill)}
                          className="px-2 py-1 bg-brand-50 text-primary hover:bg-brand-100 border border-brand-200 rounded font-bold text-[10px]"
                        >
                          + Add Proof
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBMIT PROOF MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border shadow-elevated max-w-lg w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-base font-extrabold text-content-primary">Submit Evidence for Claim</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-content-secondary hover:text-content-primary hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProof} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-content-primary mb-1">Target Skill</label>
                <input
                  type="text"
                  required
                  value={submitForm.skill}
                  onChange={(e) => setSubmitForm({ ...submitForm, skill: e.target.value })}
                  placeholder="e.g. Docker, AWS, PostgreSQL"
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-content-primary mb-1">Evidence Type</label>
                <select
                  value={submitForm.proofType}
                  onChange={(e) => setSubmitForm({ ...submitForm, proofType: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="GITHUB_REPO">GitHub Repository with code commits</option>
                  <option value="DEPLOYED_APP">Live Deployed Application URL</option>
                  <option value="CERTIFICATE">Verified Certificate / Specialization Credential</option>
                  <option value="DOCUMENTATION">Project Report / Architecture Documentation</option>
                  <option value="OFFLINE_EXPLANATION">College Capstone / Offline Team Project</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-content-primary mb-1">Proof Title / Identifier</label>
                <input
                  type="text"
                  required
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  placeholder="e.g. MediRoute Docker Multi-Stage Configuration"
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-content-primary mb-1">Evidence URL (Optional)</label>
                <input
                  type="url"
                  value={submitForm.url}
                  onChange={(e) => setSubmitForm({ ...submitForm, url: e.target.value })}
                  placeholder="https://github.com/... or https://coursera.org/verify/..."
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-content-primary mb-1">Verification Details & Notes</label>
                <textarea
                  rows={3}
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  placeholder="Explain how this proof corroborates your claim..."
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-content-primary font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-60"
                >
                  {submitting ? 'Verifying Proof...' : 'Submit Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedSkill && (
        <SkillEvidenceModal
          skill={{
            skill: selectedSkill.skill,
            category: selectedSkill.category,
            status: selectedSkill.finalStatus,
            confidence: selectedSkill.confidence,
            confidenceScore: selectedSkill.confidencePercentage,
            reason: selectedSkill.whyVerifiedExplanation,
            repositories: selectedSkill.repositories || [],
            isResumeClaim: selectedSkill.claims?.resume,
            evidenceChain: selectedSkill.evidenceChain,
          }}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
};
