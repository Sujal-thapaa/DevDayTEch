import React, { useState } from 'react';
import {
  Download,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Database,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select, Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { BenchmarkChart } from '../../components/charts/BenchmarkChart';
import {
  mockForecastData,
  mockPredictionKPIs,
  mockAnomalies,
  mockRecommendations,
  mockBenchmarkData,
} from '../../data/mockData';
import { OperatorPage } from '../../types';

interface AnalysisPageProps {
  onNavigate: (page: OperatorPage) => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onNavigate }) => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [dateRange, setDateRange] = useState('6m');
  const [metric, setMetric] = useState('captured');
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);
  const [scenarioInputs, setScenarioInputs] = useState({
    purity: 99.0,
    distance: 45,
    injectionFee: 15,
    capex: 5000000,
    opex: 850000,
    credit45Q: 85,
    transportMode: 'pipeline',
  });

  const calculateScenarioOutputs = () => {
    const lcoc = (scenarioInputs.opex + scenarioInputs.capex * 0.1) / 25000;
    const payback = scenarioInputs.capex / (scenarioInputs.credit45Q * 25000);
    const npv =
      (scenarioInputs.credit45Q * 25000 * 10 - scenarioInputs.opex * 10 - scenarioInputs.capex) /
      1000000;

    return {
      lcoc: lcoc.toFixed(2),
      payback: payback.toFixed(1),
      npv: npv.toFixed(2),
    };
  };

  const outputs = calculateScenarioOutputs();

  const anomalyColumns = [
    {
      header: 'Facility',
      accessor: 'facility',
      cell: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    { header: 'Date', accessor: 'date' },
    { header: 'Metric', accessor: 'metric' },
    {
      header: 'Deviation',
      accessor: 'deviation',
      cell: (value: number) => (
        <span
          className={`font-semibold ${
            value < 0 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {value > 0 ? '+' : ''}
          {value}%
        </span>
      ),
    },
    {
      header: 'Confidence',
      accessor: 'confidence',
      cell: (value: number) => (
        <Badge variant={value > 90 ? 'success' : value > 80 ? 'info' : 'warning'}>
          {value}%
        </Badge>
      ),
    },
    {
      header: 'Severity',
      accessor: 'severity',
      cell: (value: string) => (
        <Badge
          variant={
            value === 'high' ? 'error' : value === 'medium' ? 'warning' : 'info'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: string, row: any) => (
        <button
          onClick={() =>
            setExpandedAnomaly(expandedAnomaly === value ? null : value)
          }
          className="text-[#174B7A] hover:text-[#0f3350] font-medium text-sm"
        >
          {expandedAnomaly === value ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      ),
    },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/image/bg.jpg)' }}
    >
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis & Prediction</h1>
          <p className="text-gray-600 mt-1">
            AI-powered forecasting and performance optimization
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md">
            <Download size={18} className="mr-2" />
            Export Report
          </Button>
          <Button variant="accent" size="md">
            <RefreshCw size={18} className="mr-2" />
            Sync with Engine
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-4">
          <Select
            label="Facilities"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            options={[
              { value: 'all', label: 'All Facilities' },
              { value: 'port-allen', label: 'Port Allen Ethanol' },
              { value: 'geismar', label: 'Geismar Ammonia' },
              { value: 'st-james', label: 'St. James Industrial' },
            ]}
          />
          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '3m', label: 'Last 3 Months' },
              { value: '6m', label: 'Last 6 Months' },
              { value: '12m', label: 'Last 12 Months' },
              { value: 'ytd', label: 'Year to Date' },
            ]}
          />
          <Select
            label="Metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            options={[
              { value: 'captured', label: 'CO₂ Captured' },
              { value: 'injected', label: 'CO₂ Injected' },
              { value: 'utilized', label: 'CO₂ Utilized' },
              { value: 'shipped', label: 'CO₂ Shipped' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">
            Predicted Next Month
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1AAE9F]">
              {mockPredictionKPIs.nextMonth.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">tCO₂</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">
            Predicted Next Quarter
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1AAE9F]">
              {mockPredictionKPIs.nextQuarter.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">tCO₂</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">
            ROI Impact
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              +{mockPredictionKPIs.roiImpact}%
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">
            Confidence
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {mockPredictionKPIs.confidence}%
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">
            Model Version
          </span>
          <Badge variant="info" size="md">
            {mockPredictionKPIs.modelVersion}
          </Badge>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Forecast: Actual vs Predicted
        </h2>
        <ForecastChart data={mockForecastData} />
        <p className="text-xs text-gray-600 mt-4">
          Confidence bands represent 95% prediction intervals. Model trained on 24 months of
          historical data with R² = 0.94.
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Detected Anomalies</h2>
          <Badge variant="warning" size="md">
            {mockAnomalies.length} Active
          </Badge>
        </div>
        <Table columns={anomalyColumns} data={mockAnomalies} />
        {expandedAnomaly && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Suggested Action</h3>
            <p className="text-sm text-gray-700 mb-3">
              {
                mockAnomalies.find((a) => a.id === expandedAnomaly)
                  ?.suggestion
              }
            </p>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">
                Create Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('incidents')}
              >
                View in Incident Center
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Benchmark
        </h2>
        <BenchmarkChart {...mockBenchmarkData} />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          AI Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#174B7A] transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {rec.title}
                </h3>
                <Badge
                  variant={rec.confidence > 90 ? 'success' : 'info'}
                  size="sm"
                >
                  {rec.confidence}%
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-3">{rec.rationale}</p>
              <div className="mb-3">
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                  {rec.impact}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  <CheckCircle size={14} className="mr-1" />
                  Apply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('roi')}
                >
                  <ExternalLink size={14} className="mr-1" />
                  ROI
                </Button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Scenario Simulator
            </h2>
            <p className="text-sm text-gray-600">
              Model projected outcomes based on operational parameters
            </p>
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={() => onNavigate('roi')}
          >
            Open Full ROI Calculator
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Input Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Purity (%)"
                type="number"
                value={scenarioInputs.purity}
                onChange={(e) =>
                  setScenarioInputs({
                    ...scenarioInputs,
                    purity: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                label="Distance (miles)"
                type="number"
                value={scenarioInputs.distance}
                onChange={(e) =>
                  setScenarioInputs({
                    ...scenarioInputs,
                    distance: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                label="Injection Fee ($/tCO₂)"
                type="number"
                value={scenarioInputs.injectionFee}
                onChange={(e) =>
                  setScenarioInputs({
                    ...scenarioInputs,
                    injectionFee: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                label="45Q Credit ($/tCO₂)"
                type="number"
                value={scenarioInputs.credit45Q}
                onChange={(e) =>
                  setScenarioInputs({
                    ...scenarioInputs,
                    credit45Q: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                label="CapEx ($)"
                type="number"
                value={scenarioInputs.capex}
                onChange={(e) =>
                  setScenarioInputs({
                    ...scenarioInputs,
                    capex: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                label="Annual OpEx ($)"
                type="number"
                value={scenarioInputs.opex}
                onChange={(e) =>
                  setScenarioInputs({
                    ...scenarioInputs,
                    opex: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <Select
              label="Transport Mode"
              value={scenarioInputs.transportMode}
              onChange={(e) =>
                setScenarioInputs({
                  ...scenarioInputs,
                  transportMode: e.target.value as any,
                })
              }
              options={[
                { value: 'pipeline', label: 'Pipeline' },
                { value: 'truck', label: 'Truck' },
                { value: 'rail', label: 'Rail' },
              ]}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Predicted Outcomes</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  Levelized Cost of Carbon (LCOC)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#174B7A]">
                    ${outputs.lcoc}
                  </span>
                  <span className="text-sm text-gray-600">/tCO₂</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  Payback Period
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-700">
                    {outputs.payback}
                  </span>
                  <span className="text-sm text-gray-600">years</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  Net Present Value (10yr)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-700">
                    ${outputs.npv}M
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" size="sm">
                <Download size={14} className="mr-1" />
                Export Scenario
              </Button>
            </div>
          </div>
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
};
