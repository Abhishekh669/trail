"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Navigation, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import SearchResultPage from "../search-result";
import RoutePageInfo from "../rotue-info-page";
import ConfirmButton from "../confirm-button";
import SideBarHeader from "../sidebar-header";
import VehicleSelection from "../vehicle-selection";
import GoogleMap from "../google-map";
import { useGetUserFromToken } from "@/features/hooks/tanstack/query-hook/token/use-get-user-from-token";
import { createRide } from "@/features/actions/map/map";
import { useRideStore } from "@/features/store/ride/use-ride-store";
import { useDeleteRide } from "@/features/hooks/tanstack/mutate-hook/rides/use-delete-ride";
import { BACKEND_URL } from "@/lib/data";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export interface Place {
  display_name: string;
  lat: string;
  lon: string;
  distance?: string;
}

export interface RouteInfo {
  distance: number;
  duration: number;
}

const NOMINATIM_API = "https://nominatim.openstreetmap.org";
const OSRM_API = "https://router.project-osrm.org";

export type TransportMode = "driving" | "cycling" | "walking";

export const calculateTravelTime = (
  transportMode: TransportMode,
  distanceKm: number
): number => {
  const AVG_SPEEDS = {
    driving: 40,
    cycling: 15,
    walking: 5,
  };

  if (distanceKm <= 0) return 0;
  return Math.round((distanceKm / AVG_SPEEDS[transportMode]) * 60);
};

