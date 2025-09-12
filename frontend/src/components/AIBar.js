import React, { useState } from 'react';
import { Wand2, Sparkles, Brain, FileUp } from 'lucide-react';
import { aiAPI, ocrAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function AIBar({ resumeData, onApplyAI }) {
  const [loading, setLoading] = useState(false);

  const callAI = async (type) => {
    try {
      setLoading(true);
      const payload = { prompt: JSON.stringify(resumeData).slice(0, 6000) };
      let res;
      if (type === 'summary') res = await aiAPI.summary(payload);
      if (type === 'skills') res = await aiAPI.skills(payload);
      if (type === 'ats') res = await aiAPI.atsOptimize(payload);
      onApplyAI(type, res.data);
      toast.success('AI suggestion ready');
    } catch (e) {
      console.error(e);
      toast.error('AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOCR = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const res = await ocrAPI.parseJD(file);
      onApplyAI('ocr', res.data);
      toast.success('JD parsed');
    } catch (e) {
      console.error(e);
      toast.error('OCR failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button disabled={loading} onClick={() => callAI('summary')} className="btn-secondary disabled:opacity-50">
          <Wand2 className="w-4 h-4 mr-2" /> Generate Summary
        </button>
        <button disabled={loading} onClick={() => callAI('skills')} className="btn-secondary disabled:opacity-50">
          <Sparkles className="w-4 h-4 mr-2" /> Suggest Skills (ATS)
        </button>
        <button disabled={loading} onClick={() => callAI('ats')} className="btn-secondary disabled:opacity-50">
          <Brain className="w-4 h-4 mr-2" /> Improve for ATS
        </button>
        <label className="btn-secondary cursor-pointer">
          <FileUp className="w-4 h-4 mr-2" /> Upload JD (OCR)
          <input type="file" accept="image/*" className="hidden" onChange={handleOCR} />
        </label>
      </div>
    </div>
  );
}


