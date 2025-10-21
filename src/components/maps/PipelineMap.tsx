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
  height: '500px',
  borderRadius: '8px',
};

const center = {
  lat: 31.0,
  lng: -92.0,
};

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
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
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
        
        return (
          <Polyline
            key={`pipeline-${pipeline.id}`}
            path={pipeline.routeCoordinates.map(([lat, lng]) => ({ lat, lng }))}
            options={{
              strokeColor: color,
              strokeOpacity: opacity,
              strokeWeight: pipeline.status === 'ACTIVE' ? 4 : 3,
              clickable: true,
              zIndex: 100,
            }}
            onClick={() => handlePipelineClick(pipeline)}
          />
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
