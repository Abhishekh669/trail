"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { MapPin, Navigation, X, Menu, Car, Bike, PersonStanding, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import TestGoogleMap from "@/components/test-google-map"
import toast from "react-hot-toast"
import { useMapStore } from "@/store/mapStore"

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface Place {
  display_name: string;
  lat: string;
  lon: string;
  distance?: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
}

const NOMINATIM_API = "https://nominatim.openstreetmap.org";
const OSRM_API = "https://router.project-osrm.org";

type TransportMode = 'driving' | 'cycling' | 'walking';

const calculateTravelTime = (
  transportMode: TransportMode,
  distanceKm: number
): number => {
  const AVG_SPEEDS = {
    driving: 40,
    cycling: 15,
    walking: 5
  };
  
  if (distanceKm <= 0) return 0;
  return Math.round((distanceKm / AVG_SPEEDS[transportMode]) * 60);
};

export default function RideApp() {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLocation, setCurrentLocation] = useState("Your location");
  const [destination, setDestination] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>();
  const [isSearchingDestination, setIsSearchingDestination] = useState(false);
  const [destinationPosition, setDestinationPosition] = useState<[number, number]>();
  const [transportMode, setTransportMode] = useState<TransportMode>('driving');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const handleUseCurrentUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          setCurrentLocation("Locating...");
          try {
            const response = await fetch(
              `${NOMINATIM_API}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  'Accept-Language': 'en-US,en;q=0.9',
                  'User-Agent': 'RideApp/1.0',
                },
              }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setCurrentLocation(data.display_name || "Your current location");
          } catch (error) {
            console.error("Error getting address:", error);
            setCurrentLocation("Your current location");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          let errorMessage = "Location access denied";
          switch(error.code) {
            case error.PERMISSION_DENIED: errorMessage = "Location permission denied"; break;
            case error.POSITION_UNAVAILABLE: errorMessage = "Location information unavailable"; break;
            case error.TIMEOUT: errorMessage = "Location request timed out"; break;
          }
          setCurrentLocation(errorMessage);
          setIsLoading(false);
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleUseCurrentUserLocation();
  }, [handleUseCurrentUserLocation]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      let currentLocationQuery = "";
      if (markerPosition) {
        currentLocationQuery = `&lat=${markerPosition[0]}&lon=${markerPosition[1]}&bounded=1&limit=15`;
      }

      const response = await fetch(
        `${NOMINATIM_API}/search?format=json&q=${encodeURIComponent(query)}${currentLocationQuery}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'RideApp/1.0',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
      
      const sortedResults = data.sort((a: Place, b: Place) => {
        const aName = a.display_name.toLowerCase();
        const bName = b.display_name.toLowerCase();
        const aMatchCount = queryWords.filter(word => aName.includes(word)).length;
        const bMatchCount = queryWords.filter(word => bName.includes(word)).length;
        
        if (aMatchCount !== bMatchCount) return bMatchCount - aMatchCount;
        if (markerPosition) {
          const aDist = parseFloat(a.distance || '0');
          const bDist = parseFloat(b.distance || '0');
          return aDist - bDist;
        }
        return aName.localeCompare(bName);
      });

      setSearchResults(sortedResults);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [markerPosition]);

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), [handleSearch]);

  const handlePlaceSelect = useCallback((place: Place, isDestination: boolean = false) => {
    if (isDestination) {
      setDestination(place.display_name);
      setDestinationPosition([parseFloat(place.lat), parseFloat(place.lon)]);
    } else {
      setCurrentLocation(place.display_name);
      setMarkerPosition([parseFloat(place.lat), parseFloat(place.lon)]);
    }
    setSearchResults([]);
    setIsSearchingDestination(false);
  }, []);

  const calculateRoute = useCallback( async (mode: TransportMode = transportMode) => {
    if (!markerPosition || !destinationPosition) return;
    
    setIsCalculatingRoute(true);
    try {
      const osrmMode = mode === 'driving' ? 'car' :
                      mode === 'cycling' ? 'bike' : 'foot';
      
      const response = await fetch(
        `${OSRM_API}/route/v1/${osrmMode}/` +
        `${markerPosition[1]},${markerPosition[0]};${destinationPosition[1]},${destinationPosition[0]}?overview=full&geometries=geojson`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.routes?.length > 0) {
        const route = data.routes[0];
        setRouteInfo({
          distance: route.distance / 1000,
          duration: route.duration / 60,
          
        });
      } else {
        setRouteInfo(null);
        toast.error("No route found");
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      toast.error("Failed to calculate route");
      setRouteInfo(null);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [markerPosition, destinationPosition]);


  useEffect(() => {
    if (markerPosition && destinationPosition) {
      calculateRoute();
    }
  }, [markerPosition, destinationPosition, calculateRoute]);

  const handleTransportModeChange = useCallback(async (mode: TransportMode) => {
    setTransportMode(mode);
    
    // Calculate new duration based on the selected mode and current distance
    if (routeInfo?.distance) {
      const newDuration = calculateTravelTime(mode, routeInfo.distance);
      setRouteInfo({
        distance: routeInfo.distance,
        duration: newDuration
      });
    }
  }, [routeInfo?.distance]);

  console.log("thisi shte route inofo : ",routeInfo)


  const handleConfirmRide = async () => {
    if (!markerPosition || !destinationPosition) {
      toast.error("Please select both start and destination locations");
      return;
    }
    await calculateRoute();
  };

  return (
    <main className="flex h-[100dvh] bg-gray-100 relative">
      {/* Sidebar */}
      <div className={cn(
        "h-full bg-background border-r transition-all duration-300 flex flex-col z-10",
        isSidebarOpen ? "w-80" : "w-0 md:w-16"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className={cn("font-bold text-xl", !isSidebarOpen && "hidden md:hidden")}>Ride App</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className={cn("p-4 flex-1 overflow-auto", !isSidebarOpen && "hidden md:hidden")}>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Where to?</h2>
            
            {/* Location inputs */}
            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center pt-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <div className="flex-1 space-y-3">
                {/* Current location input */}
                <div className="relative">
                  <Input
                    placeholder="Current location"
                    value={currentLocation}
                    onChange={(e) => {
                      setCurrentLocation(e.target.value);
                      setIsSearchingDestination(false);
                      debouncedSearch(e.target.value);
                    }}
                    className={cn(
                      "h-12 pl-3 pr-10",
                      currentLocation === "Your location" && "bg-blue-50 border-blue-200",
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={currentLocation === "Your location"
                      ? handleUseCurrentUserLocation
                      : () => setCurrentLocation("Your location")}
                  >
                    {currentLocation === "Your location"
                      ? <Navigation className="h-4 w-4 text-blue-500" />
                      : <X className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Destination input */}
                <div className="relative">
                  <Input
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setIsSearchingDestination(true);
                      debouncedSearch(e.target.value);
                    }}
                    className="h-12 pl-3 pr-10"
                  />
                  {destination && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setDestination("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
                {searchResults.map((place) => (
                  <div
                    key={`${place.lat}-${place.lon}`}
                    className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handlePlaceSelect(place, isSearchingDestination)}
                  >
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium">{place.display_name}</p>
                      {place.distance && (
                        <p className="text-sm text-gray-500">
                          {parseFloat(place.distance).toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Route info */}
            {routeInfo && (
              <div className="mt-6 space-y-4">
                <h3 className="text-white font-semibold text-blue-800">Route Information</h3>
                
                {/* Transport mode selector */}
                <div className="flex gap-2">
                  {(['driving', 'cycling', 'walking'] as TransportMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={transportMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTransportModeChange(mode)}
                      disabled={isCalculatingRoute}
                      className={
                        transportMode === mode
                          ? mode === 'driving' ? "bg-indigo-600 hover:bg-indigo-700 text-white" :
                            mode === 'cycling' ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
                            "bg-amber-600 hover:bg-amber-700 text-white"
                          : "hover:bg-gray-100"
                      }
                    >
                      {isCalculatingRoute && transportMode === mode ? (
                        <Loader2 className="h-4 w-4  animate-spin" />
                      ) : (
                        <>
                          {mode === 'driving' ? <Car className="h-4 w-4 " /> :
                           mode === 'cycling' ? <Bike className="h-4 w-4 " /> :
                           <PersonStanding className="h-4 w-4 " />}
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </>
                      )}
                    </Button>
                  ))}
                </div>

                {/* Route details */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium text-indigo-700">
                      {routeInfo.distance.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-indigo-700">
                      {routeInfo.duration < 60
                        ? `${Math.round(routeInfo.duration)} min`
                        : `${Math.floor(routeInfo.duration / 60)}h ${Math.round(routeInfo.duration % 60)} min`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent locations (empty state) */}
            {searchResults.length === 0 && !isLoading && !routeInfo && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Recent locations</h3>
                <div className="space-y-3">
                  <div className="text-center text-gray-500 py-4">
                    {destination ? "No results found" : "Search for destinations"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm button */}
        {currentLocation && destination && (
          <div className={cn("p-4 border-t", !isSidebarOpen && "hidden md:hidden")}>
            <Button
              className="w-full h-12"
              onClick={handleConfirmRide}
              disabled={isCalculatingRoute}
            >
              {isCalculatingRoute ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : null}
              {isCalculatingRoute ? "Calculating..." : "Confirm ride"}
            </Button>
          </div>
        )}
      </div>

      {/* Map View */}
      <div className="flex-1 relative">
        <TestGoogleMap
          center={markerPosition}
          markerPosition={markerPosition}
          destinationPosition={destinationPosition}
          onMarkerDrag={setMarkerPosition}
          transportMode={transportMode}
        />

        {/* Mobile toggle button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 md:hidden shadow-lg z-20"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </main>
  );
}