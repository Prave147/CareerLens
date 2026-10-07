import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  GraduationCap,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export const PendingApprovals = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await placementService.getPending();
      if (res.success) {
        setPendingStudents(res.pendingStudents || []);
      }
    } catch (err) {
      console.warn('Pending fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAccept = async (id, name) => {
    try {
      const res = await placementService.acceptStudent(id);
      if (res.success) {
        setActionMessage(`Approved ${name} into placement cohort.`);
        setPendingStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id, name) => {
    try {
      const res = await placementService.rejectStudent(id);
      if (res.success) {
        setActionMessage(`Rejected ${name}'s membership request.`);
        setPendingStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Pending Student Approvals</h1>
          <p className="text-xs text-content-secondary mt-1">
            Review student registration requests for your institution before granting placement intelligence access.
          </p>
        </div>
        <div className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <Clock className="w-3.5 h-3.5" />
          <span>{pendingStudents.length} Pending Verifications</span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Pending Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Degree & Branch</th>
                <th className="py-3.5 px-3 text-center">Grad Year</th>
                <th className="py-3.5 px-4 text-center">Completeness</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {pendingStudents.map((student) => {
                const sId = student._id || student.id;
                return (
                  <tr key={sId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-content-primary">
                      {student.name}
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      {student.email}
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      {student.degree || 'B.Tech CSE'}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold">
                      {student.graduationYear || 2026}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-bold">
                        {student.profileCompleteness || 75}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAccept(sId, student.name)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(sId, student.name)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {pendingStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-content-muted">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-content-primary text-sm">All student registrations verified!</p>
                    <p className="text-xs mt-0.5">No pending approval requests currently require review.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
