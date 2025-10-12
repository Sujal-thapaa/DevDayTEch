import React, { useState } from 'react';
import { Map, Filter, Download, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { mockIncidents } from '../../data/mockData';

interface IncidentsPageProps {
  isDataLoaded: boolean;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ isDataLoaded }) => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Incident Data Available</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Upload emissions data to track and manage facility incidents and safety alerts.
        </p>
      </div>
    );
  }

  const incidentColumns = [
    { header: 'Facility', accessor: 'facility' },
    { header: 'Date', accessor: 'date' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Severity',
      accessor: 'severity',
      cell: (value: string) => (
        <Badge
          variant={
            value === 'critical'
              ? 'error'
              : value === 'high'
              ? 'error'
              : value === 'medium'
              ? 'warning'
              : 'info'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <Badge
          variant={
            value === 'resolved'
              ? 'success'
              : value === 'investigating'
              ? 'warning'
              : 'neutral'
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  const selectedIncidentData = mockIncidents.find(
    (i) => i.id === selectedIncident
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Center</h1>
          <p className="text-gray-600 mt-1">
            Track and manage operational incidents across all facilities
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'map' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map size={16} className="mr-1" />
            Map View
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 items-end">
          <Select
            label="Facility"
            options={[
              { value: 'all', label: 'All Facilities' },
              { value: 'port-allen', label: 'Port Allen Ethanol' },
              { value: 'geismar', label: 'Geismar Ammonia' },
              { value: 'st-james', label: 'St. James Industrial' },
            ]}
          />
          <Select
            label="Severity"
            options={[
              { value: 'all', label: 'All Severities' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
          />
          <Select
            label="Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'investigating', label: 'Investigating' },
              { value: 'resolved', label: 'Resolved' },
            ]}
          />
          <Button variant="secondary" size="md">
            <Filter size={16} className="mr-1" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {viewMode === 'table' ? (
        <Card>
          <Table
            columns={incidentColumns}
            data={mockIncidents}
            onRowClick={(row) => setSelectedIncident(row.id)}
          />
        </Card>
      ) : (
        <Card className="p-6">
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 400"
              className="absolute inset-0"
            >
              <rect width="800" height="400" fill="#E5E7EB" />
              <path
                d="M 100 300 Q 150 250, 200 280 L 250 260 L 300 290 L 400 270 L 500 300 L 600 280 L 700 290"
                stroke="#9CA3AF"
                strokeWidth="2"
                fill="none"
              />

              {mockIncidents.map((incident, idx) => {
                const x = 150 + idx * 200;
                const y = 180 + idx * 40;
                return (
                  <g key={incident.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r={
                        incident.severity === 'high'
                          ? 20
                          : incident.severity === 'medium'
                          ? 15
                          : 10
                      }
                      fill={
                        incident.severity === 'high'
                          ? '#D64545'
                          : incident.severity === 'medium'
                          ? '#E9A23B'
                          : '#3A7BF7'
                      }
                      opacity="0.7"
                      className="cursor-pointer hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedIncident(incident.id)}
                    />
                    <text
                      x={x}
                      y={y + 40}
                      textAnchor="middle"
                      className="text-xs fill-gray-700"
                    >
                      {incident.facility.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="mt-4 flex gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#D64545]"></div>
              <span className="text-sm text-gray-700">High Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#E9A23B]"></div>
              <span className="text-sm text-gray-700">Medium Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3A7BF7]"></div>
              <span className="text-sm text-gray-700">Low Severity</span>
            </div>
          </div>
        </Card>
      )}

      {selectedIncidentData && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Incident Details
            </h2>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Facility</span>
                <p className="text-base text-gray-900">
                  {selectedIncidentData.facility}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Date & Time</span>
                <p className="text-base text-gray-900">
                  {selectedIncidentData.date}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Type</span>
                <p className="text-base text-gray-900">
                  {selectedIncidentData.type}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Severity</span>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedIncidentData.severity === 'high'
                        ? 'error'
                        : selectedIncidentData.severity === 'medium'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    {selectedIncidentData.severity}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Status</span>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedIncidentData.status === 'resolved'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {selectedIncidentData.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Description</span>
                <p className="text-base text-gray-900 mt-1">
                  {selectedIncidentData.description}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Location Coordinates
                </span>
                <p className="text-base text-gray-900 mt-1">
                  {selectedIncidentData.lat.toFixed(4)},{' '}
                  {selectedIncidentData.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="primary" size="sm">
                  Update Status
                </Button>
                <Button variant="outline" size="sm">
                  Add Note
                </Button>
                <Button variant="outline" size="sm">
                  Attach File
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
