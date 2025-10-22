import React, { useEffect, useState } from 'react';
import { MapPin, TrendingUp, Users, Briefcase, Route, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FacilityMap } from '../../components/maps/FacilityMap';
import { PipelineMap } from '../../components/maps/PipelineMap';
import { MapControls } from '../../components/maps/MapControls';
import { GOOGLE_MAPS_API_KEY } from '../../config/maps';
import { Pipeline } from '../../types';
import { pipelineAPI } from '../../utils/pipelineAPI';

interface FacilityData {
  "Facility Name": string;
  "Sector": string;
  "Reporting Year": number;
  "Total CO2 (mt)": number;
  "Total CO2e (mt CO2e)": number;
  "Latitude": number;
  "Longitude": number;
}

export const PublicHomePage: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pipeline map state
  const [showFacilities, setShowFacilities] = useState(true);
  const [showPipelines, setShowPipelines] = useState(true);
  const [selectedPipelineType, setSelectedPipelineType] = useState<Pipeline['pipelineType']>();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isPipelineLoading, setIsPipelineLoading] = useState(true);

  useEffect(() => {
    // Load facility data from public folder
    fetch('/data/facility.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: FacilityData[]) => {
        console.log(`📥 Received ${data.length} facilities from facility.json`);
        
        // Transform data to match FacilityMap expected structure
        const transformedData = data
          .filter(facility => 
            facility.Latitude && 
            facility.Longitude && 
            !isNaN(facility.Latitude) && 
            !isNaN(facility.Longitude) &&
            facility.Latitude >= 28 && facility.Latitude <= 33 && // Louisiana bounds
            facility.Longitude >= -94 && facility.Longitude <= -88 // Louisiana bounds
          )
          .map((facility, index) => ({
            id: `facility-${index}`,
            name: facility["Facility Name"],
            lat: facility.Latitude,
            lng: facility.Longitude,
            type: facility.Sector,
            emissions: Math.round(facility["Total CO2e (mt CO2e)"]),
            unit: "mt CO2e",
            year: facility["Reporting Year"],
            status: facility.Sector.includes("Transport & Storage") ? "active" : "monitored"
          }));
        
        console.log(`✅ Transformed ${transformedData.length} facilities for map`);
        console.log('📍 First facility:', transformedData[0]);
        console.log('📍 Last facility:', transformedData[transformedData.length - 1]);
        
        setFacilities(transformedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('❌ Error loading facility data:', error);
        setIsLoading(false);
      });
  }, []);

  // Load pipeline data
  useEffect(() => {
    const loadPipelines = async () => {
      try {
        const allPipelines = await pipelineAPI.getAllPipelines();
        setPipelines(allPipelines);
      } catch (error) {
        console.error('Failed to load pipelines:', error);
      } finally {
        setIsPipelineLoading(false);
      }
    };

    loadPipelines();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-16">
        {/* Hero Section - Asymmetric Layout */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Louisiana's Carbon Capture
                  <span className="block text-green-600">Transparency Initiative</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Real-time monitoring of carbon capture operations across Louisiana. 
                  Track emissions, facility performance, and environmental impact with complete transparency.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <span className="font-medium">Live Data Updates</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <span className="font-medium">Community Access</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <span className="font-medium">Environmental Safety</span>
                </div>
              </div>
            </div>
            
            {/* Offset Visual Element */}
            <div className="lg:col-span-5 lg:ml-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">58.7K</div>
                      <div className="text-green-100">Tons CO₂ Captured</div>
                      <div className="text-sm text-green-200 mt-1">This Month</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{facilities.filter(f => f.status === 'active').length}</div>
                        <div className="text-sm text-green-200">Active Sites</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">247</div>
                        <div className="text-sm text-green-200">Jobs Created</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-emerald-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics - Creative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">58.7K</div>
                <div className="text-sm text-gray-600">Tons CO₂ Captured</div>
                <div className="text-xs text-green-600 font-medium mt-1">+12% vs last month</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {isLoading ? '...' : facilities.filter(f => f.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Facilities</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">Statewide coverage</div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <MapPin className="text-emerald-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">247</div>
                <div className="text-sm text-gray-600">Jobs Created</div>
                <div className="text-xs text-teal-600 font-medium mt-1">Local employment</div>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Users className="text-teal-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">$8.4M</div>
                <div className="text-sm text-gray-600">Annual Tax Revenue</div>
                <div className="text-xs text-green-600 font-medium mt-1">Community benefit</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="text-green-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Facility Locations Map */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Facility Locations</h2>
              <p className="text-gray-600">Interactive map showing carbon capture facilities across Louisiana</p>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-600">Active Capture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-gray-600">Monitored</span>
              </div>
            </div>
          </div>
          
          <Card className="p-6 shadow-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading facility data...</p>
                </div>
              </div>
            ) : (
              <>
                <FacilityMap facilities={facilities} apiKey={GOOGLE_MAPS_API_KEY} />
                <p className="text-sm text-gray-600 mt-4">
                  Interactive map showing {facilities.length} facilities across Louisiana. Click on markers for detailed information including facility type, emissions data, and location coordinates.
                </p>
              </>
            )}
          </Card>
        </div>

        {/* Pipeline Infrastructure Map */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Route className="text-green-600" size={28} />
                Pipeline Infrastructure
              </h2>
              <p className="text-gray-600">Transportation network connecting capture facilities to storage sites</p>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-600">Transport</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-gray-600">Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-gray-600">Utilization</span>
              </div>
            </div>
          </div>
          
          <Card className="p-6 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls Sidebar */}
              <div className="lg:col-span-1">
                <MapControls
                  showFacilities={showFacilities}
                  showPipelines={showPipelines}
                  selectedPipelineType={selectedPipelineType}
                  onToggleFacilities={() => setShowFacilities(!showFacilities)}
                  onTogglePipelines={() => setShowPipelines(!showPipelines)}
                  onPipelineTypeChange={setSelectedPipelineType}
                />
              </div>

              {/* Map Content */}
              <div className="lg:col-span-3">
                {isPipelineLoading ? (
                  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading pipeline data...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <PipelineMap
                      facilities={facilities}
                      showFacilities={showFacilities}
                      showPipelines={showPipelines}
                      selectedPipelineType={selectedPipelineType}
                    />
                    <p className="text-sm text-gray-600 mt-4">
                      Interactive map showing {pipelines.length} pipelines across Louisiana. Click on pipeline routes for detailed information including capacity, length, and operator details.
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* How It Works & Latest Updates - Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How Carbon Capture Works</h2>
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Capture</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Industrial facilities capture CO₂ from their operations before it enters the atmosphere. 
                      Advanced separation technologies extract carbon dioxide from flue gases.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Transport</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Captured CO₂ is compressed and transported via pipeline or truck to storage sites. 
                      Specialized infrastructure ensures safe and efficient delivery.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Store or Utilize</h3>
                    <p className="text-gray-600 leading-relaxed">
                      CO₂ is either permanently stored underground in geological formations or used in industrial processes 
                      like enhanced oil recovery and manufacturing.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Updates</h2>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="success" size="sm">
                      Milestone
                    </Badge>
                    <span className="text-xs text-gray-500">Oct 10, 2025</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Port Allen Reaches 100K Tons
                  </h3>
                  <p className="text-sm text-gray-600">
                    Port Allen Ethanol facility reaches 100,000 tons captured milestone, demonstrating consistent operational excellence.
                  </p>
                </div>
                
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="info" size="sm">
                      Report
                    </Badge>
                    <span className="text-xs text-gray-500">Oct 5, 2025</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Q3 Economic Impact Released
                  </h3>
                  <p className="text-sm text-gray-600">
                    New report shows 247 jobs created and $8.4M in annual tax revenue from carbon capture operations.
                  </p>
                </div>
                
                <div className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="neutral" size="sm">
                      Update
                    </Badge>
                    <span className="text-xs text-gray-500">Oct 1, 2025</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Enhanced Safety Dashboard
                  </h3>
                  <p className="text-sm text-gray-600">
                    New safety monitoring features provide real-time incident tracking and community alerts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Commitment Section */}
        <Card className="p-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Our Commitment to Transparency
            </h2>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              This portal provides the public with access to real-time data on carbon capture operations, 
              safety incidents, and economic benefits. We believe in open communication and community engagement 
              as essential components of responsible environmental stewardship.
            </p>
            <div className="flex justify-center">
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl">
                Explore Data
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
