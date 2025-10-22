import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { Pipeline, Facility } from '../../types';
import { pipelineAPI, getPipelineTypeColor, getPipelineStatusColor } from '../../utils/pipelineAPI';
import { GOOGLE_MAPS_API_KEY } from '../../config/maps';

interface PipelineMapProps {
  facilities?: Facility[];
  showFacilities?: boolean;
  showPipelines?: boolean;
  selectedPipelineType?: Pipeline['pipelineType'];
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
};

const center = {
  lat: 31.0,
  lng: -92.0,
};

// Function to create direction arrow icon
const createDirectionArrow = (color: string, rotation: number) => {
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="rotate(${rotation})">
        <defs>
          <filter id="arrowGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M12 2 L20 12 L12 10 L12 2 Z" fill="${color}" filter="url(#arrowGlow)" opacity="0.9"/>
        <circle cx="12" cy="12" r="3" fill="${color}" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(24, 24),
    anchor: new window.google.maps.Point(12, 12),
  };
};

// Function to calculate bearing between two points
const calculateBearing = (startLat: number, startLng: number, endLat: number, endLng: number): number => {
  const dLng = (endLng - startLng) * Math.PI / 180;
  const lat1 = startLat * Math.PI / 180;
  const lat2 = endLat * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  return (bearing + 360) % 360;
};

// Function to create flowing pipeline icon (for future use)
// const createFlowingPipelineIcon = (color: string) => {
//   return {
//     url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
//       <svg width="32" height="8" viewBox="0 0 32 8" xmlns="http://www.w3.org/2000/svg">
//         <defs>
//           <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="8" height="8">
//             <rect width="8" height="8" fill="none"/>
//             <circle cx="4" cy="4" r="1" fill="${color}" opacity="0.8">
//               <animate attributeName="cx" values="0;8;0" dur="1.5s" repeatCount="indefinite"/>
//             </circle>
//           </pattern>
//         </defs>
//         <rect width="32" height="8" fill="url(#flowPattern)" rx="4"/>
//         <rect width="32" height="8" fill="none" stroke="${color}" stroke-width="2" rx="4"/>
//       </svg>
//     `),
//     scaledSize: new window.google.maps.Size(32, 8),
//     anchor: new window.google.maps.Point(16, 4),
//   };
// };

