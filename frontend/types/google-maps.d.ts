declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps.places {
  class AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (result: AutocompletePrediction[], status: PlacesServiceStatus) => void
    ): void;
  }

  class PlacesService {
    constructor(attrContainer: HTMLElement);
    getDetails(
      request: PlaceDetailsRequest,
      callback: (result: PlaceResult, status: PlacesServiceStatus) => void
    ): void;
  }

  interface AutocompletionRequest {
    input: string;
    types?: string[];
  }

  interface AutocompletePrediction {
    description: string;
    place_id: string;
  }

  interface PlaceDetailsRequest {
    placeId: string;
    fields: string[];
  }

  interface PlaceResult {
    formatted_address?: string;
    geometry?: {
      location: {
        lat(): number;
        lng(): number;
      };
    };
    name?: string;
  }

  enum PlacesServiceStatus {
    OK = 'OK',
    ERROR = 'ERROR',
    INVALID_REQUEST = 'INVALID_REQUEST',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    ZERO_RESULTS = 'ZERO_RESULTS'
  }
} 