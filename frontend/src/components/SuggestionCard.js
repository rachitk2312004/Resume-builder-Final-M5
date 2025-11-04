import React from 'react';

export default function SuggestionCard({ title, before, after, onAccept }) {
  return (
    <div className="border rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-medium text-sm">{title}</h5>
        <button className="btn-secondary" onClick={onAccept}>Accept</button>
      </div>
      {before !== undefined && before !== '' && (
        <div className="text-xs text-gray-600 line-through mb-2 whitespace-pre-wrap">{before}</div>
      )}
      <div className="text-sm whitespace-pre-wrap">{after}</div>
    </div>
  );
}