export default function RideApp() {
  const [creatingRide, setCreatingRide] = useState(false);
  const {ride, setRide, subscribeToRides} = useRideStore();
  const { data: user, isLoading: userLoading } = useGetUserFromToken("user");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLocation, setCurrentLocation] = useState("Your location");
  const [destination, setDestination] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>();
  const [isSearchingDestination, setIsSearchingDestination] = useState(false);
  const [destinationPosition, setDestinationPosition] =useState<[number, number]>();
  const [transportMode, setTransportMode] = useState<TransportMode>("driving");
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {mutate : deleteRide, isPending : deleting} = useDeleteRide();


  useEffect(()=>{
    if(!user?.user || userLoading)return;
    if(ride){
      console.log("i am doing my work")
      subscribeToRides();
    }
  },[subscribeToRides, user?.user, userLoading, ride])


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
                  "Accept-Language": "en-US,en;q=0.9",
                  "User-Agent": "RideApp/1.0",
                },
              }
            );
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
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
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
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

  const handleSearch = useCallback(
    async (query: string) => {
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
          `${NOMINATIM_API}/search?format=json&q=${encodeURIComponent(
            query
          )}${currentLocationQuery}`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
              "User-Agent": "RideApp/1.0",
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const queryWords = query
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 0);

        const sortedResults = data.sort((a: Place, b: Place) => {
          const aName = a.display_name.toLowerCase();
          const bName = b.display_name.toLowerCase();
          const aMatchCount = queryWords.filter((word) =>
            aName.includes(word)
          ).length;
          const bMatchCount = queryWords.filter((word) =>
            bName.includes(word)
          ).length;

          if (aMatchCount !== bMatchCount) return bMatchCount - aMatchCount;
          if (markerPosition) {
            const aDist = parseFloat(a.distance || "0");
            const bDist = parseFloat(b.distance || "0");
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
    },
    [markerPosition]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  const handlePlaceSelect = useCallback(
    (place: Place, isDestination: boolean = false) => {
      if (isDestination) {
        setDestination(place.display_name);
        setDestinationPosition([parseFloat(place.lat), parseFloat(place.lon)]);
      } else {
        setCurrentLocation(place.display_name);
        setMarkerPosition([parseFloat(place.lat), parseFloat(place.lon)]);
      }
      setSearchResults([]);
      setIsSearchingDestination(false);
    },
    []
  );

  const calculateRoute = useCallback(
    async (mode: TransportMode = transportMode) => {
      if (!markerPosition || !destinationPosition) return;

      setIsCalculatingRoute(true);
      try {
        const osrmMode =
          mode === "driving" ? "car" : mode === "cycling" ? "bike" : "foot";

        const response = await fetch(
          `${OSRM_API}/route/v1/${osrmMode}/` +
            `${markerPosition[1]},${markerPosition[0]};${destinationPosition[1]},${destinationPosition[0]}?overview=full&geometries=geojson`
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
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
    },
    [markerPosition, destinationPosition]
  );

  useEffect(() => {
    if (markerPosition && destinationPosition) {
      calculateRoute();
    }
  }, [markerPosition, destinationPosition, calculateRoute]);

  const handleTransportModeChange = useCallback(
    async (mode: TransportMode) => {
      setTransportMode(mode);

      if (routeInfo?.distance) {
        const newDuration = calculateTravelTime(mode, routeInfo.distance);
        setRouteInfo({
          distance: routeInfo.distance,
          duration: newDuration,
        });
      }
    },
    [routeInfo?.distance]
  );

  const handleConfirmRide = async () => {
    
    if (!markerPosition || !destinationPosition || userLoading) {
      toast.error("Please select both start and destination locations");
      return;
    }

    if (!user?.user) {
      toast.error("No user found");
      return;
    }

    if(!ride){
      setCreatingRide(true);
      try {
        const pickupData = {
          location: currentLocation,
          lat: markerPosition[0],
          lon: markerPosition[1],
        };
        const destinationData = {
          location: destination,
          lat: destinationPosition[0],
          lon: destinationPosition[1],
        };
  
        const data = {
          userId: user.user._id,
          pickup: pickupData,
          destination: destinationData,
          distance: routeInfo?.distance || 0,
          vehicleType: transportMode,
        };
  
        const response = await createRide(data);
        if(response.message && response.rideData){
          const data = JSON.parse(response.rideData)
          subscribeToRides();
          setRide(data)
        }else if(response.error){
          toast.error("failed to create ride")
          return;
        }
        
      } catch (error) {
        toast.error("failed to create a ride");
      } finally{
        setCreatingRide(false)
      }
    }
+    setIsOpen(true);
    setTransportMode("driving");
  };

  const handleDestinationUpdate = useCallback(
    async (position: [number, number]) => {
      setDestinationPosition(position);
      try {
        const response = await fetch(
          `${NOMINATIM_API}/reverse?format=json&lat=${position[0]}&lon=${position[1]}`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
              "User-Agent": "RideApp/1.0",
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDestination(data.display_name || "Selected destination");
      } catch (error) {
        console.error("Error getting address:", error);
        setDestination("Selected destination");
      }
    },
    []
  );

  const handleLocationUpdate = async (position: [number, number]) => {
    try {
      const response = await fetch(
        `${NOMINATIM_API}/reverse?format=json&lat=${position[0]}&lon=${position[1]}`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "RideApp/1.0",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCurrentLocation(data.display_name || "Selected location");
    } catch (error) {
      console.error("Error getting address:", error);
      setCurrentLocation("Selected location");
    }
  };
  const handleClose = () =>{
    if(!ride){
      toast.error("no data found")
      return;
    }

    if(ride._id){
      deleteRide(ride._id,{
        onSuccess : (res)=>{
          if(res.message && res.success){
            toast.success("Cancelled successfully")
            setRide(null)
          }else if(res.error){
            toast.error("failed to cancell the ride")
          }
        }, onError : (error) =>{
          toast.error(error.message || "something went wrong")
        }
      })
    }
    setIsOpen(false)
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (ride?._id) {
        deleteRide(ride._id,
          {
            onSuccess : (res) =>{
              if(res.message && res.success){
                setRide(null)
              }
            }
          }
        )
        
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (ride?._id) {
        deleteRide(ride._id, {
          onSuccess: (res) => {
            if (res.success) console.log("Ride cleanup complete");
          },
          onError: (error) => {
            console.error("Cleanup error:", error);
          }
        });
      }            
    };
  }, [ride?._id, deleteRide]);

  return (
    <main className="flex h-[100dvh] bg-gray-100 relative">
      <VehicleSelection isOpen={isOpen} onClose={handleClose} />
      <div
        className={cn(
          "h-full bg-background border-r transition-all duration-300 flex flex-col z-10",
          isSidebarOpen ? "w-80" : "w-0 md:w-16"
        )}
      >
        <SideBarHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div
          className={cn(
            "p-4 flex-1 overflow-auto",
            !isSidebarOpen && "hidden md:hidden"
          )}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Where to?</h2>
            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center pt-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <div className="flex-1 space-y-3">
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
                      currentLocation === "Your location" &&
                        "bg-blue-50 border-blue-200"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={
                      currentLocation === "Your location"
                        ? handleUseCurrentUserLocation
                        : () => setCurrentLocation("Your location")
                    }
                  >
                    {currentLocation === "Your location" ? (
                      <Navigation className="h-4 w-4 text-blue-500" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Search Results
                </h3>
                {searchResults.map((place) => (
                  <SearchResultPage
                    key={`${place.lat}-${place.lon}`}
                    place={place}
                    handlePlaceSelect={handlePlaceSelect}
                    isSearchingDestination={isSearchingDestination}
                  />
                ))}
              </div>
            )}
            {routeInfo && (
              <RoutePageInfo
                transportMode={transportMode}
                isCalculatingRoute={isCalculatingRoute}
                routeInfo={routeInfo}
                handleTransportModeChange={handleTransportModeChange}
              />
            )}
            {/* //TODO : recent locations */}
          </div>
        </div>
        {currentLocation && destination && (
          <>
            <ConfirmButton
            isCreatingData={creatingRide}
            isCalculatingRoute={isCalculatingRoute}
            isSidebarOpen={isSidebarOpen}
            handleConfirmRide={handleConfirmRide}
            handleClose={handleClose}
          />
          
          </>
          
        )}
      </div>
      <div className="flex-1 relative z-0">
        <GoogleMap
          center={markerPosition}
          markerPosition={markerPosition}
          destinationPosition={destinationPosition}
          onMarkerDrag={setMarkerPosition}
          onDestinationDrag={handleDestinationUpdate}
          transportMode={transportMode}
          onLocationUpdate={handleLocationUpdate}
        />
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
