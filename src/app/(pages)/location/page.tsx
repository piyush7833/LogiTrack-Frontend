"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

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

const LeafletMap: React.FC = () => {
  const [locationA, setLocationA] = useState<LatLng | null>(null);
  const [locationB, setLocationB] = useState<LatLng | null>(null);
  const [currentPositionB, setCurrentPositionB] = useState<LatLng | null>(null);
  const [suggestionsA, setSuggestionsA] = useState<Suggestion[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<Suggestion[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const customMarkerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const mapRef = useRef<L.Map | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mapRef.current && locationA && locationB) {
      const map = mapRef.current;

      // Create a routing control
      const routingControl = L.Routing.control({
        waypoints: [L.latLng(locationA.lat, locationA.lng), L.latLng(locationB.lat, locationB.lng)],
        routeWhileDragging: true,
        createMarker: () => null, // Disable default markers
      }).addTo(map);

      routingControl.on("routesfound", (e: L.Routing.RoutingResultEvent) => {
        // Fit the map to show the whole route
        const bounds = L.latLngBounds(e.routes[0].coordinates);
        map.fitBounds(bounds);

        // Extract the coordinates for the route
        const coords = e.routes[0].coordinates.map((coord) => ({
          lat: coord.lat,
          lng: coord.lng,
        }));
        setRouteCoordinates(coords);
        setCurrentPositionB(coords[0]); // Set initial position to start of the route
      });

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [locationA, locationB]);

  useEffect(() => {
    // Animate Marker B along the route
    if (routeCoordinates.length > 0) {
      let index = 0;

      animationRef.current = setInterval(() => {
        if (index < routeCoordinates.length) {
          setCurrentPositionB(routeCoordinates[index]);

          // Zoom to the location of Marker B
          mapRef.current?.setView([routeCoordinates[index].lat, routeCoordinates[index].lng], 15);
          index++;
        } else {
          clearInterval(animationRef.current!);
        }
      }, 1000); // Update every 1 second
    }

    return () => {
      // Clear the interval if the component unmounts or route changes
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [routeCoordinates]);

  const handleSearch = async (query: string, isLocationA: boolean = true) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
    const data = await response.json();

    if (isLocationA) {
      setSuggestionsA(data);
    } else {
      setSuggestionsB(data);
    }
  };

  const handleSelectLocation = (location: Suggestion, isLocationA: boolean = true) => {
    const latLng = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };
    if (isLocationA) {
      setLocationA(latLng);
      setSuggestionsA([]);
    } else {
      setLocationB(latLng);
      setSuggestionsB([]);
    }
    mapRef.current?.setView([latLng.lat, latLng.lng], 13);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/3 w-full p-4 bg-gray-100 relative z-20">
        {["A", "B"].map((loc, index) => (
          <div className="mb-4" key={loc}>
            <input
              type="text"
              placeholder={`Search Location ${loc}`}
              className="p-2 border rounded w-full"
              onChange={(e) => handleSearch(e.target.value, index === 0)}
            />
            {(index === 0 ? suggestionsA : suggestionsB).length > 0 && (
              <ul
                className="absolute z-30 bg-white border rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg"
                style={{ pointerEvents: "auto" }}
              >
                {(index === 0 ? suggestionsA : suggestionsB).map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectLocation(suggestion, index === 0)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="md:w-2/3 w-full h-full relative">
        <MapContainer
          center={[28.7175691552515, 77.23654986073308]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={(mapInstance) => {
            mapRef.current = mapInstance ? mapInstance : null;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locationA && !currentPositionB && <Marker position={[locationA.lat, locationA.lng]} icon={customMarkerIcon} />}
          {locationB && <Marker position={[locationB.lat, locationB.lng]} icon={customMarkerIcon} />}
          {currentPositionB && (
            <Marker position={[currentPositionB.lat, currentPositionB.lng]} icon={customMarkerIcon} />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="blue" />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletMap;
