// Pipeline API endpoints for Data 2.0 system
// These endpoints would typically be implemented in a backend API server

import { Pipeline } from '../types';

export interface PipelineAPI {
  // GET /api/pipelines - Get all pipelines
  getAllPipelines(): Promise<Pipeline[]>;
  
  // GET /api/pipelines/:id - Get specific pipeline
  getPipelineById(id: string): Promise<Pipeline | null>;
  
  // POST /api/pipelines - Create new pipeline (operator only)
  createPipeline(pipeline: Omit<Pipeline, 'id'>): Promise<Pipeline>;
  
  // PUT /api/pipelines/:id - Update pipeline (operator only)
  updatePipeline(id: string, pipeline: Partial<Pipeline>): Promise<Pipeline>;
  
  // DELETE /api/pipelines/:id - Delete pipeline (operator only)
  deletePipeline(id: string): Promise<void>;
  
  // GET /api/pipelines/by-status/:status - Get pipelines by status
  getPipelinesByStatus(status: Pipeline['status']): Promise<Pipeline[]>;
  
  // GET /api/pipelines/by-type/:type - Get pipelines by type
  getPipelinesByType(type: Pipeline['pipelineType']): Promise<Pipeline[]>;
  
  // GET /api/pipelines/by-operator/:operator - Get pipelines by operator
  getPipelinesByOperator(operator: string): Promise<Pipeline[]>;
}

// Mock implementation for frontend development
export class MockPipelineAPI implements PipelineAPI {
  private pipelines: Pipeline[] = [];

  constructor() {
    this.loadSampleData();
  }

  private async loadSampleData() {
    try {
      const response = await fetch('/data/pipelines.json');
      this.pipelines = await response.json();
    } catch (error) {
      console.error('Failed to load pipeline data:', error);
      this.pipelines = [];
    }
  }

  async getAllPipelines(): Promise<Pipeline[]> {
    return [...this.pipelines];
  }

  async getPipelineById(id: string): Promise<Pipeline | null> {
    return this.pipelines.find(p => p.id === id) || null;
  }

  async createPipeline(pipeline: Omit<Pipeline, 'id'>): Promise<Pipeline> {
    const newPipeline: Pipeline = {
      ...pipeline,
      id: `pipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    this.pipelines.push(newPipeline);
    return newPipeline;
  }

  async updatePipeline(id: string, updates: Partial<Pipeline>): Promise<Pipeline> {
    const index = this.pipelines.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Pipeline with id ${id} not found`);
    }
    this.pipelines[index] = { ...this.pipelines[index], ...updates };
    return this.pipelines[index];
  }

  async deletePipeline(id: string): Promise<void> {
    const index = this.pipelines.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Pipeline with id ${id} not found`);
    }
    this.pipelines.splice(index, 1);
  }

  async getPipelinesByStatus(status: Pipeline['status']): Promise<Pipeline[]> {
    return this.pipelines.filter(p => p.status === status);
  }

  async getPipelinesByType(type: Pipeline['pipelineType']): Promise<Pipeline[]> {
    return this.pipelines.filter(p => p.pipelineType === type);
  }

  async getPipelinesByOperator(operator: string): Promise<Pipeline[]> {
    return this.pipelines.filter(p => p.operator === operator);
  }
}

// Export singleton instance
export const pipelineAPI = new MockPipelineAPI();

// Pipeline utility functions
export const getPipelineTypeColor = (type: Pipeline['pipelineType']): string => {
  const colors = {
    'CO2_TRANSPORT': '#3B82F6', // Blue
    'CO2_STORAGE': '#10B981',   // Green
    'CO2_UTILIZATION': '#F59E0B', // Orange
    'CO2_INJECTION': '#8B5CF6'   // Purple
  };
  return colors[type] || '#6B7280';
};

export const getPipelineStatusColor = (status: Pipeline['status']): string => {
  const colors = {
    'ACTIVE': '#10B981',           // Green
    'PLANNED': '#F59E0B',         // Orange
    'UNDER_CONSTRUCTION': '#3B82F6', // Blue
    'INACTIVE': '#6B7280'          // Gray
  };
  return colors[status] || '#6B7280';
};

export const formatPipelineCapacity = (capacity: number): string => {
  if (capacity >= 1000000) {
    return `${(capacity / 1000000).toFixed(1)}M`;
  } else if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(0)}K`;
  }
  return capacity.toString();
};

export const formatPipelineLength = (length: number): string => {
  return `${length.toFixed(1)} mi`;
};

export const formatPipelineDiameter = (diameter: number): string => {
  return `${diameter.toFixed(0)}"`;
};

