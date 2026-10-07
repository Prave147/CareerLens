import React, { useState, useEffect } from 'react';
import { githubService } from '../../services/githubService';
import { studentService } from '../../services/studentService';
import {
  FolderGit2,
  GitFork,
  Star,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Code2,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  FileCode2,
  Terminal,
  Cpu,
  Globe,
  Database,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

export const GitHubIntelligence = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, OWNED, FORKED, ACTIVE, MATCHED
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProfileAndAnalysis();
  }, []);

  const loadProfileAndAnalysis = async () => {
    setLoading(true);
    try {
      // 1. Get connected student profile handles
      const studentProfRes = await studentService.getProfile();
      const connectedUsername = studentProfRes.profile?.platformHandles?.github;
      if (connectedUsername) {
        setUsernameInput(connectedUsername);
      }

      // 2. Fetch existing cached analysis
      const res = await githubService.getAnalysis();
      if (res.success && res.githubProfile) {
        setProfile(res.githubProfile);
        if (!usernameInput && res.githubProfile.username) {
          setUsernameInput(res.githubProfile.username);
        }
      }
    } catch (err) {
      console.warn('Could not load GitHub profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAndAnalyze = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = usernameInput.trim();
    if (!cleanInput) {
      setError('Please enter a GitHub username or profile URL.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setAnalyzing(true);

    try {
      // 1. Connect the new handle to student profile
      await githubService.connectGithub(cleanInput);

      // 2. Perform deep repository analysis explicitly specifying the new handle
      const analyzeRes = await githubService.analyzeGithub(cleanInput, true);

      if (analyzeRes.success && analyzeRes.githubProfile) {
        setProfile(analyzeRes.githubProfile);
        setUsernameInput(analyzeRes.githubProfile.username);
        setSuccessMsg(
          `GitHub intelligence synced for @${analyzeRes.githubProfile.username}! Analyzed ${analyzeRes.githubProfile.repositories?.length || 0} repositories and verified ${analyzeRes.githubProfile.statistics?.verifiedResumeSkillsCount || 0} technical skills.`
        );
      } else {
        // Explicitly re-fetch profile data to guarantee fresh state
        const latest = await githubService.getProfile();
        if (latest.success && latest.githubProfile) {
          setProfile(latest.githubProfile);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze GitHub profile. Please verify username and network access.');
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredRepositories = (profile?.repositories || []).filter((repo) => {
    // Filter by type
    if (filterType === 'OWNED' && repo.ownershipStatus !== 'OWNED') return false;
    if (filterType === 'FORKED' && !repo.isFork && repo.ownershipStatus !== 'FORKED') return false;
    if (filterType === 'ACTIVE' && repo.recencyStatus !== 'ACTIVE') return false;
    if (filterType === 'MATCHED' && (!repo.matchedResumeProjects || repo.matchedResumeProjects.length === 0)) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = repo.name.toLowerCase().includes(q);
      const matchesDesc = (repo.description || '').toLowerCase().includes(q);
      const matchesTech = (repo.detectedTechnologies || []).some((t) => t.toLowerCase().includes(q));
      return matchesName || matchesDesc || matchesTech;
    }

    return true;
  });

  const getOwnershipBadge = (status, isFork) => {
    if (status === 'OWNED' && !isFork) {
      return (
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-extrabold inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Original Project
        </span>
      );
    }
    if (status === 'FORKED' || isFork) {
      return (
        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-extrabold inline-flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5 text-amber-600" />
          Forked Repository
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-extrabold inline-flex items-center gap-1">
        <Layers className="w-3.5 h-3.5 text-blue-600" />
        Collaboration
      </span>
    );
  };

  const getRecencyBadge = (recency) => {
    switch (recency) {
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
            Active (&lt;30d)
          </span>
        );
      case 'RECENTLY_ACTIVE':
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
            Recent (&lt;90d)
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
            Stale
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
              Proof Source • GitHub v1
            </span>
            <span className="text-xs text-content-secondary">
              Deterministic Codebase & Ownership Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-content-primary">GitHub Intelligence Engine</h1>
          <p className="text-xs text-content-secondary mt-1">
            Reconciles claimed skills and resume projects against actual GitHub repositories, package dependencies, and commit activity.
          </p>
        </div>

        {profile && (
          <button
            onClick={() => handleConnectAndAnalyze()}
            disabled={analyzing}
            className="px-4 py-2 bg-white border border-surface-border hover:bg-slate-50 text-content-primary font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin text-primary' : ''}`} />
            <span>{analyzing ? 'Analyzing Repositories...' : 'Re-Analyze GitHub'}</span>
          </button>
        )}
      </div>

      {/* Connect Profile Form */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-content-primary flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-primary" />
              Connected GitHub Account
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Enter your public GitHub handle or profile link (e.g. <code>https://github.com/username</code>).
            </p>
          </div>

          <form onSubmit={handleConnectAndAnalyze} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted text-xs font-mono">
                github.com/
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="username"
                className="w-full pl-24 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-xl font-mono text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={analyzing}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs rounded-xl shadow-sm transition-all shrink-0 disabled:opacity-50"
            >
              {analyzing ? 'Syncing...' : profile ? 'Update Handle' : 'Connect & Analyze'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-status-danger text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Card if connected */}
        {profile && (
          <div className="pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl || 'https://github.com/ghost.png'}
                alt={profile.username}
                className="w-12 h-12 rounded-xl border border-surface-border object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-content-primary">{profile.name || profile.username}</h4>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary font-mono hover:underline inline-flex items-center gap-0.5"
                  >
                    @{profile.username}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {profile.bio && <p className="text-xs text-content-secondary line-clamp-1">{profile.bio}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="block font-black text-content-primary text-sm">{profile.publicRepos}</span>
                <span className="text-[10px] text-content-muted font-bold uppercase">Public Repos</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="block font-black text-content-primary text-sm">{profile.followers}</span>
                <span className="text-[10px] text-content-muted font-bold uppercase">Followers</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="block font-black text-content-primary text-sm">{profile.statistics?.totalStars || 0}</span>
                <span className="text-[10px] text-content-muted font-bold uppercase">Stars</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {profile && (
        <>
          {/* Key Metrics Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-content-muted">Total Repos</span>
              <p className="text-2xl font-black text-content-primary">{profile.statistics?.totalRepositories || 0}</p>
              <span className="text-[11px] text-content-secondary block">Public on GitHub</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-card space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Original Projects</span>
              <p className="text-2xl font-black text-emerald-700">{profile.statistics?.originalRepositories || 0}</p>
              <span className="text-[11px] text-emerald-600 font-medium block">Owned codebases</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-card space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Forks Detected</span>
              <p className="text-2xl font-black text-amber-700">{profile.statistics?.forkedRepositories || 0}</p>
              <span className="text-[11px] text-amber-600 font-medium block">Forked repositories</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-content-muted">Active Projects</span>
              <p className="text-2xl font-black text-content-primary">{profile.statistics?.activeRepositories || 0}</p>
              <span className="text-[11px] text-content-secondary block">Commits &lt;30 days</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-content-muted">Verified Skills</span>
              <p className="text-2xl font-black text-primary">{profile.statistics?.verifiedResumeSkillsCount || 0}</p>
              <span className="text-[11px] text-content-secondary block">Codebase supported</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-content-muted">Matched Projects</span>
              <p className="text-2xl font-black text-primary">{profile.statistics?.matchedProjectsCount || 0}</p>
              <span className="text-[11px] text-content-secondary block">Resume matched</span>
            </div>
          </div>

          {/* Insights Card */}
          {profile.insights && profile.insights.length > 0 && (
            <div className="p-5 bg-white rounded-2xl border border-surface-border shadow-card space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-content-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Deterministic Repository Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {profile.insights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span className="text-content-secondary font-medium leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Detected Across All Repositories */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-content-primary flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                Detected Codebase Technologies & Frameworks
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Extracted directly from dependency files (<code>package.json</code>, <code>requirements.txt</code>, <code>pom.xml</code>, <code>Dockerfile</code>) across your repositories.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(profile.statistics?.detectedTechnologies || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 border border-slate-200 text-content-primary text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {tech}
                </span>
              ))}
            </div>

            {/* Language Breakdown */}
            {profile.statistics?.languages && profile.statistics.languages.length > 0 && (
              <div className="pt-3 border-t border-surface-border space-y-2">
                <span className="text-[11px] font-bold text-content-secondary block">
                  Language Distribution by Code Volume
                </span>
                <div className="flex flex-wrap gap-3">
                  {profile.statistics.languages.slice(0, 6).map((lang, idx) => (
                    <div key={idx} className="text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <span className="font-bold text-content-primary">{lang.name}:</span>{' '}
                      <span className="text-content-secondary">{lang.count} {lang.count === 1 ? 'repo' : 'repos'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Repositories Explorer */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-content-primary flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-primary" />
                  Repository Audit & Evidence Explorer
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Detailed inspection of individual repositories with ownership and evidence strength scores.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search repos or tech..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'OWNED', label: 'Original' },
                    { id: 'ACTIVE', label: 'Active (<30d)' },
                    { id: 'FORKED', label: 'Forks' },
                    { id: 'MATCHED', label: 'Resume Match' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        filterType === f.id
                          ? 'bg-white text-primary shadow-subtle'
                          : 'text-content-secondary hover:text-content-primary'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRepositories.map((repo, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-surface-border bg-white hover:border-primary/40 transition-all shadow-subtle space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Repo Title & Link */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-extrabold text-content-primary hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3 h-3 text-content-muted" />
                        </a>
                        <p className="text-[11px] text-content-secondary line-clamp-2 mt-0.5">
                          {repo.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {repo.stars > 0 && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {repo.stars}
                          </span>
                        )}
                        {repo.forks > 0 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1">
                            <GitFork className="w-3 h-3 text-slate-500" />
                            {repo.forks}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {getOwnershipBadge(repo.ownershipStatus, repo.isFork)}
                      {getRecencyBadge(repo.recencyStatus)}
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
                        Strength: {repo.evidenceStrength}
                      </span>
                    </div>

                    {/* Detected Technologies */}
                    {repo.detectedTechnologies && repo.detectedTechnologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {repo.detectedTechnologies.map((tech, tidx) => (
                          <span key={tidx} className="px-2 py-0.5 bg-brand-50/70 text-primary font-medium text-[10px] rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Matched Resume Project Banner */}
                    {repo.matchedResumeProjects && repo.matchedResumeProjects.length > 0 && (
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-bold text-emerald-800">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Matches Resume: "{repo.matchedResumeProjects[0].resumeProjectName}"
                          </span>
                          <span className="text-[10px] font-mono">Score: {repo.matchedResumeProjects[0].matchScore}%</span>
                        </div>
                        <p className="text-[10px] text-emerald-700">{repo.matchedResumeProjects[0].matchReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer info */}
                  <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[10px] text-content-muted">
                    <span>
                      {repo.dependencyFilesFound?.length > 0
                        ? `Config: ${repo.dependencyFilesFound.join(', ')}`
                        : repo.primaryLanguage || 'No config file'}
                    </span>
                    <span>
                      Updated {new Date(repo.pushedAt || repo.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredRepositories.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-surface-border text-xs text-content-muted">
                No repositories match the selected filter.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
