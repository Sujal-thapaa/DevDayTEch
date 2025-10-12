import React from 'react';
import { ArrowRight, TrendingUp, Database } from 'lucide-react';
import { KPICard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SankeyChart } from '../../components/charts/SankeyChart';
import {
  mockKPIs,
  mockMTDKPIs,
  mockComplianceReadiness,
  mockMassBalanceDelta,
  mockTasks,
  mockAlerts,
} from '../../data/mockData';
import { OperatorPage } from '../../types';

interface HomePageProps {
  onNavigate: (page: OperatorPage) => void;
  isDataLoaded: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, isDataLoaded }) => {
  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Database size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Please upload your emissions data files in the Data Entry section to view analytics and insights.
        </p>
        <Button variant="primary" onClick={() => onNavigate('data-entry')}>
          Go to Data Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time CO₂ tracking and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, idx) => (
          <KPICard
            key={idx}
            {...kpi}
            period="Today"
            onClick={() => onNavigate('analysis')}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">CO₂ Flow Distribution</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('analysis')}
            >
              Analyze <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <SankeyChart />
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Compliance Readiness
                </span>
                <Badge variant="success" size="sm">
                  Excellent
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-700">
                {mockComplianceReadiness}%
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-gray-700 block mb-2">
                Mass Balance Δ
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {Math.abs(mockMassBalanceDelta).toFixed(1)}
                </span>
                <span className="text-sm font-medium text-gray-600">tCO₂</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Within acceptable variance range
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
            <Badge variant="info" size="sm">
              {mockTasks.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {mockTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-[#174B7A] transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {task.title}
                  </span>
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'error'
                        : task.priority === 'medium'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                </div>
                <span className="text-xs text-gray-600">Due: {task.dueDate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            <button
              onClick={() => onNavigate('incidents')}
              className="text-sm text-[#174B7A] hover:text-[#0f3350] font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex gap-2 mb-1">
                  <Badge
                    variant={alert.severity === 'high' ? 'error' : 'warning'}
                    size="sm"
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-gray-600">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-gray-900">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Month-to-Date Performance</h2>
          <Button
            variant="accent"
            size="sm"
            onClick={() => onNavigate('analysis')}
          >
            <TrendingUp size={16} className="mr-1" />
            View Predictions
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {mockMTDKPIs.map((kpi, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600 block mb-1">
                {kpi.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {kpi.value.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {kpi.unit}
                </span>
              </div>
              <span className="text-xs text-green-600 font-medium">
                ↑ {kpi.change}% MTD
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
