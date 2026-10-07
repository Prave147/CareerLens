import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Code2,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Award,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Terminal,
  Database,
  Globe,
  HelpCircle,
  FileCheck2,
  ChevronRight,
  GitBranch,
  ArrowUpRight
} from 'lucide-react';

import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { SkillEvidenceModal } from '../../components/SkillEvidenceModal';
import { findFusedSkill, isSkillMatch } from '../../utils/skillUtils';

const ANALYSIS_STAGES = [
  'Reading resume',
  'Understanding document',
  'Extracting education',
  'Extracting skills',
  'Extracting projects',
  'Identifying experience',
  'Building career claims',
  'Saving evidence',
  'Analysis complete'
];

export const Resume = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('skills'); // Default to skills to immediately view claims & evidence
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);
  const [skillFilter, setSkillFilter] = useState('ALL'); // ALL, VERIFIED, UNVERIFIED
  const { skills: fusedSkills, summary: evidenceSummary, refresh: refreshEvidence } = useSkillEvidence();

  useEffect(() => {
    loadLatestAnalysis();
  }, []);

  const loadLatestAnalysis = async () => {
    try {
      const res = await studentService.getLatestResumeAnalysis();
      if (res && res.success && res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.warn('Could not load latest resume analysis:', err.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
        setError('Only PDF resume files are supported for AI document extraction.');
        setFile(null);
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError('File exceeds 10MB limit.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (!dropped.name.toLowerCase().endsWith('.pdf') && dropped.type !== 'application/pdf') {
        setError('Only PDF resume files are supported for AI document extraction.');
        return;
      }
      setError('');
      setFile(dropped);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccessMessage('');
    setCurrentStageIndex(0);

    // Dynamic stage progression animation
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < ANALYSIS_STAGES.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const res = await studentService.uploadResume(formData);
      clearInterval(stageInterval);
      setCurrentStageIndex(ANALYSIS_STAGES.length - 1);

      if (res && res.success) {
        setAnalysis(res.analysis);
        setSuccessMessage(
          `Resume intelligence extracted successfully! Identified ${res.summary?.skillsFound || 0} skills, ${res.summary?.projectsFound || 0} projects, and generated ${res.summary?.claimsFound || 0} unverified career claims.`
        );
      }
    } catch (err) {
      clearInterval(stageInterval);
      setError(err.message || 'Resume analysis failed. Please verify the PDF format and try again.');
    } finally {
      setUploading(false);
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'PROGRAMMING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FRAMEWORK':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DATABASE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AI_ML':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CLOUD':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'DEVOPS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
            Phase 1 • Claim Source
          </span>
          <span className="text-xs text-content-secondary">
            Powered by Google Gemini Document Intelligence
          </span>
        </div>
        <h1 className="text-2xl font-black text-content-primary">Resume Intelligence Engine</h1>
        <p className="text-xs text-content-secondary mt-1">
          Upload your technical resume to extract structured skills, projects, and educational facts. 
          Extracted items are registered as unverified claims and will be benchmarked against your live code proof.
        </p>
      </div>

      {/* Principle Reminder Banner */}
      <div className="p-3.5 bg-brand-50/70 border border-brand-200 rounded-xl flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-primary">
            CareerLens Core Verification Principle: CLAIM → PROOF → VERIFICATION
          </p>
          <p className="text-[11px] text-content-secondary mt-0.5">
            Your resume is treated as a <strong>Claim Source</strong>. Skills extracted here are initially marked <strong>UNVERIFIED</strong>. They will only transition to <strong>VERIFIED</strong> once supported by public GitHub repositories, algorithmic problem solving, or architectural proof.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-status-danger text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`bg-white p-8 rounded-2xl border-2 border-dashed transition-all text-center shadow-card ${
          uploading ? 'border-primary bg-brand-50/30' : 'border-surface-border hover:border-primary/50'
        }`}
      >
        <div className="max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-primary flex items-center justify-center mx-auto shadow-sm">
            {uploading ? (
              <Clock className="w-7 h-7 animate-spin text-primary" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <h3 className="text-base font-extrabold text-content-primary">
              {file ? file.name : 'Upload your Technical Resume (PDF)'}
            </h3>
            <p className="text-xs text-content-secondary mt-1">
              Drag and drop your PDF here, or click to browse. Max size 10 MB.
            </p>
          </div>

          {/* 9-Stage Progress Indicator during Upload */}
          {uploading && (
            <div className="p-4 bg-white border border-brand-200 rounded-xl space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-content-primary">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  Stage {currentStageIndex + 1} of {ANALYSIS_STAGES.length}: {ANALYSIS_STAGES[currentStageIndex]}
                </span>
                <span className="text-primary font-mono">
                  {Math.round(((currentStageIndex + 1) / ANALYSIS_STAGES.length) * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                />
              </div>

              {/* Stage dots */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {ANALYSIS_STAGES.map((stg, idx) => (
                  <div
                    key={stg}
                    className={`text-[10px] truncate px-2 py-1 rounded font-medium ${
                      idx < currentStageIndex
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : idx === currentStageIndex
                        ? 'bg-brand-50 text-primary font-bold animate-pulse'
                        : 'text-slate-400 bg-slate-50'
                    }`}
                  >
                    {idx + 1}. {stg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!uploading && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="cursor-pointer px-4 py-2 bg-white border border-surface-border hover:bg-slate-50 text-content-primary font-bold text-xs rounded-xl shadow-sm transition-colors">
                <span>Browse PDF</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <button
                  type="button"
                  onClick={handleUpload}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                >
                  Analyze with Gemini
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Extracted Intelligence Display */}
      {analysis && (
        <div className="space-y-6 pt-4">
          {/* Evidence Fusion Verification Summary Banner */}
          <div className="p-5 bg-white rounded-2xl border border-surface-border shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-primary border border-brand-200 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-content-primary">{analysis.originalFileName}</p>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      PDF Extracted
                    </span>
                  </div>
                  <p className="text-[11px] text-content-secondary mt-0.5">
                    Analyzed via {analysis.extractionMetadata?.model || 'Gemini'} • Global evidence fusion active
                  </p>
                </div>
              </div>

              {/* Source badges */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold flex items-center gap-1 text-[11px]">
                  <FileText className="w-3.5 h-3.5" />
                  Resume Analyzed
                </span>
                {evidenceSummary?.sourcesConnected?.github ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    GitHub Connected (@{evidenceSummary.githubUsername})
                  </span>
                ) : (
                  <Link
                    to="/github"
                    className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Connect GitHub for Proof
                  </Link>
                )}
              </div>
            </div>

            {/* Verification Breakdown Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-surface-border">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-content-secondary uppercase block">Resume Claims</span>
                <span className="text-lg font-black text-content-primary">{analysis.skills?.length || 0}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Verified by Proof</span>
                <span className="text-lg font-black text-emerald-800">
                  {analysis.skills?.filter((s) => {
                    const f = findFusedSkill(fusedSkills, s.name);
                    return f?.status === 'VERIFIED' || f?.status === 'STRONGLY_VERIFIED';
                  }).length || 0}
                </span>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Partially Verified</span>
                <span className="text-lg font-black text-amber-800">
                  {analysis.skills?.filter((s) => {
                    const f = findFusedSkill(fusedSkills, s.name);
                    return f?.status === 'PARTIALLY_VERIFIED';
                  }).length || 0}
                </span>
              </div>
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/80">
                <span className="text-[10px] font-bold text-rose-700 uppercase block">Awaiting Proof</span>
                <span className="text-lg font-black text-rose-800">
                  {analysis.skills?.filter((s) => {
                    const f = findFusedSkill(fusedSkills, s.name);
                    return !f || f.status === 'UNVERIFIED' || f.status === 'NOT_FOUND';
                  }).length || 0}
                </span>
              </div>
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-primary uppercase block">Evidence Coverage</span>
                <span className="text-lg font-black text-primary">
                  {analysis.skills?.length > 0
                    ? `${Math.round(
                        ((analysis.skills?.filter((s) => {
                          const f = findFusedSkill(fusedSkills, s.name);
                          return f?.status === 'VERIFIED' || f?.status === 'STRONGLY_VERIFIED';
                        }).length || 0) /
                          analysis.skills.length) *
                          100
                      )}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-surface-border gap-2 text-xs font-bold overflow-x-auto">
            {[
              { id: 'skills', label: `Skill Claims & Evidence (${analysis.skills?.length || 0})`, icon: Code2 },
              { id: 'claims', label: `Claims Matrix (${analysis.claims?.length || 0})`, icon: Layers },
              { id: 'projects', label: `Projects (${analysis.projects?.length || 0})`, icon: FolderGit2 },
              { id: 'experience', label: `Experience (${(analysis.experience?.length || 0) + (analysis.internships?.length || 0)})`, icon: Briefcase },
              { id: 'overview', label: 'Candidate Overview', icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-content-secondary hover:text-content-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SKILLS CLAIMED & EVIDENCE BREAKDOWN */}
          {activeTab === 'skills' && (
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-content-primary">Resume Skill Claims vs External Evidence</h3>
                  <p className="text-xs text-content-secondary mt-0.5">
                    Every resume claim is cross-referenced with your connected GitHub repositories.
                  </p>
                </div>
                
                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSkillFilter('ALL')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      skillFilter === 'ALL' ? 'bg-white text-content-primary shadow-sm' : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    All ({analysis.skills?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillFilter('VERIFIED')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      skillFilter === 'VERIFIED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillFilter('UNVERIFIED')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      skillFilter === 'UNVERIFIED' ? 'bg-rose-600 text-white shadow-sm' : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    Unverified
                  </button>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.skills
                  ?.filter((skill) => {
                    const fused = findFusedSkill(fusedSkills, skill.name);
                    const isVerified = fused?.status === 'VERIFIED' || fused?.status === 'STRONGLY_VERIFIED';
                    if (skillFilter === 'VERIFIED') return isVerified;
                    if (skillFilter === 'UNVERIFIED') return !isVerified;
                    return true;
                  })
                  .map((skill, idx) => {
                    const fused = findFusedSkill(fusedSkills, skill.name);
                    const isVerified = fused?.status === 'VERIFIED' || fused?.status === 'STRONGLY_VERIFIED';
                    const isPartial = fused?.status === 'PARTIALLY_VERIFIED';
                    const hasGithub = fused?.repositories?.length > 0 || fused?.sources?.includes('GITHUB');
                    const hasLeetCode = fused?.isLeetCodeVerified || fused?.sources?.includes('LEETCODE');
                    const repoCount = fused?.repositories?.length || 0;

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                          isVerified
                            ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 shadow-subtle'
                            : isPartial
                            ? 'border-amber-200 bg-amber-50/20 hover:border-amber-400'
                            : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-primary/40'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Top: Skill & Category */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-black text-content-primary tracking-tight">{skill.name}</span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(skill.category)}`}>
                              {skill.category}
                            </span>
                          </div>

                          {/* Row 1: Resume Claim */}
                          <div className="p-2 bg-white/90 rounded-lg border border-slate-200/80 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-content-secondary font-bold">Resume Claim:</span>
                              <span className="font-extrabold text-blue-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                Claimed
                              </span>
                            </div>
                            {skill.evidenceText && (
                              <p className="text-[10px] text-content-muted italic line-clamp-2">
                                "{skill.evidenceText}"
                              </p>
                            )}
                          </div>

                          {/* Row 2: External Evidence */}
                          <div className="p-2 bg-white/90 rounded-lg border border-slate-200/80 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-content-secondary font-bold">External Evidence:</span>
                              {isVerified || isPartial ? (
                                <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {hasGithub && hasLeetCode
                                    ? `GitHub + LeetCode`
                                    : hasLeetCode
                                    ? `LeetCode (${fused?.evidenceCount || 'DSA'} solved)`
                                    : `GitHub (${repoCount} ${repoCount === 1 ? 'repo' : 'repos'})`}
                                </span>
                              ) : (
                                <span className="font-semibold text-slate-500 text-[10px]">
                                  Awaiting external proof
                                </span>
                              )}
                            </div>
                            {isVerified && hasGithub && fused?.repositories?.[0] && (
                              <p className="text-[10px] text-content-secondary truncate">
                                Repo: <span className="font-mono font-bold text-slate-700">{fused.repositories[0].name}</span>
                              </p>
                            )}
                            {isVerified && hasLeetCode && !hasGithub && (
                              <p className="text-[10px] text-emerald-700 truncate">
                                Verified algorithmic problem solving metrics
                              </p>
                            )}
                            {!isVerified && !isPartial && (
                              <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60 leading-tight mt-1">
                                CareerLens could not verify this claim from currently connected evidence. This does not mean you do not know {skill.name}.
                              </p>
                            )}
                          </div>

                          {/* Verification State & Confidence */}
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <div>
                              {isVerified ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-extrabold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  VERIFIED
                                </span>
                              ) : isPartial ? (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-extrabold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  PARTIALLY VERIFIED
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1">
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                  UNVERIFIED
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-content-muted">
                              Confidence: <span className={isVerified ? 'text-emerald-700 font-extrabold' : 'text-slate-600'}>{fused?.confidence || skill.confidence || 'LOW'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Action */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-content-muted text-[10px]">
                            {isVerified
                              ? hasLeetCode && hasGithub
                                ? `${repoCount} Repo(s) + LeetCode`
                                : hasLeetCode
                                ? `LeetCode Verified`
                                : `${repoCount} Code Evidence Item(s)`
                              : 'Awaiting External Proof'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSkillModal(
                                fused || {
                                  skill: skill.name,
                                  category: skill.category,
                                  status: 'UNVERIFIED',
                                  confidence: skill.confidence || 'LOW',
                                  isResumeClaim: true,
                                  resumeClaimText: skill.evidenceText,
                                  reason: `CareerLens could not verify this claim from currently connected evidence. This does not mean the candidate does not know ${skill.name}.`,
                                  repositories: [],
                                }
                              )
                            }
                            className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <span>{isVerified ? 'View Evidence' : 'Inspect Proof'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS DETECTED */}
          {activeTab === 'projects' && (
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-content-primary">Projects Extracted from Resume</h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Extracted architectures, responsibilities, and claimed links.
                </p>
              </div>

              <div className="space-y-4">
                {analysis.projects?.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-surface-border bg-white shadow-subtle space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-content-primary">{proj.name}</h4>
                        {proj.startDate && (
                          <span className="text-[11px] text-content-muted">
                            {proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-content-primary rounded-lg text-[11px] font-bold flex items-center gap-1"
                          >
                            <FolderGit2 className="w-3.5 h-3.5" />
                            <span>Repository</span>
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[11px] font-bold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-content-secondary leading-relaxed">{proj.description}</p>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((tech, tidx) => (
                          <span key={tidx} className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {proj.responsibilities && proj.responsibilities.length > 0 && (
                      <ul className="text-xs text-content-secondary space-y-1 list-disc pl-4">
                        {proj.responsibilities.map((r, ridx) => (
                          <li key={ridx}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & INTERNSHIPS */}
          {activeTab === 'experience' && (
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-content-primary">Work Experience & Internships</h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Professional roles extracted directly from the document.
                </p>
              </div>

              {((analysis.experience && analysis.experience.length > 0) || (analysis.internships && analysis.internships.length > 0)) ? (
                <div className="space-y-4">
                  {analysis.experience?.map((exp, idx) => (
                    <div key={`exp-${idx}`} className="p-4 rounded-xl border border-surface-border bg-slate-50/50 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-content-primary">{exp.role || 'Software Engineer'}</h4>
                          <p className="text-xs font-medium text-primary">{exp.company}</p>
                        </div>
                        <span className="text-[11px] text-content-muted">
                          {exp.startDate ? `${exp.startDate} - ${exp.endDate || 'Present'}` : 'Recent'}
                        </span>
                      </div>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="text-xs text-content-secondary space-y-1 list-disc pl-4 pt-1">
                          {exp.responsibilities.map((r, ridx) => (
                            <li key={ridx}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {analysis.internships?.map((intern, idx) => (
                    <div key={`intern-${idx}`} className="p-4 rounded-xl border border-surface-border bg-slate-50/50 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-content-primary">{intern.role || 'Intern'}</h4>
                          <p className="text-xs font-medium text-primary">{intern.company}</p>
                        </div>
                        <span className="text-[11px] text-content-muted">
                          {intern.startDate ? `${intern.startDate} - ${intern.endDate || 'Present'}` : 'Recent'}
                        </span>
                      </div>
                      {intern.technologies && intern.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {intern.technologies.map((t, tidx) => (
                            <span key={tidx} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-content-muted">No explicit professional work experience detected.</p>
              )}
            </div>
          )}

          {/* TAB 5: CLAIMS MATRIX */}
          {activeTab === 'claims' && (
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-content-primary">Registered Career Claims</h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Each item is an extracted claim awaiting cryptographic or repo commit verification.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-surface-border rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-content-secondary border-b border-surface-border uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="p-3">Claim Statement</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Source Quote</th>
                      <th className="p-3">External Evidence</th>
                      <th className="p-3">Verification State</th>
                      <th className="p-3 text-right">Proof Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {analysis.claims?.map((claim, idx) => {
                      const matchedFused = fusedSkills.find(
                        (f) =>
                          f.skill.toLowerCase() === (claim.claim || '').toLowerCase() ||
                          (claim.claim || '').toLowerCase().includes(f.skill.toLowerCase())
                      );
                      const isVerified = matchedFused?.status === 'VERIFIED' || matchedFused?.status === 'STRONGLY_VERIFIED';
                      const isPartial = matchedFused?.status === 'PARTIALLY_VERIFIED';

                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-content-primary block">{claim.claim}</span>
                            <span className="text-[10px] text-content-muted">{claim.sourceSection}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                              {claim.claimType}
                            </span>
                          </td>
                          <td className="p-3 text-content-muted text-[11px] max-w-xs truncate italic">
                            "{claim.sourceText}"
                          </td>
                          <td className="p-3">
                            {isVerified || isPartial ? (
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                GitHub ({matchedFused?.repositories?.length || 1} repos)
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-400">
                                Awaiting external evidence
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {isVerified ? (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                VERIFIED
                              </span>
                            ) : isPartial ? (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                PARTIALLY VERIFIED
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-slate-400" />
                                UNVERIFIED
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedSkillModal(
                                  matchedFused || {
                                    skill: claim.claim,
                                    category: 'Claim',
                                    status: 'UNVERIFIED',
                                    confidence: 'LOW',
                                    isResumeClaim: true,
                                    resumeClaimText: claim.sourceText,
                                    reason: `CareerLens could not verify "${claim.claim}" from currently connected external sources. Verification remains pending.`,
                                    repositories: [],
                                  }
                                )
                              }
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-primary font-bold text-[11px] rounded-lg inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Skill Proof Modal */}
      {selectedSkillModal && (
        <SkillEvidenceModal
          skill={selectedSkillModal}
          onClose={() => setSelectedSkillModal(null)}
        />
      )}
    </div>
  );
};
