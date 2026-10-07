import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Award,
  Code2
} from 'lucide-react';

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await placementService.getStudents();
        if (res.success) {
          setStudents(res.students || []);
        }
      } catch (err) {
        console.warn('Students fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleInspect = async (student) => {
    setSelectedStudent(student);
    try {
      const res = await placementService.getStudentDetail(student.id || student._id);
      if (res.success) {
        setStudentDetail(res.student);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.targetRole.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Student Intelligence Directory</h1>
          <p className="text-xs text-content-secondary mt-1">
            Browse verified candidate profiles, employability readiness indices, and primary skill deficits.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-surface-border shadow-card text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, role, or email..."
            className="w-full pl-9 pr-4 py-2 bg-surface-bg border border-surface-border rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Job Ready', 'Almost Ready', 'Developing', 'Needs Intervention'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-content-secondary hover:bg-surface-hover hover:text-content-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3 text-center">Readiness Index</th>
                <th className="py-3.5 px-4">Target Role</th>
                <th className="py-3.5 px-4">Best Current Fit</th>
                <th className="py-3.5 px-4">Evidence Confidence</th>
                <th className="py-3.5 px-4">Major Proof Gap</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => handleInspect(student)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-content-primary block">{student.name}</span>
                    <span className="text-[11px] text-content-muted">{student.email}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="text-sm font-extrabold text-content-primary">{student.readiness}</span>
                    <span className="text-[10px] text-content-muted block">/ 100</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-content-primary">
                    {student.targetRole}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-primary">
                    {student.bestCurrentRole}
                  </td>
                  <td className="py-3.5 px-4 text-content-secondary font-medium">
                    {student.evidenceConfidence}
                  </td>
                  <td className="py-3.5 px-4 text-amber-700 font-medium">
                    {student.majorGap}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      student.status === 'Job Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      student.status === 'Almost Ready' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      student.status === 'Developing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-secondary font-bold hover:underline inline-flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border shadow-elevated max-w-2xl w-full p-6 space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <h3 className="text-lg font-extrabold text-content-primary">{selectedStudent.name}</h3>
                <p className="text-xs text-content-secondary">{selectedStudent.email} • Target: {selectedStudent.targetRole}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-content-secondary hover:text-content-primary hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Readiness Card */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-surface-border rounded-xl">
                <div>
                  <span className="text-[10px] text-content-muted block font-semibold">Employability Index</span>
                  <span className="text-2xl font-black text-secondary">{selectedStudent.readiness} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-content-muted block font-semibold">Immediate Best Role Fit</span>
                  <span className="text-sm font-extrabold text-primary">{selectedStudent.bestCurrentRole}</span>
                </div>
              </div>

              {/* Verified Skills */}
              <div>
                <span className="font-bold uppercase tracking-wider text-content-muted text-[10px] block mb-1.5">
                  Verified Technical Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {studentDetail?.verifiedSkills?.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Proof */}
              <div>
                <span className="font-bold uppercase tracking-wider text-content-muted text-[10px] block mb-1.5">
                  Code Repositories & Ownership
                </span>
                <div className="space-y-1.5">
                  {studentDetail?.projectEvidence?.map((p, idx) => (
                    <div key={idx} className="p-2.5 bg-surface-bg border border-surface-border rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-bold text-content-primary">{p.name}</span>
                        <span className="text-content-muted ml-2">({p.commits} commits)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.ownership === 'ORIGINAL_OWNER' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {p.ownership.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Interventions */}
              <div>
                <span className="font-bold uppercase tracking-wider text-content-muted text-[10px] block mb-1.5">
                  Recommended Institutional Interventions
                </span>
                <div className="space-y-1 text-content-secondary">
                  {studentDetail?.recommendedInterventions?.map((int, idx) => (
                    <div key={idx} className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-[11px] font-medium text-blue-900">
                      • {int}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-content-primary font-bold text-xs rounded-lg transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
