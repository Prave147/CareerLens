import React, { useState, useEffect } from 'react';
import { placementService } from '../../services/placementService';
import {
  Layers,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  GraduationCap,
  Hammer,
  BookOpen,
  CheckCircle2,
  X,
  Building2,
  TrendingDown
} from 'lucide-react';

export const ClaimVsProof = () => {
  const [matrix, setMatrix] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaimProof = async () => {
      try {
        setLoading(true);
        const res = await placementService.getClaimProof();
        if (res.success) {
          setMatrix(res.claimVsProofMatrix || []);
          if (res.claimVsProofMatrix?.length > 0) {
            setSelectedSkill(res.claimVsProofMatrix[0]);
          }
        }
      } catch (err) {
        console.warn('Claim vs Proof error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClaimProof();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Batch Claim vs Proof Intelligence</h1>
        <p className="text-xs text-content-secondary mt-1">
          Detects systemic gaps where students declare technical proficiency on resumes without corroborating public code repositories.
        </p>
      </div>

      {/* Main Grid: Table on Left + Drilldown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Batch Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-content-secondary">
                  <th className="py-3.5 px-4">Skill</th>
                  <th className="py-3.5 px-3 text-center">Claimed</th>
                  <th className="py-3.5 px-3 text-center">Verified</th>
                  <th className="py-3.5 px-3 text-center">Proof Gap</th>
                  <th className="py-3.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {matrix.map((item) => {
                  const isSelected = selectedSkill?.skill === item.skill;
                  return (
                    <tr
                      key={item.skill}
                      onClick={() => setSelectedSkill(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/70 font-semibold' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-content-primary">
                        {item.skill}
                      </td>
                      <td className="py-3.5 px-3 text-center text-content-secondary font-medium">
                        {item.claimedPercentage}%
                      </td>
                      <td className="py-3.5 px-3 text-center text-emerald-700 font-bold">
                        {item.verifiedPercentage}%
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                          item.gapPercentage >= 35 ? 'bg-red-50 text-red-700 border border-red-200' :
                          item.gapPercentage >= 20 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.gapPercentage}% Gap
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right text-secondary">
                        <ChevronRight className="w-4 h-4 inline-block" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drill-down Detail Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
          {selectedSkill ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Skill Drill-Down</span>
                  <h3 className="text-lg font-black text-content-primary">{selectedSkill.skill}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-red-600">-{selectedSkill.gapPercentage}%</span>
                  <span className="text-[10px] text-content-muted block font-semibold">Deficit Gap</span>
                </div>
              </div>

              {/* Why Students Struggle */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                <span className="font-bold text-red-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Why Students Struggle:
                </span>
                <p className="text-red-800 text-[11px] leading-relaxed">
                  {selectedSkill.whyStudentsStruggle}
                </p>
              </div>

              {/* Common Evidence Gaps */}
              <div>
                <span className="font-bold text-content-primary block mb-1">Common Evidence Deficits:</span>
                <p className="text-content-secondary text-[11px] leading-relaxed bg-surface-bg p-3 rounded-xl border border-surface-border">
                  {selectedSkill.commonEvidenceGaps}
                </p>
              </div>

              {/* Suggested Institutional Intervention */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Suggested Institutional Intervention:
                </span>
                <p className="text-blue-900 font-semibold text-xs">{selectedSkill.suggestedIntervention}</p>
                <div className="pt-2 border-t border-blue-200/60 space-y-1 text-[11px] text-blue-800">
                  <p><strong>Training: </strong>{selectedSkill.recommendedTraining}</p>
                  <p><strong>Deliverable: </strong>{selectedSkill.suggestedProject}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-content-muted text-xs">
              Select a skill from the matrix to view cause analysis and intervention templates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
