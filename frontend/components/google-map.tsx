
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";

interface RouteInfo {
  distance: number;
  duration: number;
  geometry: number[][];
}

interface GoogleMapProps {
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  destinationPosition?: [number, number];
  onMarkerDrag?: (position: [number, number]) => void;
  onDestinationDrag?: (position: [number, number]) => void;
  onRouteSelect?: (route: RouteInfo) => void;
  onLocationFound?: (position: [number, number]) => void;
  onMapClick?: (position: [number, number], isDestination: boolean) => void;
  onLocationUpdate?: (position: [number, number]) => void;
  transportMode?: 'driving' | 'cycling' | 'walking';
  routeGeometry?: any; // GeoJSON route geometry
}

const mapStyles = {
  default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};


const defaultCenter: [number, number] = [27.7172, 85.3240];
const defaultZoom = 13;
const defaultMarkerPosition: [number, number] = [27.7172, 85.3240];
const defaultDestinationPosition: [number, number] = [0, 0];

const GoogleMap = ({
  center = defaultCenter,
  zoom = defaultZoom,
  markerPosition = defaultMarkerPosition,
  destinationPosition = defaultDestinationPosition,
  onMarkerDrag,
  onDestinationDrag,
  onRouteSelect,
  onLocationFound,
  onMapClick,
  onLocationUpdate,
  transportMode = 'driving',
  routeGeometry,
}: GoogleMapProps) => {
    const mapRef = useRef<L.Map | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [LRM, setLRM] = useState<any>(null);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(center);
  const [mapStyle, setMapStyle] = useState<keyof typeof mapStyles>('default');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [clickMode, setClickMode] = useState<'start' | 'destination' | null>(null);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);

  const icon = useMemo(() => {
    if (!L) return null;
    
    const createDivIcon = (color: string) => {
      const iconElement = document.createElement('div');
      iconElement.innerHTML = `
        <div style="position: relative; width: 24px; height: 24px;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="${color}" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      `;
      return L.divIcon({
        html: iconElement,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
        className: 'custom-icon'
      });
    };

    return {
      default: createDivIcon('#3b82f6'),
      destination: createDivIcon('#ef4444')
    };
  }, [L]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([
      import("leaflet"),
      import("leaflet-routing-machine")
    ]).then(([leaflet, routingMachine]) => {
      setL(leaflet);
      setLRM(routingMachine.default);
    });
  }, []);

  useEffect(() => {
    if (!L || !containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(currentCenter, zoom);
    mapRef.current = map;

    L.tileLayer(mapStyles[mapStyle]).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.attribution({ position: 'bottomright' }).addTo(map);

    const styleControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const select = L.DomUtil.create('select', 'bg-black text-blue-500 rounded-md px-2 py-1', container);

        Object.keys(mapStyles).forEach(style => {
          const option = L.DomUtil.create('option', '', select);
          option.value = style;
          option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
        });

        select.addEventListener('change', (e) => {
          const target = e.target as HTMLSelectElement;
          setMapStyle(target.value as keyof typeof mapStyles);
        });

        return container;
      }
    });
    map.addControl(new styleControl());

    setIsMapInitialized(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [L, currentCenter, zoom, mapStyle]);

  useEffect(() => {
    if (!mapRef.current || !isMapInitialized || !L || !icon) return;
    const map = mapRef.current;

    if (markerPosition) {
      if (markerRef.current) {
        markerRef.current.setLatLng(markerPosition);
      } else {
        markerRef.current = L.marker(markerPosition, {
          icon: icon.default,
          draggable: !!onMarkerDrag,
        }).addTo(map);

        if (onMarkerDrag) {
          markerRef.current.on("dragend", async (e) => {
            const position = e.target.getLatLng();
            const newPosition: [number, number] = [position.lat, position.lng];
            onMarkerDrag(newPosition);
            onLocationUpdate?.(newPosition);
          });
        }
      }
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (destinationPosition && destinationPosition[0] !== 0 && destinationPosition[1] !== 0) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng(destinationPosition);
      } else {
        destinationMarkerRef.current = L.marker(destinationPosition, {
          icon: icon.destination,
          draggable: !!onDestinationDrag,
    }).addTo(map);

        if (onDestinationDrag) {
          destinationMarkerRef.current.on("dragend", async (e) => {
            const position = e.target.getLatLng();
            const newPosition: [number, number] = [position.lat, position.lng];
            onDestinationDrag(newPosition);
          });
        }
      }
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
  }, [L, markerPosition, destinationPosition, isMapInitialized, icon, onMarkerDrag, onDestinationDrag]);

  useEffect(() => {
    if (!mapRef.current || !isMapInitialized || !onMapClick) return;

    const map = mapRef.current;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (clickMode) {
        const position: [number, number] = [e.latlng.lat, e.latlng.lng];
        onMapClick(position, clickMode === 'destination');
        setClickMode(null);
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [clickMode, onMapClick, isMapInitialized]);

  useEffect(() => {
    if (!mapRef.current || !L || !LRM) return;

    const shouldCalculateRoute = markerPosition && destinationPosition && 
        destinationPosition[0] !== 0 && destinationPosition[1] !== 0;

    if (!shouldCalculateRoute) {
      if (routeRef.current) {
        routeRef.current.remove();
        routeRef.current = null;
      }
      setRoutes([]);
      setSelectedRoute(0);
      return;
    }

    const map = mapRef.current;

    // Clear previous route
    if (routeRef.current) {
      routeRef.current.remove();
      routeRef.current = null;
    }

    const mode = transportMode === 'driving' ? 'car' : 
                 transportMode === 'cycling' ? 'bike' : 'foot';

    const calculateRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/${mode}/${markerPosition[1]},${markerPosition[0]};${destinationPosition[1]},${destinationPosition[0]}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await response.json();

        if (data.routes) {
          const routeInfos = data.routes.map((route: any) => ({
            distance: route.distance / 1000,
            duration: route.duration / 60,
            geometry: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]])
          }));

          setRoutes(routeInfos);
          setSelectedRoute(0);

          if (routeInfos[0]) {
            const routeColor = transportMode === 'driving' ? "#3b82f6" : 
                             transportMode === 'cycling' ? "#22c55e" : "#f97316";
            
            routeRef.current = L.polyline(routeInfos[0].geometry, {
              color: routeColor,
              weight: 4,
              opacity: 0.8,
            }).addTo(map);

            map.fitBounds(routeRef.current.getBounds());
            onRouteSelect?.(routeInfos[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    calculateRoute();
  }, [transportMode, markerPosition, destinationPosition, L, LRM, onRouteSelect]);

  useEffect(() => {
    if (!mapRef.current || !isMapInitialized || !routes[selectedRoute] || !routeRef.current || !L) return;

    const latLngs = routes[selectedRoute].geometry.map(coord => L.latLng(coord[0], coord[1]));
    routeRef.current.setLatLngs(latLngs);
    mapRef.current.fitBounds(routeRef.current.getBounds());
    onRouteSelect?.(routes[selectedRoute]);
  }, [selectedRoute, routes, onRouteSelect, isMapInitialized]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
        <Button
          onClick={() => setClickMode('start')}
          className={`p-2 rounded ${clickMode === 'start' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          variant={clickMode === 'start' ? 'default' : 'outline'}
        >
          Set Start Location
        </Button>
        <Button
          onClick={() => setClickMode('destination')}
          className={`p-2 rounded ${clickMode === 'destination' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          variant={clickMode === 'destination' ? 'default' : 'outline'}
        >
          Set Destination
        </Button>
      </div>
      {routes.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2">
          <div className="flex space-x-2">
            {routes.map((route, index) => (
              <Button
                key={index}
                onClick={() => setSelectedRoute(index)}
                className={`px-3 py-1 rounded ${
                  selectedRoute === index ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                variant={selectedRoute === index ? 'default' : 'outline'}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(GoogleMap), { ssr: false });