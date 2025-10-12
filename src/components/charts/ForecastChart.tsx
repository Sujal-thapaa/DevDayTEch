import React from 'react';
import { ForecastData } from '../../types';

interface ForecastChartProps {
  data: ForecastData[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.confidenceHigh || d.predicted));
  const minValue = Math.min(...data.map((d) => d.confidenceLow || d.predicted));
  const range = maxValue - minValue;

  const getY = (value: number) => {
    return 100 - ((value - minValue) / range) * 80;
  };

  return (
    <div className="w-full h-80 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3A7BF7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3A7BF7" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {data.map((point, idx) => {
          if (!point.confidenceLow || !point.confidenceHigh) return null;
          const x = (idx / (data.length - 1)) * 800;
          const yHigh = getY(point.confidenceHigh);
          const yLow = getY(point.confidenceLow);
          const nextPoint = data[idx + 1];
          if (!nextPoint) return null;
          const nextX = ((idx + 1) / (data.length - 1)) * 800;
          const nextYHigh = getY(nextPoint.confidenceHigh || 0);
          const nextYLow = getY(nextPoint.confidenceLow || 0);

          return (
            <polygon
              key={`conf-${idx}`}
              points={`${x},${yHigh} ${nextX},${nextYHigh} ${nextX},${nextYLow} ${x},${yLow}`}
              fill="url(#confidenceGradient)"
            />
          );
        })}

        <polyline
          points={data
            .filter((d) => d.actual > 0)
            .map((d, idx) => {
              const x = (idx / (data.length - 1)) * 800;
              const y = getY(d.actual);
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#174B7A"
          strokeWidth="3"
        />

        <polyline
          points={data
            .map((d, idx) => {
              const x = (idx / (data.length - 1)) * 800;
              const y = getY(d.predicted);
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#1AAE9F"
          strokeWidth="3"
          strokeDasharray="8 4"
        />

        {data.map((point, idx) => {
          if (point.actual === 0) return null;
          const x = (idx / (data.length - 1)) * 800;
          const y = getY(point.actual);
          return (
            <circle key={`actual-${idx}`} cx={x} cy={y} r="5" fill="#174B7A" />
          );
        })}

        {data.map((point, idx) => {
          const x = (idx / (data.length - 1)) * 800;
          const y = getY(point.predicted);
          return (
            <circle key={`pred-${idx}`} cx={x} cy={y} r="5" fill="#1AAE9F" />
          );
        })}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
        {data.map((d, idx) => (
          <span key={idx}>{d.date}</span>
        ))}
      </div>

      <div className="absolute top-4 right-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#174B7A]"></div>
          <span className="text-gray-700">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#1AAE9F] border-dashed border-t-2 border-[#1AAE9F]"></div>
          <span className="text-gray-700">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-[#3A7BF7] opacity-20"></div>
          <span className="text-gray-700">Confidence Band</span>
        </div>
      </div>
    </div>
  );
};
