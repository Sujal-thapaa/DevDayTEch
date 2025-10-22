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
  selectedStatus?: Pipeline['status'];
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

// Function to create flowing gas particles animation
const createFlowingGasIcon = (color: string, size: number = 12) => {
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="gasGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="12" cy="12" r="4" fill="${color}" filter="url(#gasGlow)" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="scale" values="0.8;1.2;0.8" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="8" cy="8" r="2" fill="${color}" opacity="0.6">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="16" cy="16" r="2" fill="${color}" opacity="0.6">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size/2, size/2),
  };
};

// Function to create flowing pipeline segments with moving particles
const createFlowingSegment = (startCoord: [number, number], endCoord: [number, number], color: string, pipelineId: string, segmentIndex: number) => {
  const [startLat, startLng] = startCoord;
  const [endLat, endLng] = endCoord;
  
  // Create multiple flowing particles along the segment
  const particles = [];
  for (let i = 0; i <= 4; i++) {
    const ratio = i / 4;
    const lat = startLat + (endLat - startLat) * ratio;
    const lng = startLng + (endLng - startLng) * ratio;
    
    particles.push(
      <Marker
        key={`particle-${pipelineId}-${segmentIndex}-${i}`}
        position={{ lat, lng }}
        icon={createFlowingGasIcon(color, 10)}
        zIndex={250}
        clickable={false}
      />
    );
  }
  
  return particles;
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
  selectedStatus
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
    if (selectedStatus && pipeline.status !== selectedStatus) return false;
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
        const opacity = pipeline.status === 'ACTIVE' ? 0.8 : 
                       pipeline.status === 'UNDER_CONSTRUCTION' ? 0.6 : 0.4;
        const isActive = pipeline.status === 'ACTIVE';
        
        return (
          <React.Fragment key={`pipeline-${pipeline.id}`}>
            {/* Main Pipeline Line with Enhanced Visual */}
            <Polyline
              path={pipeline.routeCoordinates.map(([lat, lng]) => ({ lat, lng }))}
              options={{
                strokeColor: color,
                strokeOpacity: opacity,
                strokeWeight: isActive ? Math.max(8, pipeline.diameter / 2) : Math.max(4, pipeline.diameter / 4),
                clickable: true,
                zIndex: 100,
              }}
              onClick={() => handlePipelineClick(pipeline)}
            />
            
            {/* Secondary Pipeline Line for Depth Effect */}
            {isActive && (
              <Polyline
                path={pipeline.routeCoordinates.map(([lat, lng]) => ({ lat, lng }))}
                options={{
                  strokeColor: '#ffffff',
                  strokeOpacity: 0.3,
                  strokeWeight: isActive ? Math.max(6, pipeline.diameter / 2.5) : Math.max(3, pipeline.diameter / 5),
                  clickable: false,
                  zIndex: 99,
                }}
              />
            )}
            
            {/* Flowing Gas Particles */}
            {isActive && animationEnabled && pipeline.routeCoordinates.length > 1 && (
              <>
                {pipeline.routeCoordinates.slice(0, -1).map((coord, index) => {
                  const nextCoord = pipeline.routeCoordinates[index + 1];
                  return createFlowingSegment(coord, nextCoord, color, pipeline.id, index);
                })}
              </>
            )}
            
            {/* Start and End Facility Markers */}
            {pipeline.routeCoordinates.length > 0 && (
              <>
                <Marker
                  position={{ 
                    lat: pipeline.routeCoordinates[0][0], 
                    lng: pipeline.routeCoordinates[0][1] 
                  }}
                  title={`Source: ${pipeline.name}`}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <filter id="sourceGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge> 
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="3" filter="url(#sourceGlow)"/>
                        <circle cx="14" cy="14" r="8" fill="white" opacity="0.3"/>
                        <text x="14" y="18" text-anchor="middle" fill="white" font-size="12" font-weight="bold">⚡</text>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(28, 28),
                    anchor: new window.google.maps.Point(14, 14),
                  }}
                  zIndex={150}
                />
                <Marker
                  position={{ 
                    lat: pipeline.routeCoordinates[pipeline.routeCoordinates.length - 1][0], 
                    lng: pipeline.routeCoordinates[pipeline.routeCoordinates.length - 1][1] 
                  }}
                  title={`Destination: ${pipeline.name}`}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <filter id="destGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge> 
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="3" filter="url(#destGlow)"/>
                        <circle cx="14" cy="14" r="8" fill="white" opacity="0.3"/>
                        <text x="14" y="18" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🏭</text>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(28, 28),
                    anchor: new window.google.maps.Point(14, 14),
                  }}
                  zIndex={150}
                />
              </>
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
