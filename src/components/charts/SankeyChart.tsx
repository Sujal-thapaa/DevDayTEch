import React from 'react';

export const SankeyChart: React.FC = () => {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
      <svg width="600" height="240" viewBox="0 0 600 240">
        <defs>
          <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#174B7A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1AAE9F" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1AAE9F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3A7BF7" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path
          d="M 100 80 C 250 80, 250 60, 400 60 L 400 100 C 250 100, 250 120, 100 120 Z"
          fill="url(#flow1)"
          opacity="0.7"
        />

        <path
          d="M 100 140 C 250 140, 250 140, 400 140 L 400 180 C 250 180, 250 180, 100 180 Z"
          fill="url(#flow2)"
          opacity="0.7"
        />

        <rect x="80" y="60" width="40" height="140" fill="#174B7A" rx="4" />
        <rect x="380" y="40" width="40" height="80" fill="#1AAE9F" rx="4" />
        <rect x="380" y="130" width="40" height="60" fill="#3A7BF7" rx="4" />

        <text x="100" y="30" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
          Captured
        </text>
        <text x="100" y="45" textAnchor="middle" className="text-xs fill-gray-600">
          24,956 t
        </text>

        <text x="400" y="25" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
          Injected
        </text>
        <text x="400" y="40" textAnchor="middle" className="text-xs fill-gray-600">
          23,782 t
        </text>

        <text x="400" y="220" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
          Utilized
        </text>
        <text x="400" y="235" textAnchor="middle" className="text-xs fill-gray-600">
          6,250 t
        </text>
      </svg>
    </div>
  );
};
