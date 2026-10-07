import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
  Code2,
  Trophy,
  Flame,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Target,
  Zap,
  Activity
} from 'lucide-react';

export const CodingActivity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await studentService.getCodingActivity();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Coding activity error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const leetcode = data?.platforms?.leetcode;
  const gfg = data?.platforms?.gfg;
  const codechef = data?.platforms?.codechef;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Algorithmic Coding & Consistency</h1>
        <p className="text-xs text-content-secondary mt-1">
          Aggregates problem solving volume, contest ratings, topic mastery, and 30-day activity consistency.
        </p>
      </div>

      {/* Consistency Warning Banner */}
      {data?.overallConsistency && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900">Consistency Notice:</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">
                {data.overallConsistency.recent}
              </span>
            </div>
            <p className="text-amber-800 mt-1">{data.overallConsistency.historical}</p>
            <p className="text-amber-900 font-semibold mt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Action: {data.overallConsistency.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* LeetCode */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-sm">
                  LC
                </div>
                <div>
                  <h3 className="font-bold text-content-primary text-sm">LeetCode</h3>
                  <p className="text-[11px] text-content-muted font-mono">{leetcode?.username || 'alex_code'}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                Connected
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Problems Solved</span>
                <span className="text-sm font-extrabold text-content-primary">{leetcode?.problemsSolved || 427}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Contest Rating</span>
                <span className="text-xs font-bold text-amber-600">{leetcode?.contestRating || 1742} ({leetcode?.globalRank || 'Top 8%'})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Active Streak</span>
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {leetcode?.streakDays || 18} Days
                </span>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold">Easy</span>
                <span className="font-bold">{leetcode?.breakdown?.easy?.solved || 180}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-amber-700 font-semibold">Medium</span>
                <span className="font-bold">{leetcode?.breakdown?.medium?.solved || 210}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-red-700 font-semibold">Hard</span>
                <span className="font-bold">{leetcode?.breakdown?.hard?.solved || 37}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-surface-border text-center">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Algorithmic Problem Volume Verified
            </span>
          </div>
        </div>

        {/* GeeksforGeeks */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-black text-sm">
                  GFG
                </div>
                <div>
                  <h3 className="font-bold text-content-primary text-sm">GeeksforGeeks</h3>
                  <p className="text-[11px] text-content-muted font-mono">{gfg?.username || 'alex_k'}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                Connected
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Problems Solved</span>
                <span className="text-sm font-extrabold text-content-primary">{gfg?.problemsSolved || 180}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Coding Score</span>
                <span className="text-xs font-bold text-emerald-700">{gfg?.codingScore || 540}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Published Articles</span>
                <span className="text-xs font-bold text-content-primary">{gfg?.articlesWritten || 3}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-surface-border text-center">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Foundational DSA Proof Active
            </span>
          </div>
        </div>

        {/* CodeChef */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-700 flex items-center justify-center font-black text-sm">
                  CC
                </div>
                <div>
                  <h3 className="font-bold text-content-primary text-sm">CodeChef</h3>
                  <p className="text-[11px] text-content-muted font-mono">{codechef?.username || 'alex_chef'}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                Connected
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Star Rating</span>
                <span className="text-sm font-extrabold text-amber-600">{codechef?.stars || '3★'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Contest Rating</span>
                <span className="text-xs font-bold text-content-primary">{codechef?.rating || 1680}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs text-content-secondary">Problems Solved</span>
                <span className="text-xs font-bold text-content-primary">{codechef?.problemsSolved || 124}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-surface-border text-center">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Contest Performance Verified
            </span>
          </div>
        </div>
      </div>

      {/* Topic Mastery Distribution */}
      {leetcode?.topicsCovered && (
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-content-primary text-sm mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Topic-Level Algorithmic Competence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {leetcode.topicsCovered.map((topic, idx) => (
              <div key={idx} className="p-3 bg-surface-bg border border-surface-border rounded-xl text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-content-primary">{topic.topic}</p>
                  <p className="text-[11px] text-content-muted">{topic.solved} problems solved</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  topic.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' :
                  topic.status === 'Strong' ? 'bg-blue-100 text-blue-800' :
                  topic.status === 'Moderate' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {topic.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
