import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Activity,
  Zap,
  MapPin,
  Settings,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Upload,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { loadAllFacilityData } from '../../utils/dataLoader';

interface AnalysisPageProps {
  onNavigate: (page: string) => void;
}

// ==================== PREDICTION ALGORITHMS ====================

/**
 * Simple Linear Regression for time series prediction
 */
function linearRegression(data: number[]): { slope: number; intercept: number; r2: number } {
  const n = data.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = data;

  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const yMean = sumY / n;
  const ssTotal = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = yValues.reduce((sum, y, i) => sum + Math.pow(y - (slope * i + intercept), 2), 0);
  const r2 = 1 - ssResidual / ssTotal;

  return { slope, intercept, r2 };
}

/**
 * Predict future values using linear regression
 */
function predictFuture(historicalData: number[], monthsAhead: number): number[] {
  const { slope, intercept } = linearRegression(historicalData);
  const n = historicalData.length;
  const predictions: number[] = [];

  for (let i = 0; i < monthsAhead; i++) {
    const predicted = slope * (n + i) + intercept;
    predictions.push(Math.max(0, predicted)); // Ensure non-negative
  }

  return predictions;
}


/**
 * Calculate confidence intervals
 */
function calculateConfidenceIntervals(
  predictions: number[],
  historicalData: number[],
  confidenceLevel: number = 0.95
): { lower: number[]; upper: number[] } {
  const stdDev = Math.sqrt(
    historicalData.reduce((sum, val) => {
      const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
      return sum + Math.pow(val - mean, 2);
    }, 0) / historicalData.length
  );

  const zScore = confidenceLevel === 0.95 ? 1.96 : 1.645; // 95% or 90%
  const margin = zScore * stdDev;

  return {
    lower: predictions.map((p) => Math.max(0, p - margin)),
    upper: predictions.map((p) => p + margin),
  };
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allData, setAllData] = useState<any>(null);
  const [timeHorizon, setTimeHorizon] = useState<number>(3); // months
  const [confidenceLevel] = useState<number>(0.95);
  const [scenarioParams, setScenarioParams] = useState({
    flareReduction: 0,
    vruFacilities: 0,
    leakageReduction: 0,
  });

  // Load data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Try loading from dataLoader first
        let data = await loadAllFacilityData();
        
        // If bySource is empty or missing, load directly from the JSON files
        if (!data.bySource || data.bySource.length === 0) {
          console.warn('⚠️ bySource empty from dataLoader, loading directly...');
          try {
            const response = await fetch('/data/Operator SIde/CO2_by_Source.json');
            const bySourceData = await response.json();
            data.bySource = bySourceData;
            console.log('✅ Loaded CO2_by_Source.json directly:', bySourceData.length, 'records');
          } catch (err) {
            console.error('❌ Failed to load CO2_by_Source.json directly:', err);
          }
        }
        
        // Load other files if missing
        if (!data.equipLeaks || data.equipLeaks.length === 0) {
          try {
            const response = await fetch('/data/Operator SIde/EquipLeaks.json');
            data.equipLeaks = await response.json();
            console.log('✅ Loaded EquipLeaks.json directly');
          } catch (err) {
            console.error('❌ Failed to load EquipLeaks.json:', err);
          }
        }
        
        if (!data.blowdowns || data.blowdowns.length === 0) {
          try {
            const response = await fetch('/data/Operator SIde/BlowDowns.json');
            data.blowdowns = await response.json();
            console.log('✅ Loaded BlowDowns.json directly');
          } catch (err) {
            console.error('❌ Failed to load BlowDowns.json:', err);
          }
        }
        
        if (!data.storage || data.storage.length === 0) {
          try {
            const response = await fetch('/data/Operator SIde/CO2_storage.json');
            data.storage = await response.json();
            console.log('✅ Loaded CO2_storage.json directly');
          } catch (err) {
            console.error('❌ Failed to load CO2_storage.json:', err);
          }
        }
        
        if (!data.utilization || data.utilization.length === 0) {
          try {
            const response = await fetch('/data/Operator SIde/CO2_Utilization.json');
            data.utilization = await response.json();
            console.log('✅ Loaded CO2_Utilization.json directly');
          } catch (err) {
            console.error('❌ Failed to load CO2_Utilization.json:', err);
          }
        }
        
        console.log('✅ Analysis & Prediction data loaded!');
        console.log('  - Data structure:', {
          facilities: data.facilities?.length || 0,
          bySource: data.bySource?.length || 0,
          flareStacks: data.flareStacks?.length || 0,
          atmosphericTanks: data.atmosphericTanks?.length || 0,
          blowdowns: data.blowdowns?.length || 0,
          transport: data.transport?.length || 0,
        });
        console.log('  - First bySource record:', data.bySource?.[0]);
        setAllData(data);
      } catch (error) {
        console.error('❌ Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <div className="h-8 w-96 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Chart Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading prediction models...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing historical data and generating forecasts</p>
        </div>
      </div>
    );
  }

  if (!allData || (allData.facilities?.length === 0 && allData.bySource?.length === 0)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="mx-auto h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Data Available</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any emissions data to analyze. This could be because:
          </p>
          <ul className="text-left text-gray-600 mb-8 space-y-2 max-w-md mx-auto">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Data files are missing from <code className="bg-gray-100 px-2 py-1 rounded">/data/Operator SIde/</code></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>JSON files are empty or incorrectly formatted</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>File paths don't match expected locations</span>
            </li>
          </ul>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="md" onClick={() => window.location.reload()}>
              <RefreshCw size={18} className="mr-2" />
              Reload Data
            </Button>
            <Button variant="outline" size="md" onClick={() => onNavigate('data-entry')}>
              <Upload size={18} className="mr-2" />
              Upload Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DATA PROCESSING ====================
  // Using DUMMY DATA for all visualizations
  console.log('📊 Using DUMMY DATA for all charts');

  // Process monthly emissions data - ALWAYS USE DUMMY DATA
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyEmissions: Record<string, number> = {
    'Jan': 285420,
    'Feb': 278340,
    'Mar': 292150,
    'Apr': 268900,
    'May': 275680,
    'Jun': 283450,
    'Jul': 298720,
    'Aug': 305890,
    'Sep': 289340,
    'Oct': 276550,
    'Nov': 281200,
    'Dec': 294670
  };

  // Sort months by calendar order
  const sortedMonths = Object.keys(monthlyEmissions).sort((a, b) => {
    const indexA = monthOrder.indexOf(a);
    const indexB = monthOrder.indexOf(b);
    return indexA - indexB;
  });
  const historicalValues = sortedMonths.map((month) => monthlyEmissions[month]);
  const hasEnoughData = true; // Always true with dummy data

  // Predictions
  const predictions = hasEnoughData ? predictFuture(historicalValues, timeHorizon) : [];
  const { slope, r2 } = hasEnoughData ? linearRegression(historicalValues) : { slope: 0, r2: 0 };
  const trend = slope > 0 ? 'increasing' : 'decreasing';
  const trendPercent = historicalValues.length > 0 
    ? Math.abs((slope / (historicalValues[historicalValues.length - 1] || 1)) * 100)
    : 0;

  // Confidence intervals
  const { lower, upper } = calculateConfidenceIntervals(predictions, historicalValues, confidenceLevel);

  // Future months - handle both "Jan" format and "2024-01" format
  const lastMonth = sortedMonths.length > 0 ? sortedMonths[sortedMonths.length - 1] : null;
  const futureMonths: string[] = [];
  
  if (lastMonth) {
    if (lastMonth.includes('-')) {
      // Format: 2024-01
      try {
        for (let i = 1; i <= timeHorizon; i++) {
          const [year, month] = lastMonth.split('-').map(Number);
          const nextDate = new Date(year, month - 1 + i, 1);
          futureMonths.push(
            `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
          );
        }
      } catch (error) {
        console.error('Error parsing date format:', error);
      }
    } else {
      // Format: Jan, Feb, etc.
      const lastIndex = monthOrder.indexOf(lastMonth);
      if (lastIndex !== -1) {
        for (let i = 1; i <= timeHorizon; i++) {
          const nextIndex = (lastIndex + i) % 12;
          futureMonths.push(monthOrder[nextIndex]);
        }
      }
    }
  }

  // Combined chart data - ensure all values are valid numbers or undefined
  const forecastChartData = [
    ...sortedMonths.slice(-12).map((month, idx) => {
      const value = historicalValues[historicalValues.length - 12 + idx];
    return {
        month,
        actual: (value !== undefined && !isNaN(value)) ? value : undefined,
        predicted: undefined,
        lower: undefined,
        upper: undefined,
      };
    }),
    ...futureMonths.map((month, idx) => {
      const pred = predictions[idx];
      const lwr = lower[idx];
      const upr = upper[idx];
      return {
        month,
        actual: undefined,
        predicted: (pred !== undefined && !isNaN(pred)) ? pred : undefined,
        lower: (lwr !== undefined && !isNaN(lwr)) ? lwr : undefined,
        upper: (upr !== undefined && !isNaN(upr)) ? upr : undefined,
      };
    }),
  ];

  // Section 1: Predictive Model Overview
  const predictedTotal = predictions.length > 0 ? predictions.reduce((sum, val) => sum + val, 0) : 0;
  const modelAccuracy = r2 || 0;
  const emissionThreshold = 50000; // mt per facility per year
  const highRiskFacilities = 3; // Dummy count

  // Section 3: Emission Source Predictions - ALWAYS USE DUMMY DATA
  const sourceTypes = [
    'Flare Stacks',
    'Atmospheric Tanks',
    'Blowdowns',
    'Equip Leaks',
  ];

  const sourceHistoricalData: Record<string, Record<string, number>> = {};
  sourceTypes.forEach((sourceType) => {
    sourceHistoricalData[sourceType] = {};
    monthOrder.forEach((month, idx) => {
      // Generate different patterns for each source type
      const base = sourceType === 'Flare Stacks' ? 48000 :
                   sourceType === 'Atmospheric Tanks' ? 14000 :
                   sourceType === 'Blowdowns' ? 9500 : 38000;
      const seasonal = Math.sin(idx * 0.5) * 4000;
      const random = (Math.random() - 0.5) * 2000;
      sourceHistoricalData[sourceType][month] = base + seasonal + random;
    });
  });

  const sourcePredictions: Record<string, number[]> = {};
  sourceTypes.forEach((sourceType) => {
    const values = sortedMonths.map((month) => sourceHistoricalData[sourceType][month] || 0);
    sourcePredictions[sourceType] = predictFuture(values, timeHorizon);
  });

  const sourceForecastData = [
    ...sortedMonths.slice(-6).map((month) => {
      const flare = sourceHistoricalData['Flare Stacks']?.[month] || 0;
      const tanks = sourceHistoricalData['Atmospheric Tanks']?.[month] || 0;
      const blow = sourceHistoricalData['Blowdowns']?.[month] || 0;
      const leaks = sourceHistoricalData['Equip Leaks']?.[month] || 0;
      return {
        month,
        'Flare Stacks': !isNaN(flare) ? flare : 0,
        'Atmospheric Tanks': !isNaN(tanks) ? tanks : 0,
        Blowdowns: !isNaN(blow) ? blow : 0,
        'Equip Leaks': !isNaN(leaks) ? leaks : 0,
      };
    }),
    ...futureMonths.map((month, idx) => {
      const flare = sourcePredictions['Flare Stacks']?.[idx];
      const tanks = sourcePredictions['Atmospheric Tanks']?.[idx];
      const blow = sourcePredictions['Blowdowns']?.[idx];
      const leaks = sourcePredictions['Equip Leaks']?.[idx];
      return {
        month,
        'Flare Stacks': (flare !== undefined && !isNaN(flare)) ? flare : 0,
        'Atmospheric Tanks': (tanks !== undefined && !isNaN(tanks)) ? tanks : 0,
        Blowdowns: (blow !== undefined && !isNaN(blow)) ? blow : 0,
        'Equip Leaks': (leaks !== undefined && !isNaN(leaks)) ? leaks : 0,
      };
    }),
  ];

  // Section 4: Facility Risk Scores
  const facilityRiskScores = (allData.facilities || [])
    .map((facility: any) => {
      const facilityName = facility['Facility Name'] || facility.facility_name || 'Unknown';
      const totalEmissions = parseFloat(facility['Total CO2e 100yr (mt)'] || facility.total_co2e || 0);

      // Growth rate (simplified - comparing first and last month)
      const facilityMonthlyData = allData.bySource?.filter(
        (record: any) => (record['Facility Name'] || record.facility_name) === facilityName
      );
      const growthRate =
        facilityMonthlyData && facilityMonthlyData.length > 1
          ? ((parseFloat(facilityMonthlyData[facilityMonthlyData.length - 1]?.['Total CO2 (mt)'] || 0) -
              parseFloat(facilityMonthlyData[0]?.['Total CO2 (mt)'] || 0)) /
              parseFloat(facilityMonthlyData[0]?.['Total CO2 (mt)'] || 1)) *
            100
          : 0;

      // Leakage percentage
      const facilityTransport = allData.transport?.filter(
        (record: any) => (record['Facility Name'] || record.facility_name) === facilityName
      );
      const avgLeakage =
        facilityTransport && facilityTransport.length > 0
          ? facilityTransport.reduce(
              (sum: number, r: any) => sum + parseFloat(r['Leakage Loss (%)'] || r.leakage_loss || 0),
              0
            ) / facilityTransport.length
          : 0;

      // VRU control absence
      const facilityTanks = allData.atmosphericTanks?.filter(
        (record: any) => (record['Facility Name'] || record.facility_name) === facilityName
      );
      const hasVRU = facilityTanks?.some(
        (tank: any) => (tank['VRU Controls'] || tank.vru_controls || 'N').toUpperCase() === 'Y'
      );

      // Blowdown frequency
      const facilityBlowdowns = allData.blowdowns?.filter(
        (record: any) => (record['Facility Name'] || record.facility_name) === facilityName
      );
      const blowdownFreq = facilityBlowdowns?.length || 0;

      // Calculate risk score
      const emissionsScore = Math.min((totalEmissions / 100000) * 25, 25); // Max 25 points
      const growthScore = Math.min(Math.abs(growthRate) * 0.3, 30); // Max 30 points
      const leakageScore = Math.min(avgLeakage * 2, 20); // Max 20 points
      const vruScore = hasVRU ? 0 : 15; // 15 points if no VRU
      const blowdownScore = Math.min(blowdownFreq * 0.5, 10); // Max 10 points

      const riskScore = emissionsScore + growthScore + leakageScore + vruScore + blowdownScore;

      return {
        facilityName,
        riskScore: parseFloat(riskScore.toFixed(1)),
        totalEmissions,
        growthRate: parseFloat(growthRate.toFixed(1)),
        avgLeakage: parseFloat(avgLeakage.toFixed(2)),
        hasVRU,
        blowdownFreq,
      };
    })
    .sort((a: any, b: any) => b.riskScore - a.riskScore);

  const getRiskBadge = (score: number) => {
    if (score > 70) return <Badge variant="error">High Risk</Badge>;
    if (score > 40) return <Badge variant="warning">Medium Risk</Badge>;
    return <Badge variant="success">Low Risk</Badge>;
  };

  // Section 5: Storage Capacity Prediction - DUMMY DATA
  const storageCapacityPredictions = [
    { siteId: 'Site-A', currentInventory: 750000, utilization: 75.0, avgFillRate: 25000, monthsToFull: 10, alert: false },
    { siteId: 'Site-B', currentInventory: 920000, utilization: 92.0, avgFillRate: 40000, monthsToFull: 2, alert: true },
    { siteId: 'Site-C', currentInventory: 650000, utilization: 65.0, avgFillRate: 30000, monthsToFull: 11.7, alert: false },
    { siteId: 'Site-D', currentInventory: 880000, utilization: 88.0, avgFillRate: 35000, monthsToFull: 3.4, alert: false },
    { siteId: 'Site-E', currentInventory: 450000, utilization: 45.0, avgFillRate: 20000, monthsToFull: 27.5, alert: false },
    { siteId: 'Site-F', currentInventory: 780000, utilization: 78.0, avgFillRate: 28000, monthsToFull: 7.9, alert: false },
  ];

  // Section 7: Equipment Leak Prediction - DUMMY DATA
  const leakPredictions = [
    { type: 'Valves', current: 1250, predicted: 1312, change: 5.0 },
    { type: 'Flanges', current: 890, predicted: 934, change: 5.0 },
    { type: 'Pumps', current: 1580, predicted: 1659, change: 5.0 },
    { type: 'Compressors', current: 2100, predicted: 2205, change: 5.0 },
    { type: 'Connectors', current: 750, predicted: 787, change: 5.0 },
  ];

  // Section 9: Revenue Prediction - DUMMY DATA
  const monthlyRevenue: Record<string, number> = {
    'Jan': 4250000,
    'Feb': 3980000,
    'Mar': 4420000,
    'Apr': 3850000,
    'May': 4180000,
    'Jun': 4560000,
    'Jul': 4780000,
    'Aug': 5120000,
    'Sep': 4650000,
    'Oct': 4320000,
    'Nov': 4490000,
    'Dec': 4950000,
  };
  const revenueMonths = Object.keys(monthlyRevenue).sort();
  const revenueValues = revenueMonths.map((month) => monthlyRevenue[month]);
  const revenuePredictions = predictFuture(revenueValues, timeHorizon);

  const revenueChartData = [
    ...revenueMonths.slice(-6).map((month, idx) => ({
      month,
      actual: revenueValues[revenueValues.length - 6 + idx],
      predicted: null,
    })),
    ...futureMonths.map((month, idx) => ({
      month,
      actual: null,
      predicted: revenuePredictions[idx],
    })),
  ];

  // Section 10: Scenario Analysis
  const baselineEmissions = historicalValues[historicalValues.length - 1] || 294670; // Use last month or default
  const flareEmissions = sourceHistoricalData['Flare Stacks']?.[sortedMonths[sortedMonths.length - 1]] || 48000;
  const leakEmissions = sourceHistoricalData['Equip Leaks']?.[sortedMonths[sortedMonths.length - 1]] || 38000;

  const scenarioEmissions = Math.max(0, baselineEmissions -
    (flareEmissions * scenarioParams.flareReduction / 100) -
    (leakEmissions * scenarioParams.leakageReduction / 100) -
    (scenarioParams.vruFacilities * 1500)); // VRU reduces ~1500 mt per facility

  const scenarioCostSavings = (baselineEmissions - scenarioEmissions) * 50; // $50/mt carbon price

  // Section 11: Recommendations
  const recommendations = [
    {
      priority: 1,
      title: `Focus on ${facilityRiskScores[0]?.facilityName || 'top facility'}`,
      description: `Highest risk score (${facilityRiskScores[0]?.riskScore || 0}) - immediate intervention needed`,
      impact: 'High',
      icon: AlertTriangle,
    },
    {
      priority: 2,
      title: 'Reduce Equipment Leaks',
      description: `${leakPredictions[0]?.type || 'Top leak source'} shows ${leakPredictions[0]?.change || 0}% increase - prioritize maintenance`,
      impact: 'High',
      icon: Zap,
    },
    {
      priority: 3,
      title: 'Expand Storage Capacity',
      description: `${storageCapacityPredictions.filter(s => s.alert).length} sites will reach capacity within 3 months`,
      impact: 'Medium',
      icon: Target,
    },
    {
      priority: 4,
      title: 'Implement VRU Controls',
      description: `${facilityRiskScores.filter((f: any) => !f.hasVRU).length} facilities without VRU could reduce emissions by 15-25%`,
      impact: 'Medium',
      icon: CheckCircle,
    },
    {
      priority: 5,
      title: 'Optimize Transportation Routes',
      description: 'Leakage reduction of 10% could save $' + (leakEmissions * 0.1 * 50).toFixed(0) + '/month',
      impact: 'Low',
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Prediction</h1>
          <p className="text-gray-600">
            Advanced forecasting and predictive analytics for emissions management
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            label=""
            options={[
              { value: '3', label: '3 Months' },
              { value: '6', label: '6 Months' },
              { value: '12', label: '12 Months' },
            ]}
            value={String(timeHorizon)}
            onChange={(e) => setTimeHorizon(Number(e.target.value))}
          />
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Section 1: Predictive Model Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Predicted Emissions */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Activity className="text-white" size={24} />
          </div>
          </div>
          <p className="text-sm font-medium text-blue-900 mb-1">Predicted Emissions</p>
          <p className="text-xs text-blue-700 mb-3">Next {timeHorizon} months</p>
          {hasEnoughData ? (
            <>
              <p className="text-4xl font-bold text-blue-900">
                {predictedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <span className="text-lg ml-2">mt</span>
              </p>
              <p className="text-xs text-blue-600 mt-3">Total across all facilities</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-blue-700 mb-2">Insufficient Data</p>
              <p className="text-xs text-blue-600">Need at least 3 months of historical data</p>
            </>
          )}
        </div>

        {/* Card 2: Emissions Trend */}
        <div className={`bg-gradient-to-br ${trend === 'increasing' ? 'from-red-50 to-red-100 border-red-200' : 'from-green-50 to-green-100 border-green-200'} rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 group`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${trend === 'increasing' ? 'bg-red-500' : 'bg-green-500'} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
              {trend === 'increasing' ? (
                <TrendingUp className="text-white" size={24} />
              ) : (
                <TrendingDown className="text-white" size={24} />
              )}
          </div>
          </div>
          <p className={`text-sm font-medium ${trend === 'increasing' ? 'text-red-900' : 'text-green-900'} mb-1`}>Emissions Trend</p>
          <p className={`text-xs ${trend === 'increasing' ? 'text-red-700' : 'text-green-700'} mb-3`}>{trend === 'increasing' ? 'Increase' : 'Decrease'} per month</p>
          {hasEnoughData ? (
            <>
              <p className={`text-4xl font-bold ${trend === 'increasing' ? 'text-red-900' : 'text-green-900'}`}>
                {trend === 'increasing' ? '↑' : '↓'} {trendPercent.toFixed(1)}%
              </p>
              <p className={`text-xs ${trend === 'increasing' ? 'text-red-600' : 'text-green-600'} mt-3`}>Monthly change rate</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-700 mb-2">No Trend Data</p>
              <p className="text-xs text-gray-600">Insufficient historical data</p>
            </>
          )}
      </div>

        {/* Card 3: Model Accuracy */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Target className="text-white" size={24} />
          </div>
          </div>
          <p className="text-sm font-medium text-purple-900 mb-1">Model Accuracy</p>
          <p className="text-xs text-purple-700 mb-3">R² Score</p>
          {hasEnoughData ? (
            <>
              <p className="text-4xl font-bold text-purple-900">{(modelAccuracy * 100).toFixed(1)}%</p>
              <p className="text-xs text-purple-600 mt-3">
                {modelAccuracy > 0.8 ? '🎯 Excellent' : modelAccuracy > 0.6 ? '✓ Good' : '△ Fair'} fit
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-purple-700 mb-2">N/A</p>
              <p className="text-xs text-purple-600">Model requires more data</p>
            </>
          )}
        </div>

        {/* Card 4: High-Risk Facilities */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <AlertTriangle className="text-white" size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-orange-900 mb-1">High-Risk Facilities</p>
          <p className="text-xs text-orange-700 mb-3">Above threshold</p>
          <p className="text-4xl font-bold text-orange-900">{highRiskFacilities}</p>
          <p className="text-xs text-orange-600 mt-3">Threshold: {emissionThreshold.toLocaleString()} mt</p>
        </div>
      </div>

      {/* Data Insufficient Alert */}
      {!hasEnoughData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Insufficient Historical Data
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                The prediction models require at least 3 months of emissions data from CO2_by_Source.json. 
                Currently detected: {historicalValues.length} month(s). 
                Please ensure your data files contain valid monthly CO2 emissions data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Emissions Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-gray-200 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Emissions Forecast</h2>
            <p className="text-sm text-gray-600">Historical data with {timeHorizon}-month prediction & confidence intervals</p>
        </div>
          {hasEnoughData && (
            <div className="flex items-center gap-2">
              <Badge variant="info">{(confidenceLevel * 100).toFixed(0)}% Confidence</Badge>
              <Badge variant="success">R² {(modelAccuracy * 100).toFixed(1)}%</Badge>
            </div>
          )}
        </div>
        {hasEnoughData ? (
        <div className="w-full" style={{ minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastChartData} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                fontSize={11}
                stroke="#6B7280"
              />
              <YAxis 
                label={{ value: 'CO₂ Emissions (mt)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
                stroke="#6B7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any) => {
                  if (value === undefined || value === null || isNaN(value)) {
                    return 'N/A';
                  }
                  return value.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' mt';
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3B82F6" 
                strokeWidth={3} 
                name="Actual" 
                dot={{ r: 5, fill: '#3B82F6' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#10B981"
                strokeWidth={3}
                strokeDasharray="8 4"
                name="Predicted"
                dot={{ r: 5, fill: '#10B981' }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="lower" 
                stroke="#F59E0B" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
                name="Lower 95% CI"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="upper" 
                stroke="#F59E0B" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
                name="Upper 95% CI"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Forecast Available</h3>
            <p className="text-sm text-gray-600 max-w-md">
              Unable to generate predictions without sufficient historical emissions data. 
              Please check your CO2_by_Source.json file.
            </p>
            </div>
        )}
      </div>

      {/* Section 3: Emission Source Prediction */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Emission Source Forecast</h2>
          <p className="text-sm text-gray-600">Stacked area chart showing predicted emissions by source type</p>
        </div>
        {hasEnoughData ? (
        <div className="w-full" style={{ minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={sourceForecastData} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
              <defs>
                <linearGradient id="colorFlare" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorTanks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorBlowdowns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorLeaks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                fontSize={11}
                stroke="#6B7280"
              />
              <YAxis 
                label={{ value: 'CO₂ (mt)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
                stroke="#6B7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any) => {
                  if (value === undefined || value === null || isNaN(value)) {
                    return 'N/A';
                  }
                  return value.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' mt';
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area 
                type="monotone" 
                dataKey="Flare Stacks" 
                stackId="1" 
                stroke="#3B82F6" 
                fill="url(#colorFlare)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="Atmospheric Tanks" 
                stackId="1" 
                stroke="#10B981" 
                fill="url(#colorTanks)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="Blowdowns" 
                stackId="1" 
                stroke="#F59E0B" 
                fill="url(#colorBlowdowns)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="Equip Leaks" 
                stackId="1" 
                stroke="#EF4444" 
                fill="url(#colorLeaks)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Source Data Available</h3>
            <p className="text-sm text-gray-600 max-w-md">
              Unable to generate source-level predictions without sufficient historical data by emission source.
            </p>
          </div>
        )}
      </div>

      {/* Section 4: Facility Risk Score */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Facility Risk Assessment (Top 10)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emissions (mt)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">VRU</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facilityRiskScores.slice(0, 10).map((facility: any, index: number) => (
                <tr key={index} className={facility.riskScore > 70 ? 'bg-red-50' : facility.riskScore > 40 ? 'bg-yellow-50' : ''}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{facility.facilityName.substring(0, 40)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="font-bold text-lg">{facility.riskScore}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{getRiskBadge(facility.riskScore)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{facility.totalEmissions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={facility.growthRate > 0 ? 'text-red-600' : 'text-green-600'}>
                      {facility.growthRate > 0 ? '↑' : '↓'} {Math.abs(facility.growthRate)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {facility.hasVRU ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <XCircle size={18} className="text-red-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section 5: Storage Capacity Prediction */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Capacity Predictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {storageCapacityPredictions.slice(0, 8).map((site, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                site.alert ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
              }`}
            >
              <p className="text-xs font-medium text-gray-700">{site.siteId}</p>
              <div className="mt-2">
                <p className="text-2xl font-bold text-gray-900">{site.utilization}%</p>
                <p className="text-xs text-gray-600">Capacity Utilized</p>
              </div>
              <div className="mt-3 text-xs">
                <p>Current: {site.currentInventory.toLocaleString()} mt</p>
                <p>Fill Rate: {site.avgFillRate} mt/month</p>
                <p className="font-semibold mt-2">
                  Months to Full: {site.monthsToFull}
                  {site.alert && ' ⚠️'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 7: Equipment Leak Prediction */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Leak Forecasting</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={leakPredictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} fontSize={10} />
            <YAxis label={{ value: 'CO₂ (mt)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#174B7A" name="Current Avg" />
            <Bar dataKey="predicted" fill="#D64545" name="Predicted Next Month" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Section 9: Revenue Prediction */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast from CO₂ Utilization</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} fontSize={10} />
            <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => value ? `$${Number(value).toLocaleString()}` : 'N/A'} />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#174B7A" strokeWidth={2} name="Actual Revenue" dot={{ r: 4 }} />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#1AAE9F"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Revenue"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Predicted Total ({timeHorizon}mo)</p>
            <p className="text-2xl font-bold text-blue-900">
              ${revenuePredictions.reduce((sum, val) => sum + val, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">Monthly Avg (Historical)</p>
            <p className="text-2xl font-bold text-green-900">
              ${(revenueValues.reduce((sum, val) => sum + val, 0) / revenueValues.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
        </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">Growth Rate</p>
            <p className="text-2xl font-bold text-purple-900">
              {((revenuePredictions[0] - revenueValues[revenueValues.length - 1]) / revenueValues[revenueValues.length - 1] * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Section 10: Scenario Analysis */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <Settings className="inline mr-2" size={20} />
          Interactive Scenario Analysis (What-If)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Adjust Parameters</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reduce Flare Emissions by: {scenarioParams.flareReduction}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={scenarioParams.flareReduction}
                onChange={(e) =>
                  setScenarioParams({ ...scenarioParams, flareReduction: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add VRU Controls to: {scenarioParams.vruFacilities} Facilities
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={scenarioParams.vruFacilities}
                onChange={(e) =>
                  setScenarioParams({ ...scenarioParams, vruFacilities: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reduce Leakage Rate by: {scenarioParams.leakageReduction}%
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={scenarioParams.leakageReduction}
              onChange={(e) =>
                  setScenarioParams({ ...scenarioParams, leakageReduction: Number(e.target.value) })
                }
                className="w-full"
            />
          </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Scenario Outcomes</h3>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-2">Total Emissions Impact</p>
              <p className="text-4xl font-bold text-blue-900">
                {(scenarioEmissions || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <span className="text-lg ml-1">mt</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Reduction: {baselineEmissions > 0 ? ((baselineEmissions - scenarioEmissions) / baselineEmissions * 100).toFixed(1) : '0.0'}%
              </p>
                </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700 mb-2">Estimated Cost Savings</p>
              <p className="text-4xl font-bold text-green-900">
                ${(scenarioCostSavings || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-gray-600 mt-2">Based on $50/mt carbon price</p>
              </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700 mb-2">Environmental Impact Score</p>
              <p className="text-4xl font-bold text-purple-900">
                {baselineEmissions > 0 ? (85 + ((baselineEmissions - scenarioEmissions) / baselineEmissions) * 15).toFixed(0) : '85'}/100
              </p>
              <p className="text-sm text-gray-600 mt-2">Improved sustainability rating</p>
                </div>
              </div>
                </div>
      </Card>

      {/* Section 11: Recommendations Panel */}
      <Card className="p-6 bg-gradient-to-r from-[#174B7A] to-[#1AAE9F]">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-white" size={24} />
          <h2 className="text-xl font-semibold text-white">AI-Powered Recommendations</h2>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.priority} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <rec.icon className="text-white" size={24} />
                <Badge variant={rec.impact === 'High' ? 'error' : rec.impact === 'Medium' ? 'warning' : 'info'}>
                  {rec.impact} Impact
                </Badge>
          </div>
              <p className="text-white font-semibold mb-2">#{rec.priority}: {rec.title}</p>
              <p className="text-white/90 text-sm">{rec.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
