import React from 'react';

export default function ATSProgressBar({ score = 0 }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">ATS Score</span>
        <span className="text-sm font-medium">{score}</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded">
        <div className={`h-3 ${color} rounded`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
    </div>
  );
}


