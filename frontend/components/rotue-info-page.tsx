import { Bike, Car, Loader2, PersonStanding } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { RouteInfo, TransportMode } from './user/user-sidebar'
interface RouterPageInfoProps{
    transportMode : TransportMode,
    isCalculatingRoute : boolean,
    routeInfo : RouteInfo,
    handleTransportModeChange : (mode : TransportMode) => void;

    
}

function RoutePageInfo({
    transportMode,
    isCalculatingRoute,
    routeInfo,
    handleTransportModeChange
} : RouterPageInfoProps) {
  return (
    <div className="mt-6 space-y-4">
                <h3 className="text-white font-semibold ">Route Information</h3>

                {/* Transport mode selector */}
                <div className="flex gap-2">
                  {(["driving", "cycling", "walking"] as TransportMode[]).map(
                    (mode) => (
                      <Button
                        key={mode}
                        variant={transportMode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTransportModeChange(mode)}
                        disabled={isCalculatingRoute}
                        className={
                          transportMode === mode
                            ? mode === "driving"
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : mode === "cycling"
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-amber-600 hover:bg-amber-700 text-white"
                            : "hover:bg-gray-100"
                        }
                      >
                        {isCalculatingRoute && transportMode === mode ? (
                          <Loader2 className="h-4 w-4  animate-spin" />
                        ) : (
                          <>
                            {mode === "driving" ? (
                              <Car className="h-4 w-4 " />
                            ) : mode === "cycling" ? (
                              <Bike className="h-4 w-4 " />
                            ) : (
                              <PersonStanding className="h-4 w-4 " />
                            )}
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </>
                        )}
                      </Button>
                    )
                  )}
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
                        : `${Math.floor(routeInfo.duration / 60)}h ${Math.round(
                            routeInfo.duration % 60
                          )} min`}
                    </span>
                  </div>
                </div>
              </div>
  )
}

export default RoutePageInfo
