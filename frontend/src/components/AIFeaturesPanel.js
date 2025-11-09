import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import ATSProgressBar from './ATSProgressBar';
import SuggestionCard from './SuggestionCard';

export default function AIFeaturesPanel({ resumeText, jobText, bullets = [], onAcceptSummary, onAcceptBullets, onAddSkills, onAtsUpdate }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [rewrites, setRewrites] = useState([]);
  const [skills, setSkills] = useState(null);
  const [ats, setAts] = useState(null);

  const call = async (fn, payload, onOk) => {
    try {
      setLoading(true);
      const res = await fn(payload);
      onOk(res.data);
      toast.success('AI ready');
    } catch (e) {
      console.error(e);
      toast.error('AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    call(aiAPI.generateSummary, { jobDescription: jobText || '', resumeText: resumeText || '', existingSummary: '' }, (d) => {
      try {
        const summaryText = d.summary || '';
        // Try to parse as JSON if it's a JSON string
        if (summaryText.startsWith('{') || summaryText.startsWith('[')) {
          const parsed = JSON.parse(summaryText);
          setSummary(parsed);
        } else {
          // If not JSON, create a simple summary object
          setSummary({ concise: summaryText, balanced: summaryText, detailed: summaryText });
        }
      } catch (e) {
        // If parsing fails, use as plain text
        setSummary({ concise: d.summary || '', balanced: d.summary || '', detailed: d.summary || '' });
      }
    });
  };
  
  const rewriteBullets = () => {
    call(aiAPI.rewriteBullets, { bullets: bullets || [], jobDescription: jobText || '' }, (d) => {
      try {
        const rewritesText = d.rewrites || '[]';
        const parsed = typeof rewritesText === 'string' ? JSON.parse(rewritesText) : rewritesText;
        setRewrites(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to parse rewrites:', e);
        setRewrites([]);
      }
    });
  };
  
  const suggestSkills = () => {
    call(aiAPI.suggestSkills, { jobDescription: jobText || '', resumeText: resumeText || '' }, (d) => {
      try {
        const skillsText = d.skills || '{}';
        const parsed = typeof skillsText === 'string' ? JSON.parse(skillsText) : skillsText;
        setSkills(parsed);
      } catch (e) {
        console.error('Failed to parse skills:', e);
        setSkills({ categories: [], clusters: [], synonyms: [] });
      }
    });
  };
  
  const atsScore = () => {
    call(aiAPI.atsScore, { jobDescription: jobText || '', resumeText: resumeText || '' }, (d) => {
      try {
        const atsText = d.ats || '{}';
        const parsed = typeof atsText === 'string' ? JSON.parse(atsText) : atsText;
        setAts(parsed);
        if (onAtsUpdate) onAtsUpdate(parsed);
      } catch (e) {
        console.error('Failed to parse ATS score:', e);
        setAts({ overallScore: 0, score: 0 });
      }
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">AI Features</h3>
        <div className="space-x-2">
          <button className="btn-secondary disabled:opacity-50" disabled={loading} onClick={generateSummary}>Generate Summary</button>
          <button className="btn-secondary disabled:opacity-50" disabled={loading} onClick={rewriteBullets}>Rewrite Bullets</button>
          <button className="btn-secondary disabled:opacity-50" disabled={loading} onClick={suggestSkills}>Suggest Skills</button>
          <button className="btn-secondary disabled:opacity-50" disabled={loading} onClick={atsScore}>ATS Score</button>
        </div>
      </div>

      {ats && <ATSProgressBar score={ats.overallScore || ats.score || 0} />}

      {summary && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Summary Variants</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['concise','balanced','detailed'].map((k) => (
              <SuggestionCard key={k} title={k} before={''} after={summary[k] || ''} onAccept={() => onAcceptSummary && onAcceptSummary(summary[k] || '')} />
            ))}
          </div>
        </div>
      )}

      {rewrites?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Bullet Optimizations</h4>
          <div className="space-y-3">
            {rewrites.map((r, i) => (
              <SuggestionCard key={i} title={`Bullet ${i+1}`} before={r.before} after={r.after} onAccept={() => onAcceptBullets && onAcceptBullets(i, r.after)} />
            ))}
          </div>
        </div>
      )}

      {skills && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Skill Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {(skills.categories || []).map((s) => (
              <button key={s} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm" onClick={() => onAddSkills && onAddSkills([s])}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


