import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { AlertTriangle, Eye, EyeOff, Shield, MapPin, Activity, Clock, DollarSign } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { GOOGLE_MAPS_API_KEY } from '../../config/maps';

// Dummy data for CO₂ storage facilities
const carbonStorageSites = [
  { id: 1, name: "Bayou Carbon Site", lat: 30.45, lng: -91.15, age: 18, maintenanceCost: 400000, disasterRisk: 0.7 },
  { id: 2, name: "Pelican CO2 Reserve", lat: 30.95, lng: -91.55, age: 6, maintenanceCost: 180000, disasterRisk: 0.3 },
  { id: 3, name: "Cajun Storage Facility", lat: 30.25, lng: -92.05, age: 12, maintenanceCost: 320000, disasterRisk: 0.5 },
  { id: 4, name: "Delta Underground Reserve", lat: 29.85, lng: -90.95, age: 22, maintenanceCost: 550000, disasterRisk: 0.8 },
  { id: 5, name: "Gulf Coast Carbon Hub", lat: 30.15, lng: -91.35, age: 8, maintenanceCost: 220000, disasterRisk: 0.4 },
  { id: 6, name: "Red River Storage Complex", lat: 31.05, lng: -92.15, age: 15, maintenanceCost: 380000, disasterRisk: 0.6 },
  { id: 7, name: "Mississippi Delta Storage", lat: 29.95, lng: -90.15, age: 25, maintenanceCost: 650000, disasterRisk: 0.9 },
  { id: 8, name: "Atchafalaya Carbon Facility", lat: 30.35, lng: -91.75, age: 4, maintenanceCost: 150000, disasterRisk: 0.2 },
  { id: 9, name: "Lake Charles Storage Hub", lat: 30.25, lng: -93.25, age: 20, maintenanceCost: 480000, disasterRisk: 0.7 },
  { id: 10, name: "Baton Rouge CO2 Center", lat: 30.45, lng: -91.15, age: 14, maintenanceCost: 350000, disasterRisk: 0.5 },
  { id: 11, name: "New Orleans Underground", lat: 29.95, lng: -90.05, age: 28, maintenanceCost: 720000, disasterRisk: 0.9 },
  { id: 12, name: "Lafayette Storage Complex", lat: 30.25, lng: -92.05, age: 9, maintenanceCost: 280000, disasterRisk: 0.4 },
  { id: 13, name: "Shreveport Carbon Reserve", lat: 32.45, lng: -93.75, age: 16, maintenanceCost: 420000, disasterRisk: 0.6 },
  { id: 14, name: "Monroe Storage Facility", lat: 32.55, lng: -92.15, age: 11, maintenanceCost: 310000, disasterRisk: 0.3 },
  { id: 15, name: "Alexandria CO2 Hub", lat: 31.25, lng: -92.45, age: 7, maintenanceCost: 190000, disasterRisk: 0.3 }
];

// Dummy data for water resources
const waterResources = [
  { id: 1, name: "Louisiana Aquifer A", lat: 30.55, lng: -91.25, contaminationLevel: "High", type: "Aquifer" },
  { id: 2, name: "Well B", lat: 30.75, lng: -91.45, contaminationLevel: "Low", type: "Well" },
  { id: 3, name: "Mississippi River Aquifer", lat: 30.35, lng: -91.85, contaminationLevel: "Medium", type: "Aquifer" },
  { id: 4, name: "Bayou Water Source", lat: 29.95, lng: -90.85, contaminationLevel: "High", type: "Surface Water" },
  { id: 5, name: "Gulf Coast Well Field", lat: 30.05, lng: -91.15, contaminationLevel: "Low", type: "Well" },
  { id: 6, name: "Atchafalaya Aquifer", lat: 30.65, lng: -91.75, contaminationLevel: "Medium", type: "Aquifer" },
  { id: 7, name: "Red River Aquifer", lat: 31.15, lng: -92.25, contaminationLevel: "Low", type: "Aquifer" },
  { id: 8, name: "Lake Pontchartrain Wells", lat: 30.15, lng: -90.15, contaminationLevel: "High", type: "Well" },
  { id: 9, name: "Sabine River Aquifer", lat: 30.85, lng: -93.35, contaminationLevel: "Medium", type: "Aquifer" },
  { id: 10, name: "Calcasieu River Source", lat: 30.25, lng: -93.25, contaminationLevel: "Low", type: "Surface Water" },
  { id: 11, name: "Ouachita River Wells", lat: 32.35, lng: -92.15, contaminationLevel: "Medium", type: "Well" },
  { id: 12, name: "Tensas River Aquifer", lat: 32.05, lng: -91.25, contaminationLevel: "Low", type: "Aquifer" },
  { id: 13, name: "Pearl River Source", lat: 30.75, lng: -89.85, contaminationLevel: "High", type: "Surface Water" },
  { id: 14, name: "Bogue Chitto Wells", lat: 30.85, lng: -90.15, contaminationLevel: "Medium", type: "Well" },
  { id: 15, name: "Amite River Aquifer", lat: 30.45, lng: -90.85, contaminationLevel: "Low", type: "Aquifer" }
];

