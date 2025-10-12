import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Filter, 
  Download, 
  AlertTriangle, 
  BarChart3, 
  X, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Incident {
  incident_id: string;
  facility: string;
  date: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  description: string;
  location_lat: number;
  location_lon: number;
  asset_id: string;
  detection_method: string;
  interlock_triggered: 'Y' | 'N';
  downtime_minutes: number;
  root_cause_category: string;
  time_started: string;
  time_detected: string;
  time_acknowledged: string;
  time_resolved: string;
  t_mttd_minutes: number | string;
  t_mtta_minutes: number | string;
  t_mttr_minutes: number | string;
}

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState({
    facility: 'all',
    severity: 'all',
    status: 'all',
    dateRange: '30d'
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [incidents, filters]);

  const loadIncidents = async () => {
    try {
      const response = await fetch('/data/IncidentCenter.json');
      const data: Incident[] = await response.json();
      setIncidents(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading incidents:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...incidents];

    if (filters.facility !== 'all') {
      filtered = filtered.filter(i => i.facility === filters.facility);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(i => i.severity === filters.severity);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(i => i.status === filters.status);
    }

    // Date range filtering
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
      
      filtered = filtered.filter(i => {
        const incidentDate = new Date(i.date);
        return incidentDate >= cutoffDate;
      });
    }

    setFilteredIncidents(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'investigating': return 'warning';
      case 'open': return 'error';
      default: return 'neutral';
    }
  };

  // Analytics calculations
  const totalIncidents = filteredIncidents.length;
  const resolvedIncidents = filteredIncidents.filter(i => i.status === 'resolved').length;
  const resolvedPercentage = totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1) : 0;
  
  const mttrValues = filteredIncidents
    .map(i => typeof i.t_mttr_minutes === 'number' ? i.t_mttr_minutes : 0)
    .filter(v => v > 0);
  const avgMTTR = mttrValues.length > 0 
    ? (mttrValues.reduce((a, b) => a + b, 0) / mttrValues.length / 60).toFixed(1)
    : '0';

  const criticalOpen = filteredIncidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;

  // Severity distribution
  const severityData = [
    { name: 'Low', value: filteredIncidents.filter(i => i.severity === 'low').length, color: '#3b82f6' },
    { name: 'Medium', value: filteredIncidents.filter(i => i.severity === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: filteredIncidents.filter(i => i.severity === 'high').length, color: '#ef4444' }
  ];

  // Root cause distribution
  const rootCauseCount: { [key: string]: number } = {};
  filteredIncidents.forEach(i => {
    rootCauseCount[i.root_cause_category] = (rootCauseCount[i.root_cause_category] || 0) + 1;
  });
  const rootCauseData = Object.entries(rootCauseCount)
    .map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Monthly trend
  const monthlyData: { [key: string]: number } = {};
  filteredIncidents.forEach(i => {
    const month = i.date.substring(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });
  const trendData = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  // Detection method distribution
  const detectionMethodCount: { [key: string]: number } = {};
  filteredIncidents.forEach(i => {
    detectionMethodCount[i.detection_method] = (detectionMethodCount[i.detection_method] || 0) + 1;
  });
  const detectionData = Object.entries(detectionMethodCount)
    .map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  // Facility breakdown
  const facilityCount: { [key: string]: number } = {};
  filteredIncidents.forEach(i => {
    facilityCount[i.facility] = (facilityCount[i.facility] || 0) + 1;
  });
  const facilityData = Object.entries(facilityCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const uniqueFacilities = Array.from(new Set(incidents.map(i => i.facility)));

  if (showAnalytics) {
    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              AI-powered insights and trends from {totalIncidents} incidents
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAnalytics(false)}>
            <X size={16} className="mr-1" />
            Close Analytics
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
            <p className="text-3xl font-bold text-gray-900">{totalIncidents}</p>
            <p className="text-xs text-gray-500 mt-2">From filtered data</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Resolved Rate</p>
            <p className="text-3xl font-bold text-green-600">{resolvedPercentage}%</p>
            <p className="text-xs text-gray-500 mt-2">{resolvedIncidents} of {totalIncidents} resolved</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg MTTR</p>
            <p className="text-3xl font-bold text-purple-600">{avgMTTR}h</p>
            <p className="text-xs text-gray-500 mt-2">Mean Time To Resolve</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Critical Open</p>
            <p className="text-3xl font-bold text-red-600">{criticalOpen}</p>
            <p className="text-xs text-gray-500 mt-2">High severity unresolved</p>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Incident Trend (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#174B7A" strokeWidth={2} name="Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Severity Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-orange-600" />
              Severity Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Root Cause Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-purple-600" />
              Top Root Causes
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rootCauseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1AAE9F" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Facility Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Top 5 Facilities
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={facilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#174B7A" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detection Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Detection Method Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {detectionData.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize mb-1">{item.name}</p>
                <p className="text-2xl font-bold text-[#174B7A]">{item.value}</p>
                <p className="text-xs text-gray-500">
                  {((item.value / totalIncidents) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-blue-600" />
            AI-Powered Insights
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-semibold text-gray-900">
                🔍 Pattern Detected:
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {rootCauseData[0]?.name || 'Equipment failure'} is the leading root cause, accounting for{' '}
                {((rootCauseData[0]?.value || 0) / totalIncidents * 100).toFixed(0)}% of incidents. 
                Consider preventive maintenance review.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-semibold text-gray-900">
                ⚠️ Alert:
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {criticalOpen} high-severity incidents remain unresolved. Average resolution time is {avgMTTR} hours.
                Immediate attention recommended.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-semibold text-gray-900">
                📊 Performance:
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Incident resolution rate is {resolvedPercentage}%. 
                {parseFloat(resolvedPercentage as string) > 80 
                  ? ' Excellent performance - above industry standard.' 
                  : ' Consider improving response protocols to reach 80%+ target.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Center</h1>
          <p className="text-gray-600 mt-1">
            Track and manage operational incidents across all facilities
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAnalytics(true)}
          >
            <BarChart3 size={18} className="mr-2" />
            Analyze
          </Button>
          <Button variant="outline" size="md">
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Incidents</p>
          <p className="text-2xl font-bold text-gray-900">{filteredIncidents.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">High Severity</p>
          <p className="text-2xl font-bold text-red-600">
            {filteredIncidents.filter(i => i.severity === 'high').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Investigating</p>
          <p className="text-2xl font-bold text-orange-600">
            {filteredIncidents.filter(i => i.status === 'investigating').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredIncidents.filter(i => i.status === 'resolved').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Facility"
            value={filters.facility}
            onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
            options={[
              { value: 'all', label: 'All Facilities' },
              ...uniqueFacilities.map(f => ({ value: f, label: f }))
            ]}
          />
          <Select
            label="Severity"
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            options={[
              { value: 'all', label: 'All Severities' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'investigating', label: 'Investigating' },
              { value: 'resolved', label: 'Resolved' }
            ]}
          />
          <Select
            label="Date Range"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            options={[
              { value: '7', label: 'Last 7 Days' },
              { value: '30', label: 'Last 30 Days' },
              { value: '90', label: 'Last 90 Days' },
              { value: 'all', label: 'All Time' }
            ]}
          />
        </div>
      </Card>

      {/* Incidents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1AAE9F]"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Facility</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Downtime</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIncidents.slice(0, 50).map((incident) => (
                  <tr key={incident.incident_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{incident.facility}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{incident.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{incident.type}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getSeverityColor(incident.severity) as any}>
                        {incident.severity}
                  </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(incident.status) as any}>
                        {incident.status}
                  </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{incident.asset_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{incident.downtime_minutes}m</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{incident.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
                </div>
        {filteredIncidents.length > 50 && (
          <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
            Showing 50 of {filteredIncidents.length} incidents. Use filters to narrow results.
          </div>
        )}
        </Card>
    </div>
  );
};
