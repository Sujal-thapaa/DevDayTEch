import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import { Pipeline } from '../../types';
import { pipelineAPI, getPipelineTypeColor, getPipelineStatusColor, formatPipelineCapacity, formatPipelineLength, formatPipelineDiameter } from '../../utils/pipelineAPI';

interface PipelineTableProps {
  selectedPipelineType?: Pipeline['pipelineType'];
  selectedStatus?: Pipeline['status'];
  onPipelineSelect?: (pipeline: Pipeline) => void;
}

export const PipelineTable: React.FC<PipelineTableProps> = ({
  selectedPipelineType,
  selectedStatus,
  onPipelineSelect
}) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Pipeline>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Filter pipelines based on selected criteria
  const filteredPipelines = pipelines.filter(pipeline => {
    if (selectedPipelineType && pipeline.pipelineType !== selectedPipelineType) return false;
    if (selectedStatus && pipeline.status !== selectedStatus) return false;
    return true;
  });

  // Sort pipelines
  const sortedPipelines = [...filteredPipelines].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof Pipeline) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPipelineTypeBadge = (type: Pipeline['pipelineType']) => {
    const color = getPipelineTypeColor(type);
    return (
      <Badge 
        style={{ 
          backgroundColor: color, 
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold'
        }}
      >
        {type.replace('CO2_', '')}
      </Badge>
    );
  };

  const getStatusBadge = (status: Pipeline['status']) => {
    const color = getPipelineStatusColor(status);
    return (
      <Badge 
        style={{ 
          backgroundColor: color, 
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold'
        }}
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const columns = [
    {
      header: 'Pipeline Name',
      accessor: 'name',
      cell: (value: string, row: Pipeline) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.id}</div>
        </div>
      )
    },
    {
      header: 'Operator',
      accessor: 'operator'
    },
    {
      header: 'Type',
      accessor: 'pipelineType',
      cell: (value: Pipeline['pipelineType']) => getPipelineTypeBadge(value)
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      cell: (value: number) => (
        <div className="text-sm font-medium text-green-600">
          {formatPipelineCapacity(value)} tons/year
        </div>
      )
    },
    {
      header: 'Length',
      accessor: 'length',
      cell: (value: number) => (
        <div className="text-sm text-blue-600">
          {formatPipelineLength(value)}
        </div>
      )
    },
    {
      header: 'Diameter',
      accessor: 'diameter',
      cell: (value: number) => (
        <div className="text-sm text-orange-600">
          {formatPipelineDiameter(value)}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: Pipeline['status']) => getStatusBadge(value)
    }
  ];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#174B7A]"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pipeline Infrastructure</h3>
        <div className="text-sm text-gray-500">
          {sortedPipelines.length} of {pipelines.length} pipelines
        </div>
      </div>

      <Table 
        columns={columns}
        data={sortedPipelines}
        onRowClick={onPipelineSelect}
      />
    </Card>
  );
};
