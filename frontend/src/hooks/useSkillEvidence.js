import { useState, useEffect, useCallback } from 'react';
import { evidenceService } from '../services/evidenceService';

export const useSkillEvidence = () => {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvidence = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await evidenceService.getSkillsEvidence();
      if (res && res.success) {
        setSkills(res.skills || []);
        setSummary(res.summary || null);
        setInsights(res.insights || []);
      }
    } catch (err) {
      console.warn('[useSkillEvidence] Failed to load fused evidence:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return {
    loading,
    skills,
    summary,
    insights,
    error,
    refreshEvidence: fetchEvidence,
  };
};
