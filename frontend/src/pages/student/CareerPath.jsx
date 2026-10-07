import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Layers,
  Award
} from 'lucide-react';

export const CareerPath = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await studentService.getRoles();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Career path error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const roles = data?.roles || [];
  const alignment = data?.careerPathAlignment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Career Path Alignment & Role Readiness</h1>
        <p className="text-xs text-content-secondary mt-1">
          Compares your verified proof against target industry benchmarks and identifies optimal transition paths.
        </p>
      </div>

      {/* Career Path Alignment Hero */}
      {alignment && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
                Career Path Intelligence
              </span>
              <h2 className="text-lg font-bold text-content-primary">
                Current Best Fit: <span className="text-primary">{alignment.bestCurrentRole}</span> (88%)
              </h2>
              <p className="text-xs text-content-secondary mt-1 max-w-2xl leading-relaxed">
                {alignment.alignmentNote}
              </p>
            </div>
            <div className="p-3 bg-white border border-blue-200 rounded-xl text-center shadow-sm shrink-0">
              <span className="text-[10px] text-content-muted block font-semibold">Target Goal</span>
              <span className="text-sm font-bold text-indigo-700">{alignment.targetRole}</span>
              <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">76% Fit (Projected: 92%)</span>
            </div>
          </div>

          {/* Transition Milestones */}
          <div className="pt-4 border-t border-blue-200/60">
            <h4 className="text-xs font-bold text-content-primary mb-2">Recommended Transition Strategy:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {alignment.transitionPlan?.map((step, sIdx) => (
                <div key={sIdx} className="p-2.5 bg-white/80 border border-blue-100 rounded-lg text-content-secondary flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <span className="text-[11px] leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role Recommendations Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roles.map((r, idx) => (
          <div key={idx} className="bg-white border border-surface-border rounded-2xl p-6 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-content-primary text-base">{r.role}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.matchPercentage >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    r.matchPercentage >= 65 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {r.matchPercentage >= 80 ? 'Optimal Immediate Match' : 'Developing Match'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-content-primary">{r.matchPercentage}%</span>
                  <span className="text-[10px] text-content-muted block font-semibold">Match Score</span>
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-emerald-700 block mb-1">Demonstrated Strengths:</span>
                <div className="flex flex-wrap gap-1.5">
                  {r.strengths?.map((str, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gaps */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-amber-700 block mb-1">Target Gaps to Close:</span>
                <div className="flex flex-wrap gap-1.5">
                  {r.gaps?.map((gap, gIdx) => (
                    <span key={gIdx} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="pt-3 border-t border-surface-border text-xs">
              <span className="font-bold text-content-primary block mb-0.5">Recommended Next Action:</span>
              <p className="text-content-secondary text-[11px]">{r.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
