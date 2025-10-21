import React, { useState, useEffect } from 'react';
import { Map, List, Filter, Plus, TrendingUp, MapPin, Route } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PipelineMap } from '../../components/maps/PipelineMap';
import { MapControls } from '../../components/maps/MapControls';
import { PipelineTable } from '../../components/maps/PipelineTable';
import { Pipeline, Facility } from '../../types';
import { pipelineAPI } from '../../utils/pipelineAPI';

export const PipelinePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFacilities, setShowFacilities] = useState(true);
  const [showPipelines, setShowPipelines] = useState(true);
  const [selectedPipelineType, setSelectedPipelineType] = useState<Pipeline['pipelineType']>();
  const [selectedStatus, setSelectedStatus] = useState<Pipeline['status']>();
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load facilities data (mock data for now)
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        // Mock facility data - in a real app, this would come from an API
        const mockFacilities: Facility[] = [
          { id: 'fac_en_cap_btr', companyId: 'cmp_energis', type: 'capture', lat: 30.45, lon: -91.19, name: 'Energis Baton Rouge Capture' },
          { id: 'fac_en_sto_lc', companyId: 'cmp_energis', type: 'storage', lat: 30.23, lon: -93.22, name: 'Energis Lake Charles Storage' },
          { id: 'fac_gc_cap_lc', companyId: 'cmp_gulfcem', type: 'capture', lat: 30.24, lon: -93.22, name: 'GulfCem Lake Charles Capture' },
          { id: 'fac_gc_utl_concrete', companyId: 'cmp_gulfcem', type: 'utilization', lat: 30.26, lon: -93.20, name: 'GulfCem Concrete Utilization' },
          { id: 'fac_bp_cap_alex', companyId: 'cmp_biopulp', type: 'capture', lat: 31.31, lon: -92.44, name: 'BioPulp Alexandria Capture' },
          { id: 'fac_bp_sto_cenla', companyId: 'cmp_biopulp', type: 'storage', lat: 31.29, lon: -92.48, name: 'BioPulp CenLA Storage' },
          { id: 'fac_bb_cap_laf', companyId: 'cmp_bayoubio', type: 'capture', lat: 30.22, lon: -92.02, name: 'BayouBio Lafayette Capture' },
          { id: 'fac_bb_utl_ethanol', companyId: 'cmp_bayoubio', type: 'utilization', lat: 30.24, lon: -92.00, name: 'BayouBio Ethanol Utilization' },
          { id: 'fac_dg_cap_houma', companyId: 'cmp_deltagas', type: 'capture', lat: 29.59, lon: -90.72, name: 'Delta Gas Houma Capture' },
          { id: 'fac_dg_sto_gulf', companyId: 'cmp_deltagas', type: 'storage', lat: 29.57, lon: -90.74, name: 'Delta Gulf Storage' },
          { id: 'fac_pc_cap_iberia', companyId: 'cmp_petrochem', type: 'capture', lat: 29.95, lon: -91.82, name: 'PetroChem Iberia Capture' },
          { id: 'fac_hub_sto_brx', companyId: 'cmp_energis', type: 'storage', lat: 29.9, lon: -90.2, name: 'Bayou Ridge Storage Hub' },
          { id: 'fac_sc_cap_iberville', companyId: 'cmp_sugarco', type: 'capture', lat: 30.28, lon: -91.32, name: 'Sugar Co Iberville Capture' },
          { id: 'fac_sc_utl_bioplastics', companyId: 'cmp_sugarco', type: 'utilization', lat: 30.30, lon: -91.30, name: 'Sugar Co Bioplastics' },
          { id: 'fac_rr_cap_norco', companyId: 'cmp_riverref', type: 'capture', lat: 30.00, lon: -90.41, name: 'RiverRefinery Norco Capture' },
          { id: 'fac_rr_sto_plaquemines', companyId: 'cmp_riverref', type: 'storage', lat: 29.73, lon: -89.98, name: 'RiverRef Storage Plaquemines' },
        ];
        setFacilities(mockFacilities);
      } catch (error) {
        console.error('Failed to load facilities:', error);
      }
    };

    loadFacilities();
  }, []);

  // Load pipelines data
  useEffect(() => {
    const loadPipelines = async () => {
      try {
        const allPipelines = await pipelineAPI.getAllPipelines();
        setPipelines(allPipelines);
      } catch (error) {
        console.error('Failed to load pipelines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPipelines();
  }, []);

  // Calculate pipeline statistics
  const pipelineStats = {
    total: pipelines.length,
    active: pipelines.filter(p => p.status === 'ACTIVE').length,
    planned: pipelines.filter(p => p.status === 'PLANNED').length,
    underConstruction: pipelines.filter(p => p.status === 'UNDER_CONSTRUCTION').length,
    totalCapacity: pipelines.reduce((sum, p) => sum + p.capacity, 0),
    totalLength: pipelines.reduce((sum, p) => sum + p.length, 0),
  };

  const handlePipelineSelect = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setViewMode('map'); // Switch to map view when a pipeline is selected
  };

  const clearFilters = () => {
    setSelectedPipelineType(undefined);
    setSelectedStatus(undefined);
    setSelectedPipeline(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#174B7A]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Route className="text-[#174B7A]" size={32} />
            Pipeline Infrastructure
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage CO₂ pipeline infrastructure across Louisiana
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {/* TODO: Implement add pipeline */}}
            className="bg-[#174B7A] hover:bg-[#1AAE9F] text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Pipeline
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pipelines</p>
              <p className="text-2xl font-bold text-gray-900">{pipelineStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Route className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Pipelines</p>
              <p className="text-2xl font-bold text-green-600">{pipelineStats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
              <p className="text-2xl font-bold text-blue-600">
                {(pipelineStats.totalCapacity / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">tons/year</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Length</p>
              <p className="text-2xl font-bold text-orange-600">
                {pipelineStats.totalLength.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">miles</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <MapPin className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setViewMode('map')}
            variant={viewMode === 'map' ? 'primary' : 'secondary'}
            className="flex items-center gap-2"
          >
            <Map size={16} />
            Map View
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            className="flex items-center gap-2"
          >
            <List size={16} />
            List View
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {(selectedPipelineType || selectedStatus) && (
            <Button
              onClick={clearFilters}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1">
          <MapControls
            showFacilities={showFacilities}
            showPipelines={showPipelines}
            selectedPipelineType={selectedPipelineType}
            selectedStatus={selectedStatus}
            onToggleFacilities={() => setShowFacilities(!showFacilities)}
            onTogglePipelines={() => setShowPipelines(!showPipelines)}
            onPipelineTypeChange={setSelectedPipelineType}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {/* Map/List Content */}
        <div className="lg:col-span-3">
          {viewMode === 'map' ? (
            <PipelineMap
              facilities={facilities}
              showFacilities={showFacilities}
              showPipelines={showPipelines}
              selectedPipelineType={selectedPipelineType}
              selectedStatus={selectedStatus}
            />
          ) : (
            <PipelineTable
              selectedPipelineType={selectedPipelineType}
              selectedStatus={selectedStatus}
              onPipelineSelect={handlePipelineSelect}
            />
          )}
        </div>
      </div>

      {/* Selected Pipeline Details */}
      {selectedPipeline && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pipeline Details</h3>
            <Button
              onClick={() => setSelectedPipeline(null)}
              variant="secondary"
              size="sm"
            >
              Close
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium text-gray-900">{selectedPipeline.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Operator</p>
              <p className="font-medium text-gray-900">{selectedPipeline.operator}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Type</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.pipelineType.replace('CO2_', '')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.status.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Capacity</p>
              <p className="font-medium text-green-600">
                {(selectedPipeline.capacity / 1000).toFixed(0)}K tons/year
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Length</p>
              <p className="font-medium text-blue-600">
                {selectedPipeline.length.toFixed(1)} miles
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Diameter</p>
              <p className="font-medium text-orange-600">
                {selectedPipeline.diameter.toFixed(0)} inches
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Route Points</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.routeCoordinates.length} coordinates
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
