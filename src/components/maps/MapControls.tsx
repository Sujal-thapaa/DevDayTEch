import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Pipeline } from '../../types';
import { getPipelineTypeColor, getPipelineStatusColor } from '../../utils/pipelineAPI';

interface MapControlsProps {
  showFacilities: boolean;
  showPipelines: boolean;
  selectedPipelineType?: Pipeline['pipelineType'];
  onToggleFacilities: () => void;
  onTogglePipelines: () => void;
  onPipelineTypeChange: (type: Pipeline['pipelineType'] | undefined) => void;
}

const pipelineTypes: { value: Pipeline['pipelineType']; label: string; color: string }[] = [
  { value: 'CO2_TRANSPORT', label: 'Transport', color: '#3B82F6' },
  { value: 'CO2_STORAGE', label: 'Storage', color: '#10B981' },
  { value: 'CO2_UTILIZATION', label: 'Utilization', color: '#F59E0B' },
  { value: 'CO2_INJECTION', label: 'Injection', color: '#8B5CF6' },
];


export const MapControls: React.FC<MapControlsProps> = ({
  showFacilities,
  showPipelines,
  selectedPipelineType,
  onToggleFacilities,
  onTogglePipelines,
  onPipelineTypeChange,
}) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Map Controls</h3>
      
      {/* Layer Toggles */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Layers</h4>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFacilities}
              onChange={onToggleFacilities}
              className="w-4 h-4 text-[#174B7A] bg-gray-100 border-gray-300 rounded focus:ring-[#1AAE9F] focus:ring-2"
            />
            <span className="text-sm text-gray-700">Facilities</span>
          </label>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Markers</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPipelines}
              onChange={onTogglePipelines}
              className="w-4 h-4 text-[#174B7A] bg-gray-100 border-gray-300 rounded focus:ring-[#1AAE9F] focus:ring-2"
            />
            <span className="text-sm text-gray-700">Pipelines</span>
          </label>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Lines</span>
          </div>
        </div>
      </div>

      {/* Pipeline Type Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Pipeline Type</h4>
        <div className="space-y-2">
          <button
            onClick={() => onPipelineTypeChange(undefined)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              !selectedPipelineType
                ? 'bg-[#174B7A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          {pipelineTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onPipelineTypeChange(type.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                selectedPipelineType === type.value
                  ? 'bg-[#174B7A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type.color }}
              ></div>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">Legend</h4>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-600 mb-2">Pipeline Types:</div>
          {pipelineTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type.color }}
              ></div>
              <span className="text-xs text-gray-600">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

