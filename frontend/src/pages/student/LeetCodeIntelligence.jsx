import React, { useState, useEffect } from 'react';
import { leetcodeService } from '../../services/leetcodeService';
import {
  Code2,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Trophy,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileText,
  User,
  HelpCircle,
  Layers,
  ArrowUpRight,
  Target,
  BarChart3,
  Dna,
  Search,
  BookOpen,
  Calendar,
  Activity,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { useSkillEvidence } from '../../hooks/useSkillEvidence';
import { SkillEvidenceModal } from '../../components/SkillEvidenceModal';

export const LeetCodeIntelligence = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [codingProfile, setCodingProfile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState(null);
  const [backendOffline, setBackendOffline] = useState(false);
  const [topicViewMode, setTopicViewMode] = useState('top'); // 'top' | 'all'
  const [topicSearch, setTopicSearch] = useState('');

  const { skills: fusedSkills, refreshEvidence } = useSkillEvidence();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setInitialLoading(true);
    setBackendOffline(false);
    try {
      const res = await leetcodeService.getCodingProfile();
      if (res && res.success && res.profile) {
        setProfile(res.profile);
        setCodingProfile(res.codingProfile);
        setUsernameInput(res.profile.username || '');
      } else {
        const basicRes = await leetcodeService.getLeetCodeProfile();
        if (basicRes && basicRes.success && basicRes.leetcodeProfile) {
          setProfile(basicRes.leetcodeProfile);
          setUsernameInput(basicRes.leetcodeProfile.username || '');
        }
      }
    } catch (err) {
      console.warn('Could not load LeetCode profile:', err.message);
      if (err.message?.includes('Network Error') || err.message?.includes('ECONNREFUSED') || err.message?.includes('server unavailable')) {
        setBackendOffline(true);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleConnectOrAnalyze = async (e) => {
    e?.preventDefault();
    if (!usernameInput.trim()) {
      setError('Please enter a valid LeetCode username or profile URL.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await leetcodeService.analyzeLeetCode(usernameInput.trim());
      if (res && res.success && res.leetcodeProfile) {
        setProfile(res.leetcodeProfile);
        setCodingProfile(res.codingProfile);
        setSuccessMessage(`Successfully connected and analyzed @${res.leetcodeProfile.username}! Solved: ${res.leetcodeProfile.totalSolved} problems.`);
        refreshEvidence();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to analyze LeetCode profile. Please check the username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Disconnect your LeetCode profile? Attached algorithmic coding proof will be recalculated.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await leetcodeService.disconnectLeetCode();
      setProfile(null);
      setCodingProfile(null);
      setUsernameInput('');
      setSuccessMessage('LeetCode profile disconnected and evidence synchronized.');
      refreshEvidence();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to disconnect LeetCode profile.');
    } finally {
      setLoading(false);
    }
  };

  // Difficulty metrics
  const totalSolved = profile?.totalSolved || 0;
  const easySolved = profile?.easySolved || 0;
  const mediumSolved = profile?.mediumSolved || 0;
  const hardSolved = profile?.hardSolved || 0;

  const diffPercentages = codingProfile?.difficultyPercentages || profile?.difficultyPercentages || {
    easy: totalSolved > 0 ? Number(((easySolved / totalSolved) * 100).toFixed(1)) : 0,
    medium: totalSolved > 0 ? Number(((mediumSolved / totalSolved) * 100).toFixed(1)) : 0,
    hard: totalSolved > 0 ? Number(((hardSolved / totalSolved) * 100).toFixed(1)) : 0,
  };

  // Topics & Patterns
  const allTopicStats = codingProfile?.allTopics || profile?.topicStats || [];
  const activeTopicStats = codingProfile?.topics || allTopicStats.filter((t) => t.problemsSolved > 0);
  const displayTopics = topicViewMode === 'top' ? activeTopicStats.slice(0, 10) : allTopicStats;
  const filteredTopics = displayTopics.filter((t) =>
    (t.topicName || '').toLowerCase().includes(topicSearch.toLowerCase()) ||
    (t.canonicalTopic || '').toLowerCase().includes(topicSearch.toLowerCase())
  );

  const patterns = codingProfile?.patterns || profile?.codingPatterns || { strong: [], moderate: [], developing: [], limited: [] };
  const codingGaps = codingProfile?.gaps || profile?.codingGaps || [];
  const recency = codingProfile?.recency || profile?.recencyStats || {};
  const consistency = codingProfile?.consistency || profile?.codingConsistency || 'MODERATE';

  // Filter skills relevant to DSA & Problem Solving
  const dsaSkills = fusedSkills.filter((s) => {
    const name = s.skill.toLowerCase();
    return (
      name.includes('data structure') ||
      name.includes('algorithm') ||
      name.includes('problem solving') ||
      name.includes('competitive') ||
      name.includes('dynamic programming') ||
      name.includes('binary search') ||
      name.includes('tree') ||
      name.includes('graph') ||
      name === 'dsa'
    );
  });

  const getStrengthBadgeClass = (strength) => {
    switch (strength) {
      case 'VERY_STRONG':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'STRONG':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStrengthBarWidth = (strength) => {
    switch (strength) {
      case 'VERY_STRONG':
        return '100%';
      case 'STRONG':
        return '75%';
      case 'MODERATE':
        return '45%';
      default:
        return '15%';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-sm">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-content-primary tracking-tight flex items-center gap-2">
                LeetCode Intelligence V2
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-900 text-[10px] font-extrabold rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Coding Pattern & DNA Engine
                </span>
              </h1>
              <p className="text-xs text-content-secondary mt-0.5">
                Evaluates multi-tag problem patterns, algorithmic difficulty distribution, consistency, and skill evidence.
              </p>
            </div>
          </div>
        </div>

        {profile && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConnectOrAnalyze}
              disabled={loading}
              className="px-3.5 py-1.5 bg-white border border-surface-border hover:bg-slate-50 text-content-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={loading}
              className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Backend Offline Callout */}
      {backendOffline && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">⚠ Unable to connect to CareerLens backend.</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Backend Endpoint: <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">http://localhost:5000/api</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadProfile}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Alert Banners */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Input / Connect Card */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-black text-content-primary flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Connected LeetCode Profile
            </h2>
            <p className="text-xs text-content-secondary">
              Enter your public LeetCode handle to analyze problem categories, difficulty breakdown, coding patterns, and languages.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {profile ? (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Connected (@{profile.username})
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Not Connected
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleConnectOrAnalyze} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-muted">
              <span className="text-xs font-bold text-slate-400">leetcode.com/u/</span>
            </div>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="username"
              className="w-full pl-36 pr-4 py-2.5 text-xs bg-slate-50 border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-content-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Coding DNA...</span>
              </>
            ) : (
              <>
                <span>{profile ? 'Re-Analyze V2 Profile' : 'Connect & Analyze V2'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main V2 Profile Content */}
      {profile && (
        <div className="space-y-6">
          {/* Top Stat Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* User Identity */}
            <div className="p-5 bg-white rounded-2xl border border-surface-border shadow-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-content-primary truncate">{profile.realName || profile.username}</h3>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs font-bold text-primary truncate">@{profile.username}</p>
                <p className="text-[10px] text-content-muted mt-0.5">
                  Ranking: #{profile.ranking ? profile.ranking.toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Total Solved */}
            <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Problems Solved</span>
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-amber-950 tracking-tight">{profile.totalSolved}</span>
                <span className="text-xs text-amber-700 font-bold ml-1.5">solved</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-amber-700 font-medium">Acceptance Rate</span>
                <span className="font-black text-amber-900">{profile.acceptanceRate}%</span>
              </div>
            </div>

            {/* Contest & Consistency */}
            <div className="p-5 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-2xl border border-purple-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Consistency & Rating</span>
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-purple-950 tracking-tight">
                  {consistency}
                </span>
                <span className="text-xs font-bold text-purple-800">
                  {profile.contestRating ? `Rating ${profile.contestRating}` : `${recency.activeDays || profile.totalActiveDays || 0} active days`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-purple-700 font-medium">Recent 30 Days</span>
                <span className="font-black text-purple-900">{recency.last30Days || 0} submissions</span>
              </div>
            </div>

            {/* DSA Evidence Strength */}
            <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl border border-emerald-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">DSA Evidence Strength</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-emerald-950 tracking-tight">
                  {profile.dsaEvidenceStrength?.replace('_', ' ') || 'MODERATE'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deterministic Evidence Fusion</span>
              </div>
            </div>
          </div>

          {/* Section 2: Difficulty Distribution (Counts + Exact %) */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-content-primary flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Difficulty Breakdown & Distribution
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Actual solved problem distribution across Easy, Medium, and Hard algorithmic challenges.
                </p>
              </div>
              <span className="text-xs font-bold text-content-muted">
                {profile.totalSolved} Total Solved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Easy */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Easy</span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {profile.easySolved} <span className="text-[10px] text-emerald-600 font-normal">({diffPercentages.easy}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${diffPercentages.easy}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                  <span>Foundational algorithmic fluency</span>
                  <span>{diffPercentages.easy}% of solved</span>
                </div>
              </div>

              {/* Medium */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Medium</span>
                  <span className="text-xs font-extrabold text-amber-700">
                    {profile.mediumSolved} <span className="text-[10px] text-amber-600 font-normal">({diffPercentages.medium}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${diffPercentages.medium}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold">
                  <span>Core technical interview benchmark</span>
                  <span>{diffPercentages.medium}% of solved</span>
                </div>
              </div>

              {/* Hard */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-800 uppercase tracking-wider">Hard</span>
                  <span className="text-xs font-extrabold text-rose-700">
                    {profile.hardSolved} <span className="text-[10px] text-rose-600 font-normal">({diffPercentages.hard}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${diffPercentages.hard}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-rose-800 font-semibold">
                  <span>Advanced complexity optimization</span>
                  <span>{diffPercentages.hard}% of solved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: CODING DNA (Visual Meters of Topic Strengths) */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-content-primary flex items-center gap-2">
                  <Dna className="w-4 h-4 text-purple-600" />
                  CODING DNA
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Measurable topic strength meters derived from volume, difficulty, and practice frequency.
                </p>
              </div>
              <span className="text-[11px] text-content-muted font-medium">
                *Multi-tag evidence evaluated deterministically
              </span>
            </div>

            {activeTopicStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTopicStats.slice(0, 8).map((topic, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTopicDetail(topic)}
                    className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-surface-border rounded-xl cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-content-primary flex items-center gap-1.5">
                        {topic.canonicalTopic}
                        <span className="text-[10px] text-content-muted font-normal">({topic.problemsSolved} solved)</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getStrengthBadgeClass(topic.strength)}`}>
                        {topic.strength?.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          topic.strength === 'VERY_STRONG'
                            ? 'bg-emerald-500'
                            : topic.strength === 'STRONG'
                            ? 'bg-blue-500'
                            : topic.strength === 'MODERATE'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: getStrengthBarWidth(topic.strength) }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-content-muted">
                      <span>{topic.category}</span>
                      <span>{topic.percentage}% of solved problems</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-content-secondary">
                Detailed problem-topic analysis unavailable from the current LeetCode data source.
              </div>
            )}
          </div>

          {/* Section 4: CODING PATTERN PROFILE (4-Quadrant Higher Level Grouping) */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-5">
            <div>
              <h3 className="text-sm font-black text-content-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                CODING PATTERN PROFILE
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Higher-level algorithmic pattern exposure grouped by verified confidence tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Strong */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Strong Patterns
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {patterns.strong?.length || 0}
                  </span>
                </div>
                {patterns.strong?.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {patterns.strong.map((item, i) => (
                      <li key={i} className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-content-muted italic">Building strong patterns.</p>
                )}
              </div>

              {/* Moderate */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Moderate Patterns
                  </span>
                  <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {patterns.moderate?.length || 0}
                  </span>
                </div>
                {patterns.moderate?.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {patterns.moderate.map((item, i) => (
                      <li key={i} className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-content-muted italic">No moderate pattern tier.</p>
                )}
              </div>

              {/* Developing */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Developing
                  </span>
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    {patterns.developing?.length || 0}
                  </span>
                </div>
                {patterns.developing?.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {patterns.developing.map((item, i) => (
                      <li key={i} className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-content-muted italic">No developing tier.</p>
                )}
              </div>

              {/* Limited Evidence */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    Limited Evidence
                  </span>
                  <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    {patterns.limited?.length || 0}
                  </span>
                </div>
                {patterns.limited?.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {patterns.limited.slice(0, 6).map((item, i) => (
                      <li key={i} className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-content-muted italic">All patterns practiced.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Role-based Coding Skill Gaps */}
          {codingGaps.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
              <div>
                <h3 className="text-sm font-black text-content-primary flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-600" />
                  Coding Skill Gaps (Software Engineering Benchmark)
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Algorithmic topics below target interview benchmarks with concrete practice suggestions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {codingGaps.map((gap, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-content-primary">{gap.topic}</span>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-black">
                          {gap.currentStrength} → {gap.targetStrength}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-secondary leading-relaxed">
                        {gap.recommendation}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-[10px] text-rose-800 font-bold">
                      <span>Current Solved: {gap.count}</span>
                      <span>Target: {gap.targetCount}+ problems</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Topic Frequency Table (Top Topics vs All Topics) */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-border">
              <div>
                <h3 className="text-sm font-black text-content-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Algorithmic Topic & Problem Type Analysis
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Solved problem frequency across normalized CareerLens algorithmic categories.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTopicViewMode('top')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      topicViewMode === 'top' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Top Topics ({activeTopicStats.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopicViewMode('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      topicViewMode === 'all' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All 27 Topics
                  </button>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Search topic or algorithmic category (e.g. Dynamic Programming, Trees, Binary Search)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>

            {filteredTopics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border text-[11px] font-bold text-content-muted uppercase">
                      <th className="py-2.5 px-3">Topic / Category</th>
                      <th className="py-2.5 px-3">Category Type</th>
                      <th className="py-2.5 px-3">Problems Solved</th>
                      <th className="py-2.5 px-3">% of Solved</th>
                      <th className="py-2.5 px-3">Strength Tier</th>
                      <th className="py-2.5 px-3">Recent (30d)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {filteredTopics.map((topic, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-content-primary">
                          {topic.canonicalTopic}
                        </td>
                        <td className="py-3 px-3 text-content-secondary">
                          {topic.category}
                        </td>
                        <td className="py-3 px-3 font-black text-content-primary">
                          {topic.problemsSolved}
                        </td>
                        <td className="py-3 px-3 font-semibold text-content-secondary">
                          {topic.percentage}%
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getStrengthBadgeClass(topic.strength)}`}>
                            {topic.strength}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-content-muted">
                          {topic.recentCount > 0 ? (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              +{topic.recentCount}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedTopicDetail(topic)}
                            className="text-[11px] font-bold text-primary hover:underline"
                          >
                            Inspect Evidence
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-content-muted py-4 text-center">No matching topics found.</p>
            )}
            <p className="text-[11px] text-content-muted italic">
              *Note: A single problem with multiple tags (e.g. Arrays + Hash Table) counts as evidence for each respective category. Topic totals do not sum to total problems solved.
            </p>
          </div>

          {/* Section 7: Languages Practiced + Recency Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Language Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
              <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                Language Activity on LeetCode
              </h4>
              <p className="text-[11px] text-content-muted">
                *Indicates algorithmic practice language. Does not automatically prove full-stack software development experience.
              </p>
              {profile.languageStats && profile.languageStats.length > 0 ? (
                <div className="space-y-2.5">
                  {profile.languageStats.map((l, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
                      <span className="font-bold text-content-primary">{l.languageName}</span>
                      <span className="font-black text-primary">{l.problemsSolved} Solved</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-content-muted">No language metrics reported.</p>
              )}
            </div>

            {/* Recency & Calendar Activity */}
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
              <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Recency & Consistency Breakdown
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-content-secondary">Last 30 Days Submissions</span>
                  <span className="font-black text-content-primary">{recency.last30Days || 0}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-content-secondary">Last 90 Days Submissions</span>
                  <span className="font-black text-content-primary">{recency.last90Days || 0}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-content-secondary">Total Active Coding Days</span>
                  <span className="font-black text-content-primary">{recency.activeDays || profile.totalActiveDays || 0}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-content-secondary">Current Coding Streak</span>
                  <span className="font-black text-emerald-700">{recency.streakDays || profile.streak || 0} days</span>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
              <h4 className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Recent Accepted Submissions ({profile.recentSubmissions?.length || 0})
              </h4>
              {profile.recentSubmissions && profile.recentSubmissions.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {profile.recentSubmissions.map((sub, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-content-primary truncate max-w-[160px]">{sub.title}</p>
                        {sub.lang && (
                          <span className="text-[10px] text-content-muted font-mono">{sub.lang}</span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded text-[10px]">
                        {sub.statusDisplay || 'Accepted'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-content-muted">No recent submissions found.</p>
              )}
            </div>
          </div>

          {/* Section 8: RESUME CLAIM ↔ LEETCODE EVIDENCE ALIGNMENT */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
            <div>
              <h3 className="text-sm font-black text-content-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Resume Claim ↔ LeetCode Verification Alignment
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Shows which resume problem-solving & algorithmic claims are backed by your LeetCode V2 coding profile.
              </p>
            </div>

            {dsaSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {dsaSkills.map((skill, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-content-primary">{skill.skill}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black">
                        {skill.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-content-secondary space-y-1">
                      <p className="flex items-center gap-1 text-blue-700 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        Resume Claim Detected
                      </p>
                      <p className="flex items-center gap-1 text-amber-700 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                        LeetCode Evidence Attached ({profile.totalSolved} solved)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-content-secondary">
                <p>No explicit DSA, Dynamic Programming, or Tree/Graph claims found on your latest uploaded resume.</p>
                <p className="text-[11px] text-content-muted mt-1">
                  Upload an updated resume claiming "Data Structures & Algorithms" or specific algorithmic categories to see direct multi-source verification linkage.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Topic Detail Modal */}
      {selectedTopicDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-elevated max-w-lg w-full space-y-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  Topic Evidence Breakdown
                </span>
                <h3 className="text-lg font-black text-content-primary mt-0.5">
                  {selectedTopicDetail.canonicalTopic}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTopicDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Evidence Strength:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getStrengthBadgeClass(selectedTopicDetail.strength)}`}>
                  {selectedTopicDetail.strength}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Historical Problems Solved:</span>
                <span className="font-black text-content-primary">{selectedTopicDetail.problemsSolved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Recent Submissions (Last 30 Days):</span>
                <span className="font-black text-emerald-700">+{selectedTopicDetail.recentCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Share of Solved Volume:</span>
                <span className="font-black text-content-primary">{selectedTopicDetail.percentage}%</span>
              </div>
            </div>

            <div className="text-xs text-content-secondary bg-blue-50/50 border border-blue-100 p-3 rounded-xl leading-relaxed">
              <p className="font-bold text-blue-900 mb-1">Evidence Summary:</p>
              {selectedTopicDetail.problemsSolved > 0 ? (
                `Candidate has solved ${selectedTopicDetail.problemsSolved} problems categorized under ${selectedTopicDetail.canonicalTopic} on LeetCode with ${selectedTopicDetail.strength} deterministic pattern evidence.`
              ) : (
                `No sufficient LeetCode evidence found for ${selectedTopicDetail.canonicalTopic} problem solving.`
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedTopicDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-content-primary font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Skill Evidence Modal */}
      {selectedSkillModal && (
        <SkillEvidenceModal
          skill={selectedSkillModal}
          onClose={() => setSelectedSkillModal(null)}
        />
      )}
    </div>
  );
};

export default LeetCodeIntelligence;