// Risk calculation formula
const calculateRisk = (age: number, maintenanceCost: number, disasterRisk: number): number => {
  return (age / 20) + (maintenanceCost / 500000) + disasterRisk;
};

const mapContainerStyle = {
  width: '100%',
  height: '700px',
  borderRadius: '12px',
};

const center = {
  lat: 30.9843,
  lng: -91.9623,
};

export const SafetyAlertPage: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [selectedWater, setSelectedWater] = useState<any>(null);
  const [showCO2Sites, setShowCO2Sites] = useState(true);
  const [showWaterResources, setShowWaterResources] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [highRiskSites, setHighRiskSites] = useState<any[]>([]);
  const [louisianaPolygons, setLouisianaPolygons] = useState<google.maps.LatLngLiteral[][]>([]);

  const { isLoaded: isMapsApiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Calculate high-risk sites
  useEffect(() => {
    const highRisk = carbonStorageSites.filter(site => {
      const risk = calculateRisk(site.age, site.maintenanceCost, site.disasterRisk);
      return risk > 1.5;
    });
    setHighRiskSites(highRisk);
  }, []);

  // Load Louisiana boundary
  useEffect(() => {
    if (!isMapsApiLoaded) return;

    fetch('/data/louisiana.json')
      .then(response => response.json())
      .then(data => {
        if (data?.geometry?.coordinates) {
          const multiPolygons: number[][][][] = data.geometry.coordinates;
          const polygons: google.maps.LatLngLiteral[][] = multiPolygons.map((polygon) => {
            const exteriorRing = polygon[0] || [];
            return exteriorRing.map(([lng, lat]) => ({ lat, lng }));
          }).filter((ring) => ring.length > 0);
          
          setLouisianaPolygons(polygons);
        }
      })
      .catch(error => console.error('Error loading Louisiana GeoJSON:', error));
  }, [isMapsApiLoaded]);

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <Card className="p-16 text-center shadow-lg">
            <AlertTriangle className="text-red-500 mx-auto mb-6" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Map Loading Error</h3>
            <p className="text-gray-600 text-lg">Unable to load the safety monitoring map. Please refresh the page or try again later.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!isMapsApiLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <Card className="p-16 text-center shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Safety Map</h3>
            <p className="text-gray-600 text-lg">Initializing environmental monitoring system...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
        {/* Hero Section - Asymmetric Layout */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  Environmental Safety
                  <span className="block text-red-600">Monitoring System</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Real-time monitoring of CO₂ storage facilities and water resources across Louisiana. 
                  Track contamination risks, facility performance, and environmental safety metrics.
                </p>
              </div>
            </div>
            
            {/* Offset Visual Element */}
            <div className="lg:col-span-4 lg:ml-8">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{highRiskSites.length}</div>
                  <div className="text-red-100">High Risk Sites</div>
                  <div className="text-sm text-red-200 mt-2">Requiring Attention</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Statistics - Creative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{highRiskSites.length}</div>
                <div className="text-sm text-gray-600">High Risk Sites</div>
                <div className="text-xs text-red-600 font-medium mt-1">Immediate attention</div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{carbonStorageSites.length}</div>
                <div className="text-sm text-gray-600">CO₂ Storage Facilities</div>
                <div className="text-xs text-blue-600 font-medium mt-1">Statewide coverage</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{waterResources.length}</div>
                <div className="text-sm text-gray-600">Water Resources</div>
                <div className="text-xs text-cyan-600 font-medium mt-1">Protected sources</div>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Shield className="text-cyan-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {carbonStorageSites.length - highRiskSites.length}
                </div>
                <div className="text-sm text-gray-600">Safe Sites</div>
                <div className="text-xs text-green-600 font-medium mt-1">Operating normally</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="text-green-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Map Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Activity className="text-red-600" size={28} />
                Contamination Risk Assessment
              </h2>
              <p className="text-gray-600">Interactive map showing CO₂ storage facilities, water resources, and contamination risk zones</p>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-gray-600">CO₂ Storage Facility</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span className="text-gray-600">Water Resource</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-gray-600">High Risk Zone</span>
              </div>
            </div>
          </div>
          
          <Card className="p-6 shadow-lg">
            <div className="relative">
              {/* Safety Alert Summary Card */}
              <div className="absolute top-4 right-4 z-10">
                <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-red-500" size={20} />
                    <h3 className="font-bold text-gray-900">Risk Summary</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">High Risk Sites:</span>
                      <Badge variant="error" size="sm">{highRiskSites.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total CO₂ Sites:</span>
                      <span className="font-medium">{carbonStorageSites.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water Resources:</span>
                      <span className="font-medium">{waterResources.length}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Control Panel */}
              <div className="absolute top-4 left-4 z-10">
                <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Map Controls</h3>
                  <div className="space-y-2">
                    <Button
                      variant={showCO2Sites ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setShowCO2Sites(!showCO2Sites)}
                      className="w-full justify-start"
                    >
                      {showCO2Sites ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="ml-2">CO₂ Sites ({carbonStorageSites.length})</span>
                    </Button>
                    <Button
                      variant={showWaterResources ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setShowWaterResources(!showWaterResources)}
                      className="w-full justify-start"
                    >
                      {showWaterResources ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="ml-2">Water Resources ({waterResources.length})</span>
                    </Button>
                    <Button
                      variant={showRiskZones ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setShowRiskZones(!showRiskZones)}
                      className="w-full justify-start"
                    >
                      {showRiskZones ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="ml-2">Risk Zones ({highRiskSites.length})</span>
                    </Button>
                  </div>
                </Card>
              </div>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={7}
                options={{
                  styles: [
                    {
                      featureType: 'all',
                      elementType: 'geometry',
                      stylers: [{ color: '#242424' }],
                    },
                    {
                      featureType: 'all',
                      elementType: 'labels.text.stroke',
                      stylers: [{ color: '#242424' }],
                    },
                    {
                      featureType: 'all',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#ffffff' }],
                    },
                    {
                      featureType: 'water',
                      elementType: 'geometry',
                      stylers: [{ color: '#1a1a2e' }],
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#515c6d' }],
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.stroke',
                      stylers: [{ color: '#17263c' }],
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry.fill',
                      stylers: [{ color: '#2c2c2c' }],
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry.stroke',
                      stylers: [{ color: '#404040' }],
                    },
                    {
                      featureType: 'road',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#ffffff' }],
                    },
                    {
                      featureType: 'road',
                      elementType: 'labels.text.stroke',
                      stylers: [{ color: '#242424' }],
                    },
                    {
                      featureType: 'poi',
                      elementType: 'geometry',
                      stylers: [{ color: '#2c2c2c' }],
                    },
                    {
                      featureType: 'poi',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#ffffff' }],
                    },
                    {
                      featureType: 'administrative',
                      elementType: 'geometry',
                      stylers: [{ color: '#2c2c2c' }],
                    },
                    {
                      featureType: 'administrative',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#ffffff' }],
                    },
                  ],
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: true,
                  clickableIcons: true,
                }}
              >
                {/* Louisiana Border */}
                {louisianaPolygons.map((ring, idx) => (
                  <Polygon
                    key={`louisiana-polygon-${idx}`}
                    paths={ring}
                    options={{
                      strokeColor: '#ff6b6b',
                      strokeOpacity: 0.9,
                      strokeWeight: 3,
                      fillColor: '#ff6b6b',
                      fillOpacity: 0.15,
                      clickable: false,
                      zIndex: 1,
                    }}
                  />
                ))}

                {/* CO₂ Storage Sites */}
                {showCO2Sites && carbonStorageSites.map((site) => {
                  const risk = calculateRisk(site.age, site.maintenanceCost, site.disasterRisk);
                  const isHighRisk = risk > 1.5;
                  const riskLevel = risk > 2.0 ? 'critical' : risk > 1.5 ? 'high' : risk > 1.0 ? 'medium' : 'low';
                  
                  return (
                    <React.Fragment key={`co2-site-${site.id}`}>
                      <Marker
                        position={{ lat: site.lat, lng: site.lng }}
                        title={`${site.name} - Risk: ${riskLevel.toUpperCase()}`}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <filter id="glow">
                                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                  <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                              </defs>
                              <circle cx="20" cy="20" r="16" fill="${isHighRisk ? '#ef4444' : '#3b82f6'}" stroke="white" stroke-width="3" filter="${isHighRisk ? 'url(#glow)' : 'none'}"/>
                              <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">CO₂</text>
                              ${isHighRisk ? '<circle cx="20" cy="20" r="18" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6"><animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite"/></circle>' : ''}
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(40, 40),
                          anchor: new window.google.maps.Point(20, 20),
                        }}
                        onClick={() => setSelectedSite(site)}
                        zIndex={1000}
                      />
                      
                      {/* Risk Zone Circles */}
                      {isHighRisk && showRiskZones && (
                        <>
                          <Circle
                            center={{ lat: site.lat, lng: site.lng }}
                            radius={8000} // 8km radius
                            options={{
                              strokeColor: '#ef4444',
                              strokeOpacity: 0.8,
                              strokeWeight: 4,
                              fillColor: '#ef4444',
                              fillOpacity: 0.1,
                              clickable: false,
                              zIndex: 500,
                            }}
                          />
                          <Circle
                            center={{ lat: site.lat, lng: site.lng }}
                            radius={12000} // 12km radius
                            options={{
                              strokeColor: '#ef4444',
                              strokeOpacity: 0.4,
                              strokeWeight: 2,
                              fillColor: '#ef4444',
                              fillOpacity: 0.05,
                              clickable: false,
                              zIndex: 400,
                            }}
                          />
                        </>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Water Resources */}
                {showWaterResources && waterResources.map((water) => {
                  const nearbyHighRiskSites = highRiskSites.filter(site => {
                    const distance = Math.sqrt(
                      Math.pow(site.lat - water.lat, 2) + Math.pow(site.lng - water.lng, 2)
                    );
                    return distance < 0.15; // Within ~15km
                  });
                  
                  const isHighRisk = nearbyHighRiskSites.length > 0;
                  const contaminationColor = water.contaminationLevel === 'High' ? '#ef4444' : 
                                            water.contaminationLevel === 'Medium' ? '#f59e0b' : '#06b6d4';
                  
                  return (
                    <React.Fragment key={`water-${water.id}`}>
                      <Marker
                        position={{ lat: water.lat, lng: water.lng }}
                        title={`${water.name} - ${water.type} (${water.contaminationLevel} Risk)`}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <filter id="waterGlow">
                                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                  <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                              </defs>
                              <path d="M18 3C14 7 10 9 10 15c0 4.4 3.6 8 8 8s8-3.6 8-8c0-6-4-8-8-12z" fill="${isHighRisk ? '#ef4444' : contaminationColor}" stroke="white" stroke-width="2" filter="${isHighRisk ? 'url(#waterGlow)' : 'none'}"/>
                              <text x="18" y="22" text-anchor="middle" fill="white" font-size="10" font-weight="bold">H₂O</text>
                              ${isHighRisk ? '<circle cx="18" cy="18" r="20" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.5"><animate attributeName="r" values="20;26;20" dur="3s" repeatCount="indefinite"/></circle>' : ''}
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(36, 36),
                          anchor: new window.google.maps.Point(18, 18),
                        }}
                        onClick={() => setSelectedWater(water)}
                        zIndex={1000}
                      />
                      
                      {/* High Risk Alert Circles */}
                      {isHighRisk && showRiskZones && (
                        <>
                          <Circle
                            center={{ lat: water.lat, lng: water.lng }}
                            radius={5000} // 5km radius
                            options={{
                              strokeColor: '#ef4444',
                              strokeOpacity: 0.9,
                              strokeWeight: 5,
                              fillColor: '#ef4444',
                              fillOpacity: 0.15,
                              clickable: false,
                              zIndex: 600,
                            }}
                          />
                          <Circle
                            center={{ lat: water.lat, lng: water.lng }}
                            radius={8000} // 8km radius
                            options={{
                              strokeColor: '#ef4444',
                              strokeOpacity: 0.5,
                              strokeWeight: 3,
                              fillColor: '#ef4444',
                              fillOpacity: 0.08,
                              clickable: false,
                              zIndex: 550,
                            }}
                          />
                        </>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* CO₂ Site Info Window */}
                {selectedSite && (
                  <InfoWindow
                    position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
                    onCloseClick={() => setSelectedSite(null)}
                  >
                    <div style={{ padding: '8px', minWidth: '200px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                        {selectedSite.name}
                      </h3>
                      <div style={{ marginBottom: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                          Age:
                        </p>
                        <p style={{ margin: 0, color: '#1F2937', fontSize: '14px' }}>
                          {selectedSite.age} years
                        </p>
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                          Maintenance Cost:
                        </p>
                        <p style={{ margin: 0, color: '#059669', fontSize: '14px', fontWeight: 'bold' }}>
                          ${selectedSite.maintenanceCost.toLocaleString()}/year
                        </p>
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                          Disaster Risk:
                        </p>
                        <p style={{ margin: 0, color: '#DC2626', fontSize: '14px', fontWeight: 'bold' }}>
                          {(selectedSite.disasterRisk * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                          Risk Score:
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: calculateRisk(selectedSite.age, selectedSite.maintenanceCost, selectedSite.disasterRisk) > 1.5 ? '#DC2626' : '#059669', 
                          fontSize: '16px', 
                          fontWeight: 'bold' 
                        }}>
                          {calculateRisk(selectedSite.age, selectedSite.maintenanceCost, selectedSite.disasterRisk).toFixed(2)}
                          {calculateRisk(selectedSite.age, selectedSite.maintenanceCost, selectedSite.disasterRisk) > 1.5 && ' ⚠️'}
                        </p>
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {/* Water Resource Info Window */}
                {selectedWater && (
                  <InfoWindow
                    position={{ lat: selectedWater.lat, lng: selectedWater.lng }}
                    onCloseClick={() => setSelectedWater(null)}
                  >
                    <div style={{ padding: '8px', minWidth: '200px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                        {selectedWater.name}
                      </h3>
                      <div style={{ marginBottom: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                          Type:
                        </p>
                        <p style={{ margin: 0, color: '#1F2937', fontSize: '14px' }}>
                          {selectedWater.type}
                        </p>
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                          Contamination Level:
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: selectedWater.contaminationLevel === 'High' ? '#DC2626' : 
                                 selectedWater.contaminationLevel === 'Medium' ? '#F59E0B' : '#059669', 
                          fontSize: '14px', 
                          fontWeight: 'bold' 
                        }}>
                          {selectedWater.contaminationLevel}
                        </p>
                      </div>
                      {highRiskSites.some(site => {
                        const distance = Math.sqrt(
                          Math.pow(site.lat - selectedWater.lat, 2) + Math.pow(site.lng - selectedWater.lng, 2)
                        );
                        return distance < 0.1;
                      }) && (
                        <div style={{ marginTop: '8px', padding: '6px', backgroundColor: '#FEF2F2', borderRadius: '4px', border: '1px solid #FECACA' }}>
                          <p style={{ margin: 0, color: '#DC2626', fontSize: '12px', fontWeight: 'bold' }}>
                            ⚠️ HIGH RISK ZONE - Near CO₂ storage facility
                          </p>
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
            
            <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-4">
                <Shield className="text-yellow-600 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2 text-lg">Safety Monitoring</h3>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    This map monitors CO₂ storage facilities and nearby water resources for contamination risks. 
                    High-risk zones are determined by facility age, maintenance costs, and natural disaster vulnerability. 
                    Click on markers for detailed information about each site.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Risk Assessment Information - Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment Methodology</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Risk Calculation Formula</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Risk Score = (Age ÷ 20) + (Maintenance Cost ÷ 500,000) + Disaster Risk
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Age Factor</p>
                      <p>Years since facility construction</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Maintenance Factor</p>
                      <p>Annual maintenance spending</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Disaster Factor</p>
                      <p>Natural disaster vulnerability (0-1)</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-semibold">
                      High Risk Threshold: Score &gt; 1.5
                    </p>
                  </div>
                </div>
                
                <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3 text-lg">High Risk Indicators</h3>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Facilities older than 15 years</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign size={16} />
                      <span>High maintenance costs (&gt;$400K/year)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>Located in hurricane/flood zones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>Proximity to critical water sources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Safety Measures</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Continuous Monitoring</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Real-time monitoring of CO₂ storage facilities and surrounding water resources with automated alerts.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Risk Assessment</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Automated risk scoring based on facility age, maintenance, and environmental factors.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Early Warning</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Immediate alerts for high-risk zones and potential contamination threats to communities.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
