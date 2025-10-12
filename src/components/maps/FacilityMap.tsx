import React from 'react';
import { GoogleMap, Marker, InfoWindow, Polygon, useJsApiLoader } from '@react-google-maps/api';

interface Facility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  emissions: number;
  unit: string;
  year: number;
  status: 'active' | 'monitored';
}

interface FacilityMapProps {
  facilities: Facility[];
  apiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

// Initial center on Louisiana (will auto-adjust after loading)
const center = {
  lat: 31.0,
  lng: -92.0,
};

export const FacilityMap: React.FC<FacilityMapProps> = ({ facilities, apiKey }) => {
  const [selectedFacility, setSelectedFacility] = React.useState<Facility | null>(null);
  // Google Maps JS API loader with error handling
  const { isLoaded: isMapsApiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  // Handle Google Maps API loading errors
  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return (
      <div style={{
        width: '100%',
        height: '400px',
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
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [louisianaPolygons, setLouisianaPolygons] = React.useState<google.maps.LatLngLiteral[][]>([]);
  const [markersReady, setMarkersReady] = React.useState(false);

  // Debug: Log state changes
  React.useEffect(() => {
    console.log('🔍 FacilityMap State:', {
      isMapsApiLoaded,
      hasMap: !!map,
      markersReady,
      polygonsCount: louisianaPolygons.length,
      facilitiesCount: facilities.length
    });
    
    if (facilities.length > 0) {
      console.log('📍 Sample facility data:', facilities[0]);
      console.log(`📊 Total facilities to render: ${facilities.length}`);
    }
  }, [isMapsApiLoaded, map, markersReady, louisianaPolygons.length, facilities.length]);

  // Enable markers after map and API are loaded
  React.useEffect(() => {
    if (isMapsApiLoaded && map) {
      console.log('✅ Map and API ready, enabling markers in 300ms...');
      const timer = setTimeout(() => {
        setMarkersReady(true);
        console.log('✅ Markers enabled, facilities count:', facilities.length);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMarkersReady(false);
    }
  }, [isMapsApiLoaded, map, facilities.length]);

  // Load Louisiana boundary coordinates from GeoJSON (MultiPolygon)
  React.useEffect(() => {
    // Only load if API is loaded and map is ready
    if (!isMapsApiLoaded || !map) {
      console.log('Waiting for API or map to load...', { isMapsApiLoaded, map: !!map });
      return;
    }

    console.log('Loading GeoJSON data...');
    fetch('/data/louisiana.json')
      .then(response => response.json())
      .then(data => {
        console.log('GeoJSON loaded:', data);
        if (!data?.geometry?.coordinates) {
          console.error('No geometry coordinates found');
          return;
        }

        // coordinates: number[][][][] (MultiPolygon -> Polygons -> Rings -> [lng,lat])
        const multiPolygons: number[][][][] = data.geometry.coordinates;
        console.log('MultiPolygons count:', multiPolygons.length);

        // Use only exterior rings (index 0) for each polygon
        const polygons: google.maps.LatLngLiteral[][] = multiPolygons.map((polygon) => {
          const exteriorRing = polygon[0] || [];
          return exteriorRing.map(([lng, lat]) => ({ lat, lng }));
        }).filter((ring) => ring.length > 0);

        console.log('Processed polygons:', polygons.length);
        console.log('Polygon 0 points:', polygons[0]?.length);
        console.log('Polygon 1 points:', polygons[1]?.length);
        
        setLouisianaPolygons(polygons);
        console.log('State updated with polygons');

        // Auto-fit bounds to all polygons with a small delay to ensure map is ready
        setTimeout(() => {
          if (map && polygons.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            polygons.forEach((ring) => {
              ring.forEach((coord) => bounds.extend(coord));
            });
            map.fitBounds(bounds);
            console.log('Map bounds fitted');
            
            // Adjust zoom after fitBounds completes
            setTimeout(() => {
              const currentZoom = map.getZoom();
              if (currentZoom && currentZoom > 7) {
                map.setZoom(6.5);
              }
              console.log('Zoom adjusted to:', map.getZoom());
            }, 200);
          }
        }, 100);
      })
      .catch(error => console.error('Error loading Louisiana GeoJSON:', error));
  }, [map, isMapsApiLoaded]);

  // Show helpful message if API key is not configured
  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          border: '2px dashed #d1d5db'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#174B7A',
            marginBottom: '12px'
          }}>
            Google Maps API Key Required
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            To display the interactive facility map, please add your Google Maps API key.
          </p>
          <div style={{ 
            fontSize: '13px', 
            color: '#374151',
            textAlign: 'left',
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '6px',
            marginBottom: '12px'
          }}>
            <strong>Quick Setup:</strong>
            <ol style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Get API key from Google Cloud Console</li>
              <li>Enable Maps JavaScript API</li>
              <li>Add to <code>.env</code> file or <code>src/config/maps.ts</code></li>
            </ol>
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            See <strong>GOOGLE_MAPS_SETUP.md</strong> for detailed instructions
          </p>
        </div>
      </div>
    );
  }

  if (!isMapsApiLoaded) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px',
          backgroundColor: '#eef2f7'
        }}
      />
    );
  }

  return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={7}
        onLoad={(map) => {
          console.log('Google Map loaded, setting map state');
          setMap(map);
        }}
        onUnmount={() => {
          console.log('Google Map unmounting, clearing map state');
          setMap(null);
        }}
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
        {/* Louisiana Border - render each exterior ring as its own Polygon (behind markers) */}
        {isMapsApiLoaded && louisianaPolygons.length > 0 && (() => {
          console.log('Rendering polygons:', louisianaPolygons.length, 'API loaded:', isMapsApiLoaded);
          console.log('Rendering facilities:', facilities.length);
          return null;
        })()}
        {isMapsApiLoaded && louisianaPolygons.length > 0 && (
          louisianaPolygons.map((ring, idx) => {
            console.log(`Rendering Polygon ${idx} with ${ring.length} points`);
            return (
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
                onLoad={() => {
                  console.log(`Polygon ${idx} loaded on map`);
                }}
              />
            );
          })
        )}

        {/* Factory Markers - render ABOVE polygon */}
        {markersReady && (() => {
          const validFacilities = facilities.filter(f => 
            f.lat && f.lng && 
            !isNaN(f.lat) && !isNaN(f.lng) &&
            f.lat >= 28.0 && f.lat <= 33.0 && // Louisiana bounds roughly
            f.lng >= -94.0 && f.lng <= -88.0
          );
          
          if (validFacilities.length !== facilities.length) {
            console.warn(`⚠️ Filtered out ${facilities.length - validFacilities.length} facilities with invalid coordinates`);
          }
          
          console.log(`🏭 Rendering ${validFacilities.length} markers`);
          
          return validFacilities.map((facility, idx) => (
            <Marker
              key={`facility-${facility.id}`}
              position={{ lat: facility.lat, lng: facility.lng }}
              onClick={() => {
                console.log('Facility clicked:', facility.name);
                setSelectedFacility(facility);
              }}
              title={facility.name}
              icon={{
                url: '/image/factory.png',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 32),
              }}
              zIndex={10000}
              options={{
                optimized: true, // Better performance for many markers
              }}
              onLoad={() => {
                if (idx === 0) {
                  console.log(`✓ First marker loaded: ${facility.name}`);
                } else if (idx === validFacilities.length - 1) {
                  console.log(`✓ Last marker loaded: ${facility.name}`);
                  console.log(`✅ All ${validFacilities.length} markers loaded successfully`);
                }
              }}
            />
          ));
        })()}

        {selectedFacility && (
          <InfoWindow
            position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
            onCloseClick={() => setSelectedFacility(null)}
          >
            <div style={{ padding: '12px', minWidth: '240px', maxWidth: '280px' }}>
              <h3 style={{ 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#174B7A',
                fontSize: '16px',
                borderBottom: '2px solid #1AAE9F',
                paddingBottom: '6px'
              }}>
                {selectedFacility.name}
              </h3>
              
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: selectedFacility.status === 'active' ? '#1AAE9F' : '#E9A23B',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {selectedFacility.type}
                </span>
              </div>

              <div style={{ marginBottom: '6px' }}>
                <p style={{ 
                  margin: '0 0 4px 0',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  Emissions ({selectedFacility.year}):
                </p>
                <p style={{ 
                  margin: 0,
                  color: selectedFacility.status === 'active' ? '#10B981' : '#D64545',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {selectedFacility.emissions.toLocaleString()} {selectedFacility.unit}
                </p>
              </div>

              <p style={{ 
                margin: '8px 0 0 0',
                color: '#9CA3AF',
                fontSize: '11px',
                borderTop: '1px solid #E5E7EB',
                paddingTop: '6px'
              }}>
                📍 {selectedFacility.lat.toFixed(4)}°N, {Math.abs(selectedFacility.lng).toFixed(4)}°W
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
  );
};

