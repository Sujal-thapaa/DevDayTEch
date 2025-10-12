import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, MapPin, Calendar, Building2, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface FacilityDetailPageProps {
  facilityName: string;
  onBack: () => void;
}

interface MonthlyStorage {
  Month: string;
  'Stored CO2 (mt)': number;
}

interface MonthlyInjected {
  Month: string;
  'Injected CO2 (mt)': number;
}

interface MonthlyTimeseries {
  Month: string;
  'Flare CO2 (mt)': number;
  'Tank CO2 (mt)': number;
  'Total CO2 (mt)': number;
}

interface YearlyData {
  Year: number;
  'Total CO2 (mt)': number;
  'Total CO2e (mt CO2e)': number;
}

interface VerificationData {
  'Verifier Name': string;
  'Verification Date': string;
  Status: string;
}

interface FacilityInfo {
  'Facility Name': string;
  Sector: string;
  Latitude: number;
  Longitude: number;
  'Reporting Year': number;
  'Total CO2 (mt)': number;
  'Total CO2e (mt CO2e)': number;
}

export const FacilityDetailPage: React.FC<FacilityDetailPageProps> = ({ facilityName, onBack }) => {
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>(null);
  const [storageData, setStorageData] = useState<MonthlyStorage[]>([]);
  const [injectedData, setInjectedData] = useState<MonthlyInjected[]>([]);
  const [timeseriesData, setTimeseriesData] = useState<MonthlyTimeseries[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load facility info
        const facilityResponse = await fetch('/data/facility.json');
        if (!facilityResponse.ok) {
          throw new Error(`Failed to load facility data: ${facilityResponse.status}`);
        }
        const facilityText = await facilityResponse.text();
        if (!facilityText || !facilityText.trim()) {
          throw new Error('Facility data is empty');
        }
        const facilities: FacilityInfo[] = JSON.parse(facilityText);
        const facility = facilities.find(f => f['Facility Name'] === facilityName);
        setFacilityInfo(facility || null);

        // Load storage data with error handling
        try {
          const storageResponse = await fetch('/data/CO2_storage_monthly.json');
          const storageText = await storageResponse.text();
          if (storageText && storageText.trim()) {
            const storage = JSON.parse(storageText);
            const facilityStorage = storage.filter((d: any) => d['Facility Name'] === facilityName);
            setStorageData(facilityStorage);
          }
        } catch (err) {
          console.warn('⚠️ Storage data not available:', err);
          setStorageData([]);
        }

        // Load injected data with error handling
        try {
          const injectedResponse = await fetch('/data/CO2_Injected.json');
          const injectedText = await injectedResponse.text();
          if (injectedText && injectedText.trim()) {
            const injected = JSON.parse(injectedText);
            const facilityInjected = injected.filter((d: any) => d['Facility Name'] === facilityName);
            setInjectedData(facilityInjected);
          }
        } catch (err) {
          console.warn('⚠️ Injected data not available:', err);
          setInjectedData([]);
        }

        // Load timeseries data with error handling
        try {
          const timeseriesResponse = await fetch('/data/Monthly_CO2_timeseries.json');
          const timeseriesText = await timeseriesResponse.text();
          if (timeseriesText && timeseriesText.trim()) {
            const timeseries = JSON.parse(timeseriesText);
            const facilityTimeseries = timeseries.filter((d: any) => d['Facility Name'] === facilityName);
            setTimeseriesData(facilityTimeseries);
          }
        } catch (err) {
          console.warn('⚠️ Timeseries data not available:', err);
          setTimeseriesData([]);
        }

        // Load yearly data with error handling
        try {
          const yearlyResponse = await fetch('/data/Yearly_CO2_timeline.json');
          const yearlyText = await yearlyResponse.text();
          if (yearlyText && yearlyText.trim()) {
            const yearly = JSON.parse(yearlyText);
            const facilityYearly = yearly.filter((d: any) => d['Facility Name'] === facilityName);
            setYearlyData(facilityYearly);
          }
        } catch (err) {
          console.warn('⚠️ Yearly data not available:', err);
          setYearlyData([]);
        }

        // Load verification data with error handling
        try {
          const verificationResponse = await fetch('/data/verification.json');
          const verificationText = await verificationResponse.text();
          if (verificationText && verificationText.trim()) {
            const verification = JSON.parse(verificationText);
            const facilityVerification = verification.find((d: any) => d['Facility Name'] === facilityName);
            setVerificationData(facilityVerification || null);
          }
        } catch (err) {
          console.warn('⚠️ Verification data not available:', err);
          setVerificationData(null);
        }

        console.log(`✅ Loaded data for facility: ${facilityName}`);
      } catch (error) {
        console.error('❌ Error loading facility data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [facilityName]);

  const getSectorColor = (sector: string): string => {
    const colors: { [key: string]: string } = {
      'Refining': 'bg-red-100 text-red-800',
      'Power': 'bg-blue-100 text-blue-800',
      'Petrochemical': 'bg-purple-100 text-purple-800',
      'Fertilizer': 'bg-green-100 text-green-800',
      'Cement': 'bg-gray-100 text-gray-800',
      'Biofuels': 'bg-yellow-100 text-yellow-800',
      'Pulp & Paper': 'bg-orange-100 text-orange-800',
      'Public Sector': 'bg-indigo-100 text-indigo-800',
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Verified') return <CheckCircle className="text-green-600" size={20} />;
    if (status === 'Pending') return <Clock className="text-yellow-600" size={20} />;
    return <AlertCircle className="text-orange-600" size={20} />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Verified') return <Badge variant="success">{status}</Badge>;
    if (status === 'Pending') return <Badge variant="warning">{status}</Badge>;
    return <Badge variant="info">{status}</Badge>;
  };

  const formatMonth = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#174B7A] hover:text-[#1AAE9F] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Facilities
        </button>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#174B7A]"></div>
        </div>
      </div>
    );
  }

  if (!facilityInfo) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#174B7A] hover:text-[#1AAE9F] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Facilities
        </button>
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Facility Not Found</h3>
          <p className="text-gray-600">The facility data could not be loaded.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#174B7A] hover:text-[#1AAE9F] transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Facilities
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#174B7A] to-[#1AAE9F] rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{facilityInfo['Facility Name']}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${getSectorColor(facilityInfo.Sector)} bg-white`}>
                {facilityInfo.Sector}
              </span>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin size={16} />
                <span className="text-sm">
                  {facilityInfo.Latitude.toFixed(4)}°N, {Math.abs(facilityInfo.Longitude).toFixed(4)}°W
                </span>
              </div>
              {verificationData && (
                <div className="flex items-center gap-2">
                  {getStatusIcon(verificationData.Status)}
                  {getStatusBadge(verificationData.Status)}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-1">Annual Emissions ({facilityInfo['Reporting Year']})</p>
            <p className="text-4xl font-bold">{(facilityInfo['Total CO2e (mt CO2e)'] / 1000).toFixed(1)}K</p>
            <p className="text-white/80 text-sm mt-1">mt CO₂e</p>
          </div>
        </div>
      </div>

      {/* Verification Info */}
      {verificationData && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Verification Status</h3>
              <p className="text-sm text-gray-600">Third-party verification information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Verifier</p>
              <p className="font-semibold text-gray-900">{verificationData['Verifier Name']}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Verification Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <p className="font-semibold text-gray-900">
                  {new Date(verificationData['Verification Date']).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationData.Status)}
                {getStatusBadge(verificationData.Status)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Yearly CO2 Trend (8 Years) */}
      {yearlyData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Historical CO₂ Emissions (8 Years)</h3>
              <p className="text-sm text-gray-600">Yearly emissions trend from {yearlyData[0]?.Year} to {yearlyData[yearlyData.length - 1]?.Year}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={yearlyData}>
              <defs>
                <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCO2e" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1AAE9F" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1AAE9F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [(value / 1000).toFixed(2) + 'K mt', '']}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Total CO2 (mt)" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorCO2)" 
                name="Total CO₂"
              />
              <Area 
                type="monotone" 
                dataKey="Total CO2e (mt CO2e)" 
                stroke="#1AAE9F" 
                fillOpacity={1} 
                fill="url(#colorCO2e)" 
                name="Total CO₂e"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Monthly Storage & Injection Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO2 Storage */}
        {storageData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly CO₂ Storage (12 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={storageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="Month" 
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  labelFormatter={formatMonth}
                  formatter={(value: number) => [(value / 1000).toFixed(2) + 'K mt', 'Stored']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Stored CO2 (mt)" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Stored CO₂"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* CO2 Injected */}
        {injectedData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly CO₂ Injected (12 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={injectedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="Month" 
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  labelFormatter={formatMonth}
                  formatter={(value: number) => [(value / 1000).toFixed(2) + 'K mt', 'Injected']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Injected CO2 (mt)" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Injected CO₂"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Monthly Timeseries - Flare vs Tank */}
      {timeseriesData.length > 0 ? (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Building2 className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Monthly CO₂ Breakdown</h3>
              <p className="text-sm text-gray-600">Flare, Tank, and Total emissions by month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={timeseriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Month" 
                tickFormatter={formatMonth}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                labelFormatter={formatMonth}
                formatter={(value: number) => [(value / 1000).toFixed(2) + 'K mt', '']}
              />
              <Legend />
              <Bar dataKey="Flare CO2 (mt)" fill="#ef4444" name="Flare CO₂" />
              <Bar dataKey="Tank CO2 (mt)" fill="#f59e0b" name="Tank CO₂" />
              <Line 
                type="monotone" 
                dataKey="Total CO2 (mt)" 
                stroke="#374151" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                name="Total CO₂"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <Building2 className="mx-auto mb-3 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Breakdown Data Not Available</h3>
          <p className="text-sm text-gray-500">Detailed monthly flare and tank data is not available for this facility.</p>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {storageData.length > 0 && (
          <Card className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Total CO₂ Stored (12M)</p>
            <p className="text-2xl font-bold text-green-600">
              {(storageData.reduce((sum, d) => sum + d['Stored CO2 (mt)'], 0) / 1000).toFixed(1)}K mt
            </p>
          </Card>
        )}
        {injectedData.length > 0 && (
          <Card className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Total CO₂ Injected (12M)</p>
            <p className="text-2xl font-bold text-blue-600">
              {(injectedData.reduce((sum, d) => sum + d['Injected CO2 (mt)'], 0) / 1000).toFixed(1)}K mt
            </p>
          </Card>
        )}
        {timeseriesData.length > 0 && (
          <>
            <Card className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Total Flare CO₂ (12M)</p>
              <p className="text-2xl font-bold text-red-600">
                {(timeseriesData.reduce((sum, d) => sum + d['Flare CO2 (mt)'], 0) / 1000).toFixed(1)}K mt
              </p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Total Tank CO₂ (12M)</p>
              <p className="text-2xl font-bold text-orange-600">
                {(timeseriesData.reduce((sum, d) => sum + d['Tank CO2 (mt)'], 0) / 1000).toFixed(1)}K mt
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

