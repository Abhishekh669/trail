"use client";

import React, { useState, useEffect } from "react";
import { Car, Bike, Clock, MapPin, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRideStore } from "@/features/store/ride/use-ride-store";

interface VehicleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

// Duration calculator function (returns hours)
const calculateTravelTime = (
  vehicle: "car" | "bike",
  distanceKm: number
): number => {
  const AVG_SPEEDS = {
    car: 40,    // km/h (average car speed)
    bike: 15,   // km/h (average bike speed)
  };

  if (distanceKm <= 0) return 0;
  return parseFloat((distanceKm / AVG_SPEEDS[vehicle]).toFixed(1)); // in hours with 1 decimal
};

// Format hours to readable format (e.g., 1.5 → "1h 30m")
const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) return `${minutes}m`;
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
};

function VehicleSelection({ isOpen, onClose }: VehicleSelectionProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<"car" | "bike">("car");
  const { ride } = useRideStore();
  const [durationHours, setDurationHours] = useState<number>(0);

  useEffect(() => {
    if (ride) {
      const calculatedDuration = calculateTravelTime(selectedVehicle, ride.distance);
      setDurationHours(calculatedDuration);
    }
  }, [ride, selectedVehicle]);

  const handleConfirm = () => {
    console.log(`Selected vehicle: ${selectedVehicle}, Duration: ${durationHours} hours`);
    
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {ride ? (
          <>
            <DialogHeader>
              <DialogTitle>Confirm your ride</DialogTitle>
            </DialogHeader>

            {/* Ride Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-500">Fare</span>
                  <span className="font-semibold">₹{ride.fare}</span>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-500">Distance</span>
                  <span className="font-semibold">{ride.distance.toFixed(1)} km</span>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="font-semibold">{formatDuration(durationHours)}</span>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                    <div className="w-px h-6 bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{ride.pickup.location}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {ride.destination.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Select your vehicle</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedVehicle("car")}
                    className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      selectedVehicle === "car"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Car className="h-8 w-8" />
                    <span className="font-medium">Car</span>
                    <span className="text-xs text-gray-500">
                      ~{formatDuration(calculateTravelTime("car", ride.distance))}
                    </span>
                  </button>
                  <button
                    onClick={() => setSelectedVehicle("bike")}
                    className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                      selectedVehicle === "bike"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Bike className="h-8 w-8" />
                    <span className="font-medium">Bike</span>
                    <span className="text-xs text-gray-500">
                      ~{formatDuration(calculateTravelTime("bike", ride.distance))}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm Man</Button>
            </DialogFooter>
          </>
        ) : (
          <div className="p-4 text-center">No ride data found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default VehicleSelection;