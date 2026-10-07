import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import {
  User,
  GitBranch,
  Code2,
  Award,
  Globe,
  Briefcase,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  FolderGit2,
  FileText,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { summary: evidenceSummary, skills: fusedSkills } = useSkillEvidence();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await studentService.getProfile();
        if (res.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.warn('Profile fetch error, using fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformChange = (platform, value) => {
    setProfile((prev) => ({
      ...prev,
      platformHandles: {
        ...prev.platformHandles,
        [platform]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    try {
      await studentService.updateProfile(profile);
      setSuccessMessage('Profile saved successfully! MongoDB record synchronized.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-12 text-center text-xs text-content-secondary">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading student profile data...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary">Student Profile & Evidence Sources</h1>
          <p className="text-xs text-content-secondary mt-0.5">Manage personal details, target career role, and connected platform handles.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-status-success-border text-status-success text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Evidence & Connected Sources Overview */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
                Proof & Employability Profile
              </span>
              <span className="text-xs text-content-secondary font-medium">
                Multi-Source Evidence Coverage
              </span>
            </div>
            <h3 className="text-base font-extrabold text-content-primary">
              Employability Evidence Status
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Summary of real-world evidence backing your candidate claims across GitHub and technical resume.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/skills"
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition-all"
            >
              <span>Inspect Skill Proofs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Source Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* GitHub Source */}
          <div className="p-4 rounded-xl border border-surface-border bg-slate-50/50 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-emerald-600" />
                GitHub
              </span>
              {evidenceSummary?.sourcesConnected?.github ? (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded">
                  CONNECTED ✓
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[10px] rounded">
                  NOT CONNECTED
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-content-primary">
                {evidenceSummary?.githubUsername ? `@${evidenceSummary.githubUsername}` : 'Pending sync'}
              </p>
            </div>
            <Link to="/github" className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5">
              GitHub Intelligence <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Resume Source */}
          <div className="p-4 rounded-xl border border-surface-border bg-slate-50/50 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                Resume
              </span>
              {evidenceSummary?.sourcesConnected?.resume ? (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded">
                  ANALYZED ✓
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[10px] rounded">
                  NOT UPLOADED
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-content-primary">
                {profile.resume?.fileName || 'Technical PDF Resume'}
              </p>
            </div>
            <Link to="/resume" className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5">
              Resume Claims <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Verified Skills */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Verified Skills</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-800">{evidenceSummary?.verifiedCount || 0}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Backed by codebase</p>
            </div>
            <span className="text-[10px] text-emerald-700 font-mono">
              of {evidenceSummary?.totalSkills || 0} tracked skills
            </span>
          </div>

          {/* Evidence Coverage */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800">Evidence Coverage</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-primary">{evidenceSummary?.evidenceCoveragePercentage || 0}%</p>
              <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${evidenceSummary?.evidenceCoveragePercentage || 0}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-blue-600 font-medium">
              {evidenceSummary?.unverifiedCount || 0} claims pending proof
            </span>
          </div>
        </div>

        {/* Evidence-backed Skills List */}
        {fusedSkills && fusedSkills.length > 0 && (
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-bold text-content-secondary block mb-2">
              Verified & Claimed Skills:
            </span>
            <div className="flex flex-wrap gap-2">
              {fusedSkills.map((s, idx) => {
                const isVer = s.status === 'VERIFIED' || s.status === 'STRONGLY_VERIFIED';
                return (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                      isVer
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isVer ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                    <span>{s.skill}</span>
                    <span className="text-[9px] uppercase opacity-70 font-mono">({s.status === 'VERIFIED' ? 'VERIFIED' : 'PENDING'})</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Academic Information */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-content-primary">Personal & Academic Background</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-content-primary mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name || user?.name || 'Alex Kumar'}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email || user?.email || 'alex.kumar@example.com'}
                className="w-full px-3 py-2 bg-slate-100 border border-surface-border rounded-lg text-content-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Target Career Role</label>
              <input
                type="text"
                value={profile.targetRole || 'Full Stack Developer'}
                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Institution / College</label>
              <input
                type="text"
                value={profile.college || 'Apex Institute of Technology'}
                onChange={(e) => handleInputChange('college', e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Degree & Branch</label>
              <input
                type="text"
                value={`${profile.degree || 'B.Tech'} - ${profile.branch || 'CSE'}`}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Graduation Year</label>
              <input
                type="number"
                value={profile.graduationYear || 2026}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Platform Proof Connectors */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-content-primary">Connected Platform Profiles</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              5 Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-content-primary mb-1 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-primary" /> GitHub Username
              </label>
              <input
                type="text"
                value={profile.platformHandles?.github || 'alexkumar-dev'}
                onChange={(e) => handlePlatformChange('github', e.target.value)}
                placeholder="username"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <span className="text-[10px] text-content-muted mt-1 block">3 public repositories indexed (87 commits in MediRoute)</span>
            </div>

            <div>
              <label className="block font-bold text-content-primary mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-primary" /> LeetCode Handle
              </label>
              <input
                type="text"
                value={profile.platformHandles?.leetcode || 'alex_code'}
                onChange={(e) => handlePlatformChange('leetcode', e.target.value)}
                placeholder="handle"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <span className="text-[10px] text-content-muted mt-1 block">427 solved (180 Easy, 210 Medium, 37 Hard)</span>
            </div>

            <div>
              <label className="block font-bold text-content-primary mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary" /> GeeksforGeeks Profile
              </label>
              <input
                type="text"
                value={profile.platformHandles?.gfg || 'alex_k'}
                onChange={(e) => handlePlatformChange('gfg', e.target.value)}
                placeholder="handle"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <span className="text-[10px] text-content-muted mt-1 block">180 problems solved, 720 score</span>
            </div>

            <div>
              <label className="block font-bold text-content-primary mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> LinkedIn Profile Handle
              </label>
              <input
                type="text"
                value={profile.platformHandles?.linkedin || 'alex-kumar-engineer'}
                onChange={(e) => handlePlatformChange('linkedin', e.target.value)}
                placeholder="handle"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <span className="text-[10px] text-content-muted mt-1 block">2 internships, 2 certifications</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-content-primary mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" /> Portfolio URL
              </label>
              <input
                type="url"
                value={profile.platformHandles?.portfolio || 'https://alexkumar.dev'}
                onChange={(e) => handlePlatformChange('portfolio', e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <h3 className="text-sm font-bold text-content-primary">Key Projects Under Analysis</h3>
            <span className="text-[11px] text-content-secondary font-medium">3 Active Codebases</span>
          </div>

          <div className="space-y-3">
            {profile.projects?.map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-surface-border rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-content-primary text-sm">{proj.title}</span>
                  <span className="text-[11px] font-mono text-primary font-bold bg-brand-50 px-2 py-0.5 rounded">
                    {proj.commitsCount} Commits
                  </span>
                </div>
                <p className="text-content-secondary">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies?.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-white border border-surface-border rounded text-[10px] font-semibold text-content-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
