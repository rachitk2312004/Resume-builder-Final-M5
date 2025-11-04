import React, { useEffect, useState } from 'react';
import { settingsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function SettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [allowExternal, setAllowExternal] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsAPI.getAi();
        setAllowExternal(Boolean(res.data.allowExternalAi));
      } catch (e) {
        // default stays true
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    try {
      await settingsAPI.setAi(allowExternal);
      toast.success('Settings updated');
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Privacy & AI Settings</h3>
      <p className="text-sm text-gray-600 mb-4">{allowExternal ? 'Your data is processed securely using OpenAI API.' : 'External AI disabled. Local models will be used.'}</p>
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={allowExternal} disabled={loading} onChange={(e) => setAllowExternal(e.target.checked)} />
        <span>Allow external AI API requests</span>
      </label>
      <div className="mt-3">
        <button className="btn-secondary" disabled={loading} onClick={save}>Save</button>
      </div>
    </div>
  );
}


