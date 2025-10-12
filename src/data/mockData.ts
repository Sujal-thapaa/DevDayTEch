import { KPIData, ForecastData, Anomaly, Recommendation, Incident } from '../types';

export const mockKPIs: KPIData[] = [
  { label: 'Captured', value: 1247.8, unit: 'tCO₂', change: 5.2, period: 'today' },
  { label: 'Injected', value: 1189.3, unit: 'tCO₂', change: 4.8, period: 'today' },
  { label: 'Utilized', value: 312.5, unit: 'tCO₂', change: 12.3, period: 'today' },
  { label: 'Shipped', value: 156.7, unit: 'tCO₂', change: -2.1, period: 'today' },
];

export const mockMTDKPIs: KPIData[] = [
  { label: 'Captured', value: 24956, unit: 'tCO₂', change: 8.4, period: 'mtd' },
  { label: 'Injected', value: 23782, unit: 'tCO₂', change: 7.9, period: 'mtd' },
  { label: 'Utilized', value: 6250, unit: 'tCO₂', change: 15.2, period: 'mtd' },
  { label: 'Shipped', value: 3134, unit: 'tCO₂', change: 3.4, period: 'mtd' },
];

export const mockComplianceReadiness = 94.7;
export const mockMassBalanceDelta = -58.5;

export const mockForecastData: ForecastData[] = [
  { date: '2025-07', actual: 24956, predicted: 25100, confidenceLow: 24500, confidenceHigh: 25700 },
  { date: '2025-08', actual: 26234, predicted: 26200, confidenceLow: 25600, confidenceHigh: 26800 },
  { date: '2025-09', actual: 27891, predicted: 27500, confidenceLow: 26900, confidenceHigh: 28100 },
  { date: '2025-10', actual: 28456, predicted: 28800, confidenceLow: 28200, confidenceHigh: 29400 },
  { date: '2025-11', actual: 0, predicted: 30200, confidenceLow: 29500, confidenceHigh: 30900 },
  { date: '2025-12', actual: 0, predicted: 31500, confidenceLow: 30700, confidenceHigh: 32300 },
  { date: '2026-Q1', actual: 0, predicted: 95400, confidenceLow: 93000, confidenceHigh: 97800 },
];

export const mockPredictionKPIs = {
  nextMonth: 30200,
  nextQuarter: 95400,
  roiImpact: 8.7,
  confidence: 87.3,
  modelVersion: 'v2.4.1',
};

export const mockAnomalies: Anomaly[] = [
  {
    id: 'an-001',
    facility: 'Port Allen Ethanol',
    date: '2025-10-08',
    metric: 'Capture Rate',
    deviation: -12.4,
    confidence: 92.1,
    suggestion: 'Check amine circulation pump pressure',
    severity: 'medium',
  },
  {
    id: 'an-002',
    facility: 'Geismar Ammonia',
    date: '2025-10-09',
    metric: 'Purity',
    deviation: -3.2,
    confidence: 88.5,
    suggestion: 'Verify dehydration unit performance',
    severity: 'low',
  },
  {
    id: 'an-003',
    facility: 'St. James Industrial',
    date: '2025-10-10',
    metric: 'Injection Pressure',
    deviation: 18.7,
    confidence: 95.8,
    suggestion: 'Inspect wellhead integrity - possible blockage',
    severity: 'high',
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-001',
    title: 'Optimize Capture at Port Allen during off-peak hours',
    rationale: 'Model predicts 15% efficiency gain by shifting 30% of capture operations to 10pm-6am when ambient temperature is lower',
    impact: '$47K annual savings',
    confidence: 89.2,
  },
  {
    id: 'rec-002',
    title: 'Switch transport mode for St. James to Pipeline',
    rationale: 'Current truck logistics cost $12.40/tCO₂. Pipeline route available with estimated cost $8.20/tCO₂',
    impact: '$31K annual savings',
    confidence: 94.5,
  },
  {
    id: 'rec-003',
    title: 'Increase purity target to 99.2% at Geismar',
    rationale: '45Q credit tier threshold at 99%. Current 98.7% purity results in lower credit bracket',
    impact: '$124K annual revenue increase',
    confidence: 91.8,
  },
];

export const mockBenchmarkData = {
  you: 87.3,
  sectorMedian: 82.1,
  topQuartile: 91.5,
};

export const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    facility: 'Port Allen Ethanol',
    date: '2025-10-05',
    type: 'Equipment Malfunction',
    severity: 'medium',
    description: 'Amine reboiler pressure spike detected and auto-shutdown triggered',
    status: 'resolved',
    lat: 30.4515,
    lng: -91.2108,
  },
  {
    id: 'inc-002',
    facility: 'Geismar Ammonia',
    date: '2025-10-07',
    type: 'Process Deviation',
    severity: 'low',
    description: 'CO₂ purity dropped below target for 2 hours during maintenance window',
    status: 'resolved',
    lat: 30.2386,
    lng: -90.9954,
  },
  {
    id: 'inc-003',
    facility: 'St. James Industrial',
    date: '2025-10-10',
    type: 'Injection Anomaly',
    severity: 'high',
    description: 'Wellhead pressure exceeding normal range - investigation ongoing',
    status: 'investigating',
    lat: 30.0471,
    lng: -90.8065,
  },
];

export const mockTasks = [
  { id: 't-001', title: 'Review Q3 Compliance Report', priority: 'high', dueDate: '2025-10-15' },
  { id: 't-002', title: 'Validate Port Allen meter calibration', priority: 'medium', dueDate: '2025-10-18' },
  { id: 't-003', title: 'Schedule pipeline integrity test', priority: 'low', dueDate: '2025-10-25' },
];

export const mockAlerts = [
  { id: 'a-001', message: 'St. James injection pressure anomaly detected', severity: 'high', timestamp: '2025-10-10 14:32' },
  { id: 'a-002', message: '45Q credit quarterly filing due in 5 days', severity: 'medium', timestamp: '2025-10-10 09:00' },
];
