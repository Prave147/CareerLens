import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
  FolderGit2,
  GitFork,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  GitCommit,
  Star,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [antiGaming, setAntiGaming] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await studentService.getProjects();
        if (res.success) {
          setProjects(res.projects);
          setAntiGaming(res.antiGamingSummary);
        }
      } catch (err) {
        console.warn('Projects fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getOwnershipBadge = (status, isFork) => {
    if (status === 'ORIGINAL_OWNER' || (!isFork && status !== 'FORK')) {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Original Owner
        </span>
      );
    }
    if (status === 'CONTRIBUTOR') {
      return (
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-bold flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5" />
          Active Contributor
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5" />
        Fork Detected (Needs Review)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Project Evidence & Code Ownership</h1>
          <p className="text-xs text-content-secondary mt-1">
            Reconciles GitHub repositories, commit velocity, original contributions, and fork integrity.
          </p>
        </div>
      </div>

      {/* Anti-Gaming & Evidence Integrity Banner */}
      {antiGaming && (
        <div className="p-4 bg-white border border-surface-border rounded-xl shadow-card flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-status-success border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-content-primary">Evidence Integrity Status:</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[11px]">
                {antiGaming.status}
              </span>
            </div>
            <p className="text-content-secondary mt-1">{antiGaming.explanation}</p>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white border border-surface-border rounded-2xl p-6 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-content-primary text-sm">{project.displayName || project.name}</h3>
                    <p className="text-[11px] text-content-muted font-mono">{project.name}</p>
                  </div>
                </div>
                {getOwnershipBadge(project.ownershipStatus, project.isFork)}
              </div>

              {/* Description */}
              <p className="text-xs text-content-secondary leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Commit & Architecture Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-surface-bg border border-surface-border rounded-xl text-xs mb-4">
                <div className="text-center">
                  <span className="text-[10px] text-content-muted block font-semibold">Commits</span>
                  <span className="font-extrabold text-content-primary text-sm flex items-center justify-center gap-1">
                    <GitCommit className="w-3.5 h-3.5 text-primary" />
                    {project.commitsCount}
                  </span>
                </div>
                <div className="text-center border-x border-surface-border">
                  <span className="text-[10px] text-content-muted block font-semibold">Live Demo</span>
                  <span className="font-bold text-content-primary text-xs">
                    {project.hasLiveDeployment ? '✓ Verified' : '—'}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-content-muted block font-semibold">Integrity</span>
                  <span className="font-bold text-content-primary text-xs">
                    {project.evidenceIntegrity || 'High'}
                  </span>
                </div>
              </div>

              {/* Integrity Reason Notice */}
              <div className={`p-2.5 rounded-lg border text-xs mb-4 ${
                project.isFork 
                  ? 'bg-amber-50/70 border-amber-200 text-amber-800' 
                  : 'bg-slate-50 border-slate-200 text-content-secondary'
              }`}>
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="text-[11px] leading-snug">
                    <strong className="font-semibold">Integrity Assessment: </strong>
                    {project.integrityReason || 'Verified multi-commit history.'}
                  </span>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies?.map((tech, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View Repository <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Live Application <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
