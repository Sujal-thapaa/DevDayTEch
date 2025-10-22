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
    <Card className="p-5 space-y-5 border-l-4 border-l-green-500">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Map Controls</h3>
      
      {/* Layer Toggles */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Layers</h4>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={showFacilities}
              onChange={onToggleFacilities}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 font-medium">Show Facilities</span>
          </label>

          <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={showPipelines}
              onChange={onTogglePipelines}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 font-medium">Show Pipelines</span>
          </label>
        </div>
      </div>

      {/* Pipeline Type Filter */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Filter by Type</h4>
        <div className="space-y-2">
          <button
            onClick={() => onPipelineTypeChange(undefined)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              !selectedPipelineType
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            All Pipeline Types
          </button>
          {pipelineTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onPipelineTypeChange(type.value)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                selectedPipelineType === type.value
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: type.color }}
              ></div>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Legend</h4>
        
        <div className="space-y-2.5">
          {pipelineTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: type.color }}
              ></div>
              <span className="text-sm text-gray-700 font-medium">{type.label}</span>
            </div>
          ))}
          
          <div className="pt-2 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-400"></div>
              <span>Source Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white border-2 border-gray-400"></div>
              <span>Destination Point</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

