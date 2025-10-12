import React, { useState } from 'react';
import { Download, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { OperatorPage } from '../../types';

interface ROIPageProps {
  onNavigate: (page: OperatorPage) => void;
  isDataLoaded: boolean;
}

export const ROIPage: React.FC<ROIPageProps> = ({ onNavigate, isDataLoaded }) => {
  const [inputs, setInputs] = useState({
    captureRate: 25000,
    purity: 99.0,
    distance: 45,
    injectionFee: 15,
    capex: 5000000,
    annualOpex: 850000,
    credit45Q: 85,
    transportMode: 'pipeline',
    projectLife: 10,
  });

  const calculateROI = () => {
    const annualRevenue = inputs.captureRate * inputs.credit45Q;
    const annualTransportCost =
      inputs.captureRate *
      (inputs.transportMode === 'pipeline'
        ? 8.2
        : inputs.transportMode === 'truck'
        ? 12.4
        : 10.5);
    const annualInjectionCost = inputs.captureRate * inputs.injectionFee;
    const totalAnnualCost = inputs.annualOpex + annualTransportCost + annualInjectionCost;
    const annualProfit = annualRevenue - totalAnnualCost;

    const lcoc = totalAnnualCost / inputs.captureRate;
    const payback = inputs.capex / annualProfit;
    const totalProfit = annualProfit * inputs.projectLife - inputs.capex;
    const npv = totalProfit / 1000000;
    const roi = (totalProfit / inputs.capex) * 100;

    return {
      lcoc: lcoc.toFixed(2),
      payback: payback.toFixed(1),
      npv: npv.toFixed(2),
      roi: roi.toFixed(1),
      annualRevenue: (annualRevenue / 1000000).toFixed(2),
      annualProfit: (annualProfit / 1000000).toFixed(2),
    };
  };

  const results = calculateROI();

  const sensitivityFactors = [
    { label: '45Q Credit', impact: 38.2, direction: 'up' },
    { label: 'Capture Rate', impact: 28.5, direction: 'up' },
    { label: 'OpEx', impact: -22.1, direction: 'down' },
    { label: 'Transport Cost', impact: -15.3, direction: 'down' },
    { label: 'Injection Fee', impact: -12.8, direction: 'down' },
  ];

  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <DollarSign size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No ROI Data Available</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Upload emissions data to calculate return on investment and perform financial analysis.
        </p>
        <Button variant="primary" onClick={() => onNavigate('data-entry')}>
          Go to Data Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ROI Calculator</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive financial modeling for CO₂ capture projects
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="accent"
            size="md"
            onClick={() => onNavigate('analysis')}
          >
            <TrendingUp size={18} className="mr-2" />
            Use Predictions
          </Button>
          <Button variant="outline" size="md">
            <Download size={18} className="mr-2" />
            Export Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Project Parameters
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Annual Capture Rate (tCO₂/yr)"
                type="number"
                value={inputs.captureRate}
                onChange={(e) =>
                  setInputs({ ...inputs, captureRate: parseFloat(e.target.value) })
                }
              />
              <Input
                label="CO₂ Purity (%)"
                type="number"
                value={inputs.purity}
                onChange={(e) =>
                  setInputs({ ...inputs, purity: parseFloat(e.target.value) })
                }
              />
              <Input
                label="Transport Distance (miles)"
                type="number"
                value={inputs.distance}
                onChange={(e) =>
                  setInputs({ ...inputs, distance: parseFloat(e.target.value) })
                }
              />
              <Select
                label="Transport Mode"
                value={inputs.transportMode}
                onChange={(e) =>
                  setInputs({ ...inputs, transportMode: e.target.value })
                }
                options={[
                  { value: 'pipeline', label: 'Pipeline ($8.20/t)' },
                  { value: 'truck', label: 'Truck ($12.40/t)' },
                  { value: 'rail', label: 'Rail ($10.50/t)' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Financial Inputs
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Capital Expenditure (CapEx) ($)"
                type="number"
                value={inputs.capex}
                onChange={(e) =>
                  setInputs({ ...inputs, capex: parseFloat(e.target.value) })
                }
              />
              <Input
                label="Annual Operating Expenditure (OpEx) ($)"
                type="number"
                value={inputs.annualOpex}
                onChange={(e) =>
                  setInputs({ ...inputs, annualOpex: parseFloat(e.target.value) })
                }
              />
              <Input
                label="45Q Tax Credit ($/tCO₂)"
                type="number"
                value={inputs.credit45Q}
                onChange={(e) =>
                  setInputs({ ...inputs, credit45Q: parseFloat(e.target.value) })
                }
              />
              <Input
                label="Injection/Storage Fee ($/tCO₂)"
                type="number"
                value={inputs.injectionFee}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    injectionFee: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                label="Project Life (years)"
                type="number"
                value={inputs.projectLife}
                onChange={(e) =>
                  setInputs({ ...inputs, projectLife: parseFloat(e.target.value) })
                }
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sensitivity Analysis
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Impact on NPV from ±10% change in each parameter
            </p>
            <div className="space-y-3">
              {sensitivityFactors.map((factor, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {factor.label}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        factor.direction === 'up'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {factor.direction === 'up' ? '+' : ''}
                      {factor.impact}%
                    </span>
                  </div>
                  <div className="relative w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 h-full transition-all ${
                        factor.direction === 'up'
                          ? 'bg-green-500 left-1/2'
                          : 'bg-red-500 right-1/2'
                      }`}
                      style={{
                        width: `${Math.abs(factor.impact)}%`,
                      }}
                    ></div>
                    <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-400"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Key Results
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Levelized Cost of Carbon
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#174B7A]">
                    ${results.lcoc}
                  </span>
                  <span className="text-sm text-gray-600">/tCO₂</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Payback Period
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-700">
                    {results.payback}
                  </span>
                  <span className="text-sm text-gray-600">years</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Net Present Value ({inputs.projectLife}yr)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-700">
                    ${results.npv}M
                  </span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Return on Investment
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-yellow-700">
                    {results.roi}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cash Flow Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Annual Revenue</span>
                <span className="text-sm font-semibold text-green-600">
                  +${results.annualRevenue}M
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Annual Profit</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${results.annualProfit}M
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Initial Investment</span>
                <span className="text-sm font-semibold text-red-600">
                  -${(inputs.capex / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#174B7A] to-[#1AAE9F] text-white">
            <h3 className="font-semibold mb-2">Need More Accurate Predictions?</h3>
            <p className="text-sm text-white/90 mb-4">
              Use our AI-powered Analysis module to get forecasts based on your
              historical data and industry trends.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('analysis')}
            >
              Open Analysis <ArrowRight size={16} className="ml-1" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
