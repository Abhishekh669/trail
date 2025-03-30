// stores/mapStore.ts
import { create } from 'zustand';

interface MapState {
  center: [number, number];
  zoom: number;
  markerPosition: [number, number] | null;
  destinationPosition: [number, number] | null;
  transportMode: 'driving' | 'cycling' | 'walking';
  routeInfo: {
    distance: number;
    duration: number;
    geometry ?: number[][];
  } | null;
  routes: {
    distance: number;
    duration: number;
    geometry ?: number[][];
  }[] | null;
  selectedRoute: number;
  clickMode: 'start' | 'destination' | null;
  mapStyle: 'default' | 'dark' | 'satellite';

  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setMarkerPosition: (position: [number, number] | null) => void;
  setDestinationPosition: (position: [number, number] | null) => void;
  setTransportMode: (mode: 'driving' | 'cycling' | 'walking') => void;
  setRouteInfo: (info: {
    distance: number;
    duration: number;
    geometry ?: number[][];
  } | null) => void;
  setRoutes: (routes: {
    distance: number;
    duration: number;
    geometry ?: number[][];
  }[]) => void;
  setSelectedRoute: (index: number) => void;
  setClickMode: (mode: 'start' | 'destination' | null) => void;
  setMapStyle: (style: 'default' | 'dark' | 'satellite') => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [27.7172, 85.3240],
  zoom: 13,
  markerPosition: null,
  destinationPosition: null,
  transportMode: 'driving',
  routeInfo: null,
  routes: [],
  selectedRoute: 0,
  clickMode: null,
  mapStyle: 'default',

  // Action implementations
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setMarkerPosition: (markerPosition) => set({ markerPosition }),
  setDestinationPosition: (destinationPosition) => set({ destinationPosition }),
  setTransportMode: (transportMode) => set({ transportMode }),
  setRouteInfo: (routeInfo) => set({ routeInfo }),
  setRoutes: (routes) => set({ routes }),
  setSelectedRoute: (selectedRoute) => set({ selectedRoute }),
  setClickMode: (clickMode) => set({ clickMode }),
  setMapStyle: (mapStyle) => set({ mapStyle }),
}));