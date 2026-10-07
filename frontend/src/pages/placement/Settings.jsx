import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Save, CheckCircle2, Shield, Calendar, Users } from 'lucide-react';

export const PlacementSettings = () => {
  const { user } = useAuth();
  const [institutionData, setInstitutionData] = useState({
    institutionName: 'Apex Institute of Technology',
    institutionCode: 'AIT-ENG-2026',
    officerName: user?.name || 'Dr. Sarah Jenkins',
    officialEmail: user?.email || 'placement@apex.edu',
    academicYear: '2025 - 2026',
    minimumReadinessThreshold: 75,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold text-content-primary">Institution & Placement Season Settings</h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Configure institutional identification, academic year cohorts, and minimum clearance thresholds.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-status-success-border text-status-success text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Institution settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Building2 className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-bold text-content-primary">Institution Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-content-primary mb-1">Institution Name</label>
              <input
                type="text"
                value={institutionData.institutionName}
                onChange={(e) => setInstitutionData({ ...institutionData, institutionName: e.target.value })}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Institute Code</label>
              <input
                type="text"
                value={institutionData.institutionCode}
                onChange={(e) => setInstitutionData({ ...institutionData, institutionCode: e.target.value })}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Placement Officer</label>
              <input
                type="text"
                value={institutionData.officerName}
                onChange={(e) => setInstitutionData({ ...institutionData, officerName: e.target.value })}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Official Email</label>
              <input
                type="email"
                disabled
                value={institutionData.officialEmail}
                className="w-full px-3 py-2 bg-slate-100 border border-surface-border rounded-lg text-content-muted"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Calendar className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-bold text-content-primary">Placement Season Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-content-primary mb-1">Academic Year</label>
              <input
                type="text"
                value={institutionData.academicYear}
                onChange={(e) => setInstitutionData({ ...institutionData, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Minimum Readiness Threshold</label>
              <input
                type="number"
                value={institutionData.minimumReadinessThreshold}
                onChange={(e) => setInstitutionData({ ...institutionData, minimumReadinessThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-content-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
              <span className="text-[10px] text-content-muted mt-1 block">Candidates below this score are automatically flagged for intervention.</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Institution Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
