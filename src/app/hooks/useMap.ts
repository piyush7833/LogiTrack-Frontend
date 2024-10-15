/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";

interface LatLng {
    lat: number;
    lng: number;
  }
  
  interface Suggestion {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
  }

const useMap = () => {
 const handleSearch = async (
  query: string,
  isLocationA: boolean,
  setInputValueA: (value: string) => void,
  setInputValueB: (value: string) => void,
  setSuggestionsA: (suggestions: Suggestion[]) => void,
  setSuggestionsB: (suggestions: Suggestion[]) => void
) => {
  if (isLocationA) {
    setInputValueA(query);
  } else {
    setInputValueB(query);
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
  );
  const data = await response.json();

  if (isLocationA) {
    setSuggestionsA(data);
  } else {
    setSuggestionsB(data);
  }
};

 const handleSelectLocation = (
  location: Suggestion,
  isLocationA: boolean,
  setLocationA: (location: LatLng) => void,
  setLocationB: (location: LatLng) => void,
  setInputValueA: (value: string) => void,
  setInputValueB: (value: string) => void,
  setSuggestionsA: (suggestions: Suggestion[]) => void,
  setSuggestionsB: (suggestions: Suggestion[]) => void,
  mapRef: React.MutableRefObject<L.Map | null>
) => {
  const latLng = {
    lat: parseFloat(location.lat),
    lng: parseFloat(location.lon),
  };
  if (isLocationA) {
    setLocationA(latLng);
    setInputValueA(location.display_name);
    setSuggestionsA([]);
  } else {
    setLocationB(latLng);
    setInputValueB(location.display_name);
    setSuggestionsB([]);
  }
  mapRef.current?.setView([latLng.lat, latLng.lng], 13);
};

 const handleBlur = (
  isLocationA: boolean,
  setSuggestionsA: (suggestions: Suggestion[]) => void,
  setSuggestionsB: (suggestions: Suggestion[]) => void
) => {
  if (isLocationA) {
    setSuggestionsA([]);
  } else {
    setSuggestionsB([]);
  }
};

  return {
    handleSearch,
    handleSelectLocation,
    handleBlur,

  };
};

export default useMap;
