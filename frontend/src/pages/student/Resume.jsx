import React, { useState, useEffect } from 'react';
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
  FileCheck2
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview'); // overview, skills, projects, experience, claims

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
          {/* Metadata Bar */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-content-primary">{analysis.originalFileName}</p>
                <p className="text-[11px] text-content-secondary">
                  Processed on {new Date(analysis.createdAt || Date.now()).toLocaleDateString()} via {analysis.extractionMetadata?.model || 'Gemini 3.8 Flash'} ({analysis.extractionMetadata?.processingTimeMs || 0} ms)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">
                {analysis.skills?.length || 0} Skills Claimed
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">
                {analysis.projects?.length || 0} Projects
              </div>
              <div className="px-3 py-1 bg-brand-50 border border-brand-200 rounded-lg text-primary font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Claims Unverified</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-surface-border gap-2 text-xs font-bold">
            {[
              { id: 'overview', label: 'Candidate Overview', icon: GraduationCap },
              { id: 'skills', label: `Skills (${analysis.skills?.length || 0})`, icon: Code2 },
              { id: 'projects', label: `Projects (${analysis.projects?.length || 0})`, icon: FolderGit2 },
              { id: 'experience', label: `Experience (${(analysis.experience?.length || 0) + (analysis.internships?.length || 0)})`, icon: Briefcase },
              { id: 'claims', label: `Claims Matrix (${analysis.claims?.length || 0})`, icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors ${
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

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Identity & Contact */}
              <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
                <h3 className="text-sm font-extrabold text-content-primary flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Candidate Identity
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-content-muted block text-[11px]">Full Name</span>
                    <span className="font-bold text-content-primary">{analysis.candidate?.name || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-content-muted block text-[11px]">Email</span>
                    <span className="font-medium text-content-primary">{analysis.candidate?.email || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-content-muted block text-[11px]">Phone</span>
                    <span className="font-medium text-content-primary">{analysis.candidate?.phone || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-content-muted block text-[11px]">Location</span>
                    <span className="font-medium text-content-primary">{analysis.candidate?.location || 'Not specified'}</span>
                  </div>
                </div>

                {analysis.codingProfiles && analysis.codingProfiles.length > 0 && (
                  <div className="pt-3 border-t border-surface-border">
                    <span className="text-[11px] font-bold text-content-secondary block mb-2">Profiles Detected</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.codingProfiles.map((cp, idx) => (
                        <div key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span className="font-bold text-content-primary">{cp.platform}:</span>
                          <span className="text-content-secondary">{cp.username || cp.url || 'Found'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Education & Summary */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
                {analysis.summary && (
                  <div>
                    <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-1.5">
                      Professional Summary
                    </h4>
                    <p className="text-xs text-content-primary leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {analysis.summary}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">
                    Education Extracted
                  </h4>
                  {analysis.education && analysis.education.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.education.map((edu, idx) => (
                        <div key={idx} className="p-3.5 border border-surface-border rounded-xl bg-white flex items-start justify-between">
                          <div>
                            <p className="text-xs font-bold text-content-primary">{edu.degree || 'Degree'}</p>
                            <p className="text-xs text-content-secondary">{edu.institution}</p>
                            {edu.field && <p className="text-[11px] text-content-muted">Major: {edu.field}</p>}
                          </div>
                          <div className="text-right text-xs">
                            <span className="text-[11px] text-content-muted block">
                              {edu.startYear ? `${edu.startYear} - ${edu.endYear || 'Present'}` : ''}
                            </span>
                            {edu.cgpa && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[11px]">
                                CGPA: {edu.cgpa}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-content-muted">No explicit education details found.</p>
                  )}
                </div>

                {/* Certifications & Achievements */}
                {((analysis.certifications && analysis.certifications.length > 0) || (analysis.achievements && analysis.achievements.length > 0)) && (
                  <div className="pt-4 border-t border-surface-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        Certifications ({analysis.certifications?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {analysis.certifications?.map((c, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-lg text-xs">
                            <p className="font-bold text-content-primary">{c.name}</p>
                            <p className="text-[11px] text-content-muted">{c.issuer || 'Issuer'} • {c.date || 'Recent'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Achievements ({analysis.achievements?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {analysis.achievements?.map((a, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-lg text-xs">
                            <p className="font-bold text-content-primary">{a.title}</p>
                            <p className="text-[11px] text-content-secondary">{a.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS DETECTED */}
          {activeTab === 'skills' && (
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-content-primary">Technical Skills Claimed on Resume</h3>
                  <p className="text-xs text-content-secondary mt-0.5">
                    Categorized and tagged with resume source quotes. All skills are marked as <strong>UNVERIFIED</strong> claims.
                  </p>
                </div>
                <span className="px-3 py-1 bg-brand-50 text-primary border border-brand-200 text-xs font-extrabold rounded-xl">
                  {analysis.skills?.length || 0} Total Skills
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {analysis.skills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-surface-border bg-slate-50/50 hover:bg-white hover:border-primary/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-content-primary">{skill.name}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(skill.category)}`}>
                        {skill.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-content-muted pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Status: <strong className="text-amber-700">Claimed</strong>
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        Conf: {skill.confidence}
                      </span>
                    </div>

                    {skill.evidenceText && (
                      <p className="text-[10px] text-content-secondary bg-white p-2 rounded border border-slate-200 line-clamp-2 italic">
                        "{skill.evidenceText}"
                      </p>
                    )}
                  </div>
                ))}
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
                      <th className="p-3">Claim</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Source Section</th>
                      <th className="p-3">Source Quote</th>
                      <th className="p-3">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {analysis.claims?.map((claim, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-bold text-content-primary">{claim.claim}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                            {claim.claimType}
                          </span>
                        </td>
                        <td className="p-3 text-content-secondary text-[11px]">{claim.sourceSection}</td>
                        <td className="p-3 text-content-muted text-[11px] max-w-xs truncate italic">
                          "{claim.sourceText}"
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending Verification
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
