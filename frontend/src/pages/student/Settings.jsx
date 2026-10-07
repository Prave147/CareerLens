import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, Bell, Shield, Key, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export const StudentSettings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyDigest: true,
    gapReminders: true,
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
        <h1 className="text-2xl font-extrabold text-content-primary">Account & System Settings</h1>
        <p className="text-xs text-content-secondary mt-0.5">Manage notification preferences, authentication security, and sync intervals.</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-status-success-border text-status-success text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Details */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Key className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-content-primary">Account Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-content-primary mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.name || 'Alex Kumar'}
                className="w-full px-3 py-2 bg-slate-50 border border-surface-border rounded-lg text-content-muted"
              />
            </div>
            <div>
              <label className="block font-bold text-content-primary mb-1">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || 'alex.kumar@example.com'}
                className="w-full px-3 py-2 bg-slate-50 border border-surface-border rounded-lg text-content-muted"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-content-primary">Notification Preferences</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <span className="font-bold text-content-primary">Evidence Scan Alerts</span>
                <p className="text-content-secondary text-[11px]">Notify me when new GitHub commits or LeetCode milestones are indexed.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-surface-border focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <span className="font-bold text-content-primary">Weekly Readiness Digest</span>
                <p className="text-content-secondary text-[11px]">Receive a weekly breakdown of readiness score gains and critical gaps.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-surface-border focus:ring-primary"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
