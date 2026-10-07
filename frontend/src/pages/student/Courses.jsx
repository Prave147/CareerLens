import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import {
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  Award
} from 'lucide-react';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await studentService.getCourses();
        if (res.success) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.warn('Courses error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Course → Proof Intelligence Pipeline</h1>
        <p className="text-xs text-content-secondary mt-1">
          Every recommended course is tied directly to an actionable project deliverable and verifiable proof submission.
        </p>
      </div>

      {/* Pipeline Banner */}
      <div className="p-4 bg-white border border-surface-border rounded-2xl shadow-card">
        <h3 className="text-xs font-bold text-content-primary uppercase tracking-wider mb-3">
          The CareerLens Learning Loop
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs">
            <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">1</span>
            <span className="font-bold text-content-primary block">LEARN</span>
            <span className="text-[11px] text-content-secondary">Targeted skill modules</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">2</span>
            <span className="font-bold text-content-primary block">BUILD</span>
            <span className="text-[11px] text-content-secondary">Production-grade features</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">3</span>
            <span className="font-bold text-content-primary block">PROVE</span>
            <span className="text-[11px] text-content-secondary">Commit code & deploy</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">4</span>
            <span className="font-bold text-content-primary block">RE-ANALYZE</span>
            <span className="text-[11px] text-content-secondary">Unlock readiness score</span>
          </div>
        </div>
      </div>

      {/* Courses Cards */}
      <div className="space-y-4">
        {courses.map((course, idx) => (
          <div key={idx} className="bg-white border border-surface-border rounded-2xl p-6 shadow-card hover:border-primary/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-surface-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-brand-50 text-primary border border-brand-200 rounded text-[10px] font-bold">
                    Target Gap: {course.skill}
                  </span>
                  <span className="text-[11px] text-content-muted">• {course.platform}</span>
                </div>
                <h3 className="font-bold text-content-primary text-base">{course.courseName}</h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600">+{course.expectedPointsGain} pts</span>
                  <span className="text-[10px] text-content-muted block font-semibold">Projected Score</span>
                </div>
              </div>
            </div>

            {/* Proof Deliverable & Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
              <div>
                <span className="font-bold text-content-primary block mb-1.5">Required Proof to Unlock Score:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-content-secondary leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-[11px]">{course.proofRequired}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-content-primary block mb-1.5">Verification Pipeline:</span>
                <div className="space-y-1.5">
                  {course.pipeline?.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-[11px] text-content-secondary">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
