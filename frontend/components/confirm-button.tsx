"use clinet"
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRideStore } from "@/features/store/ride/use-ride-store";

interface ConfirmButtonProps {
  isSidebarOpen: boolean;
  handleConfirmRide: () => void;
  handleClose: () => void;
  isCalculatingRoute: boolean;
  isCreatingData: boolean;
}

function ConfirmButton({
  isSidebarOpen,
  handleConfirmRide,
  isCalculatingRoute,
  isCreatingData,
  handleClose,
}: ConfirmButtonProps) {
  const {ride} = useRideStore();
  const getButtonText = () => {
    if (isCalculatingRoute) return "Calculating Route...";
    if (isCreatingData) return "Creating Ride...";
    return "Create Ride";
  };
  return (
    <div className={cn("p-4 space-y-3 border-t ", !isSidebarOpen && "hidden md:hidden")}>
      <Button
        className="w-full h-12 cursor-pointer"
        onClick={handleConfirmRide}
        disabled={isCalculatingRoute || isCreatingData}
      >
        {isCalculatingRoute || isCreatingData ? (
          <>
            <Loader2 className="h-5 w-5  mr-2 animate-spin" />
            {getButtonText()}
          </>
        ) : (
          getButtonText()
        )}
      </Button>
{
  ride && (
    <Button className="w-full h-12 bg-white text-black border hover:bg-gray-100 cursor-pointer" onClick={handleClose}>Cancel Ride</Button>
  )
}    </div>
  );
}

export default ConfirmButton;