export const PipelineMap: React.FC<PipelineMapProps> = ({
  facilities = [],
  showFacilities = true,
  showPipelines = true,
  selectedPipelineType,
}) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [louisianaPolygons, setLouisianaPolygons] = useState<google.maps.LatLngLiteral[][]>([]);
  const [animationEnabled] = useState(true);

  const { isLoaded: isMapsApiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Load pipelines data
  useEffect(() => {
    const loadPipelines = async () => {
      try {
        const allPipelines = await pipelineAPI.getAllPipelines();
        setPipelines(allPipelines);
      } catch (error) {
        console.error('Failed to load pipelines:', error);
      }
    };

    loadPipelines();
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

  // Filter pipelines based on selected criteria
  const filteredPipelines = pipelines.filter(pipeline => {
    if (selectedPipelineType && pipeline.pipelineType !== selectedPipelineType) return false;
    return true;
  });

  // Handle pipeline polyline click
  const handlePipelineClick = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
  };

  if (loadError) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ color: '#DC2626', marginBottom: '8px' }}>Map Loading Error</h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Unable to load Google Maps. Please check your API key and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!isMapsApiLoaded) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        borderRadius: '8px',
        backgroundColor: '#eef2f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#174B7A]"></div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={7}
      options={{
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9e7f7' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#7ba3c2' }],
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
            strokeColor: '#800000',
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: '#ffe8b3',
            fillOpacity: 0.12,
            clickable: false,
            zIndex: 1,
          }}
        />
      ))}

      {/* Facility Markers */}
      {showFacilities && facilities.map((facility) => (
        <Marker
          key={`facility-${facility.id}`}
          position={{ lat: facility.lat, lng: facility.lon }}
          title={facility.name}
          icon={{
            url: '/image/factory.png',
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 24),
          }}
          zIndex={1000}
          // Note: Using legacy Marker for compatibility
          // Consider migrating to AdvancedMarkerElement in future updates
        />
      ))}

      {/* Pipeline Polylines */}
      {showPipelines && filteredPipelines.map((pipeline) => {
        const color = getPipelineTypeColor(pipeline.pipelineType);
        const opacity = pipeline.status === 'ACTIVE' ? 0.85 : 
                       pipeline.status === 'UNDER_CONSTRUCTION' ? 0.6 : 0.4;
        const isActive = pipeline.status === 'ACTIVE';
        const strokeWeight = isActive ? 5 : 3;
        
        return (
          <React.Fragment key={`pipeline-${pipeline.id}`}>
            {/* Main Pipeline Line - Cleaner Design */}
            <Polyline
              path={pipeline.routeCoordinates.map(([lat, lng]) => ({ lat, lng }))}
              options={{
                strokeColor: color,
                strokeOpacity: opacity,
                strokeWeight: strokeWeight,
                clickable: true,
                zIndex: 100,
                geodesic: true,
              }}
              onClick={() => handlePipelineClick(pipeline)}
            />
            
            {/* Direction Arrows - Only for active pipelines, positioned strategically */}
            {isActive && animationEnabled && pipeline.routeCoordinates.length > 1 && (
              <>
                {/* Show arrows at 25%, 50%, and 75% of the route */}
                {[0.25, 0.5, 0.75].map((ratio) => {
                  const index = Math.floor((pipeline.routeCoordinates.length - 1) * ratio);
                  const nextIndex = Math.min(index + 1, pipeline.routeCoordinates.length - 1);
                  
                  const [startLat, startLng] = pipeline.routeCoordinates[index];
                  const [endLat, endLng] = pipeline.routeCoordinates[nextIndex];
                  
                  // Calculate midpoint
                  const midLat = (startLat + endLat) / 2;
                  const midLng = (startLng + endLng) / 2;
                  
                  // Calculate bearing for arrow rotation
                  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
                  
                  return (
                    <Marker
                      key={`arrow-${pipeline.id}-${ratio}`}
                      position={{ lat: midLat, lng: midLng }}
                      icon={createDirectionArrow(color, bearing)}
                      zIndex={250}
                      clickable={false}
                    />
                  );
                })}
              </>
            )}
            
            {/* Start Marker - Source */}
            {pipeline.routeCoordinates.length > 0 && (
              <Marker
                position={{ 
                  lat: pipeline.routeCoordinates[0][0], 
                  lng: pipeline.routeCoordinates[0][1] 
                }}
                title={`Source: ${pipeline.name}`}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" fill="${color}" stroke="white" stroke-width="2"/>
                      <circle cx="10" cy="10" r="5" fill="white" opacity="0.6"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(20, 20),
                  anchor: new window.google.maps.Point(10, 10),
                }}
                zIndex={150}
              />
            )}
            
            {/* End Marker - Destination */}
            {pipeline.routeCoordinates.length > 1 && (
              <Marker
                position={{ 
                  lat: pipeline.routeCoordinates[pipeline.routeCoordinates.length - 1][0], 
                  lng: pipeline.routeCoordinates[pipeline.routeCoordinates.length - 1][1] 
                }}
                title={`Destination: ${pipeline.name}`}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" fill="${color}" stroke="white" stroke-width="2"/>
                      <rect x="6" y="6" width="8" height="8" fill="white" opacity="0.6"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(20, 20),
                  anchor: new window.google.maps.Point(10, 10),
                }}
                zIndex={150}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Pipeline Info Window */}
      {selectedPipeline && (
        <InfoWindow
          position={{
            lat: selectedPipeline.routeCoordinates[0][0],
            lng: selectedPipeline.routeCoordinates[0][1]
          }}
          onCloseClick={() => setSelectedPipeline(null)}
        >
          <div style={{ padding: '12px', minWidth: '280px', maxWidth: '320px' }}>
            <h3 style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#174B7A',
              fontSize: '16px',
              borderBottom: '2px solid #1AAE9F',
              paddingBottom: '6px'
            }}>
              {selectedPipeline.name}
            </h3>
            
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: getPipelineTypeColor(selectedPipeline.pipelineType),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginRight: '8px'
              }}>
                {selectedPipeline.pipelineType.replace('CO2_', '')}
              </span>
              <span style={{
                display: 'inline-block',
                backgroundColor: getPipelineStatusColor(selectedPipeline.status),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {selectedPipeline.status.replace('_', ' ')}
              </span>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                Operator:
              </p>
              <p style={{ margin: 0, color: '#1F2937', fontSize: '14px' }}>
                {selectedPipeline.operator}
              </p>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                Capacity:
              </p>
              <p style={{ margin: 0, color: '#10B981', fontSize: '16px', fontWeight: 'bold' }}>
                {(selectedPipeline.capacity / 1000).toFixed(0)}K tons/year
              </p>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                Length:
              </p>
              <p style={{ margin: 0, color: '#3B82F6', fontSize: '14px' }}>
                {selectedPipeline.length.toFixed(1)} miles
              </p>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
                Diameter:
              </p>
              <p style={{ margin: 0, color: '#F59E0B', fontSize: '14px' }}>
                {selectedPipeline.diameter.toFixed(0)} inches
              </p>
            </div>

            <p style={{
              margin: '8px 0 0 0',
              color: '#9CA3AF',
              fontSize: '11px',
              borderTop: '1px solid #E5E7EB',
              paddingTop: '6px'
            }}>
              📍 {selectedPipeline.routeCoordinates.length} route points
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};
