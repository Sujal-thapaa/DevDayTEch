import React from 'react';

interface BenchmarkChartProps {
  you: number;
  sectorMedian: number;
  topQuartile: number;
}

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  you,
  sectorMedian,
  topQuartile,
}) => {
  const max = Math.max(you, sectorMedian, topQuartile);

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Your Performance</span>
            <span className="text-sm font-bold text-[#174B7A]">{you}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="bg-[#174B7A] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${(you / max) * 100}%` }}
            >
              <span className="text-white text-xs font-semibold">{you}%</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Sector Median</span>
            <span className="text-sm font-semibold text-gray-600">{sectorMedian}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gray-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(sectorMedian / max) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Top Quartile</span>
            <span className="text-sm font-semibold text-[#1AAE9F]">{topQuartile}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-[#1AAE9F] h-full rounded-full transition-all duration-500"
              style={{ width: `${(topQuartile / max) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Analysis:</span> You are performing{' '}
          <span className="font-bold text-[#174B7A]">
            {(you - sectorMedian).toFixed(1)}%
          </span>{' '}
          above the sector median. To reach top quartile, improve by{' '}
          <span className="font-bold text-[#1AAE9F]">
            {(topQuartile - you).toFixed(1)}%
          </span>
          .
        </p>
      </div>
    </div>
  );
};
