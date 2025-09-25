import { useEffect, useRef, useState } from 'react';

interface Location {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'safe' | 'alert';
  lat: number;
  lng: number;
  location: string;
  lastUpdate: string;
  icon: string;
}

interface GoogleMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleMap({
  locations,
  center = { lat: 10.841, lng: 106.810 }, // Vinhomes Grand Park coordinates
  zoom = 15,
  height = '400px'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setMapError('Google Maps API key not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) {
        setMapError('Google Maps API not loaded');
        return;
      }

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ weight: '2.00' }]
          },
          {
            featureType: 'all',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#9c9c9c' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [{ color: '#f2f2f2' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'all',
            stylers: [{ saturation: -100 }, { lightness: 45 }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{ color: '#eeeeee' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#7b7b7b' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#c8d7d4' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#070707' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ffffff' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER
        }
      });

      setMap(mapInstance);
      setMapError(null);
    } catch (error) {
      console.error('Google Maps initialization error:', error);
      setMapError('Failed to initialize Google Maps');
    }
    };

    // Load Google Maps script first
    loadGoogleMapsScript();

    if (window.google) {
      initMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, [center, zoom]);

  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = locations.map(location => {
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'active': return '#10B981'; // green
          case 'safe': return '#3B82F6'; // blue
          case 'alert': return '#F59E0B'; // yellow
          default: return '#6B7280'; // gray
        }
      };

      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getMarkerColor(location.status),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 20px; margin-right: 8px;">${location.avatar}</span>
              <div>
                <div style="font-weight: 600; font-size: 14px;">${location.name}</div>
                <div style="font-size: 12px; color: #6B7280; text-transform: capitalize;">${location.role}</div>
              </div>
            </div>
            <div style="margin-bottom: 4px;">
              <div style="display: flex; align-items: center; font-size: 12px; color: #4B5563;">
                <span style="margin-right: 4px;">📍</span>
                <span>${location.location}</span>
              </div>
            </div>
            <div style="margin-bottom: 4px;">
              <div style="display: flex; align-items: center; font-size: 12px; color: #4B5563;">
                <span style="margin-right: 4px;">🕒</span>
                <span>${location.lastUpdate}</span>
              </div>
            </div>
            <div>
              <div style="display: flex; align-items: center; font-size: 12px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${getMarkerColor(location.status)}; margin-right: 4px;"></div>
                <span style="color: #4B5563; text-transform: capitalize;">${location.status}</span>
              </div>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers if there are multiple locations
    if (locations.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [markers]);

  // Show fallback UI if Google Maps fails to load
  if (mapError) {
    return (
      <div
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Google Maps không khả dụng</h3>
          <p className="text-sm text-gray-600 mb-4">
            Không thể tải Google Maps. Vui lòng kiểm tra API key.
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Xem hướng dẫn tại:</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">docs/maps.md</code>
          </div>

          {/* Show location list as fallback */}
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Vị trí thành viên:</h4>
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg p-3 border border-gray-200 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{location.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs text-gray-600">{location.location}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        location.status === 'active' ? 'bg-green-500' :
                        location.status === 'safe' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-xs text-gray-500 capitalize">{location.status}</span>
                      <span className="text-xs text-gray-400">• {location.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-200"
    />
  );
}
