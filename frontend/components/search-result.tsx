import React from "react";
import { Place } from "./user/user-sidebar";
import { MapPin } from "lucide-react";
interface SearchResultPageProps {
  place: Place;
  handlePlaceSelect: (place: Place, isSearchingDestination: boolean) => void;
  isSearchingDestination : boolean
}

function SearchResultPage({ place, handlePlaceSelect, isSearchingDestination }: SearchResultPageProps) {
  return (
    <div
     
      className="flex items-center p-3 hover:bg-gray-100  hover:text-blue-600 rounded-lg cursor-pointer"
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
  );
}

export default SearchResultPage;
