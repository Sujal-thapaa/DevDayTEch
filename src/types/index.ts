export interface KPIData {
  label: string;
  value: number;
  unit: string;
  change: number;
  period: 'today' | 'mtd' | 'ytd';
}

export interface ForecastData {
  date: string;
  actual: number;
  predicted: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export interface Anomaly {
  id: string;
  facility: string;
  date: string;
  metric: string;
  deviation: number;
  confidence: number;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  impact: string;
  confidence: number;
}

export interface ScenarioInputs {
  purity: number;
  distance: number;
  injectionFee: number;
  capex: number;
  opex: number;
  credit45Q: number;
  transportMode: 'pipeline' | 'truck' | 'rail';
}

export interface ScenarioOutputs {
  lcoc: number;
  payback: number;
  npv: number;
}

export interface Incident {
  id: string;
  facility: string;
  date: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  lat: number;
  lng: number;
}

export type AppView = 'operator' | 'public';
export type OperatorPage = 'home' | 'analysis' | 'reports' | 'incidents' | 'roi' | 'market' | 'data-entry' | 'settings';
export type PublicPage = 'home' | 'explore' | 'economy' | 'alerts' | 'bridge';
