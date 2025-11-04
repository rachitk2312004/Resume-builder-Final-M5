import React, { useState } from 'react';
import { ocrAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function JobUpload({ onParsed }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const res = await ocrAPI.upload(file);
      onParsed(res.data);
      setConfidence(res.data.confidence);
      toast.success(`Job description parsed${res.data.confidence ? ` (Confidence: ${(res.data.confidence * 100).toFixed(1)}%)` : ''}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to parse JD');
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  };

  const onParseText = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await aiAPI.parseJob(text);
      onParsed(res.data);
      toast.success('Job description analyzed');
    } catch (e) {
      console.error(e);
      toast.error('Failed to analyze JD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
        <label className="btn-secondary cursor-pointer">
          Upload Image/PDF
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={onFile} />
        </label>
      </div>
      <textarea
        className="w-full border rounded-md p-3 text-sm"
        rows={6}
        placeholder="Paste job description text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {confidence !== null && (
        <div className="mt-2 text-xs text-gray-600">
          OCR Confidence: {(confidence * 100).toFixed(1)}%
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <button className="btn-secondary disabled:opacity-50" disabled={loading} onClick={onParseText}>
          Analyze Text
        </button>
      </div>
    </div>
  );
}


