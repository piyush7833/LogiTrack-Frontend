"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapEvents, useMap, Polyline } from "react-leaflet";
import useLocation from "@/app/hooks/useLocation";

// Dynamically import the MapContainer, TileLayer, and Marker for client-side rendering
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Custom icon for Leaflet Marker
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

type PropsType = {
  src: any;
  destn: any;
};

const Map = ({ src, destn }: PropsType) => {
  const { getRoute } = useLocation();
  const [position, setPosition] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [markerLocation, setMarkerLocation] = useState<any | null>(null);

  const [route, setRoute] = useState<any[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const userPos = L.latLng(latitude, longitude);
          setUserLocation(userPos);
          setMarkerLocation(userPos);
          fetchPlaceName(latitude, longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (src && src.lat && src.lon && destn && destn.lat && destn.lon) {
      
    } else if (src) {
      setMarkerLocation(src);
    } else if (destn) {
      setMarkerLocation(destn);
    } else if (userLocation) {
      setMarkerLocation(userLocation);
    } else {
      setMarkerLocation(L.latLng(28.7175691552515, 77.23654986073308));
    }
  }, [src, destn, userLocation]);

  const fetchPlaceName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      setPlaceName(data.display_name);
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  };

  const SetViewOnLocation = ({ location }: { location: L.LatLng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(location, 13);
    }, [location, map]);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        fetchPlaceName(e.latlng.lat, e.latlng.lng);
        setMarkerLocation(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={customMarkerIcon}></Marker>
    );
  };

  const RouteCalculator = () => {
    const map = useMap();

    useEffect(() => {
      const calculateRoute = async () => {
        try {
          const response = await getRoute(src, destn);
          console.log(response, "response from getRoute");
          if (!response || !response.data) {
            console.error("Invalid response from getRoute:", response);
            return;
          }
          setRoute(response.data.route);
          setDistance(response.data.distance);
          setTime(response.data.time);
          const routeLine = L.polyline(response.data.route, {
            color: "blue",
            weight: 5,
          }).addTo(map);
          map.fitBounds(routeLine.getBounds());
        } catch (error) {
          console.error("Error calculating route:", error);
        }
      };

      if (src && src.lat && src.lon && destn && destn.lat && destn.lon) {
        calculateRoute();
      }
    }, [src, destn, map]);

    return null;
  };

  return (
    <div>
      <MapContainer
        center={markerLocation || [51.505, -0.09]}
        zoom={markerLocation ? 13 : 10}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markerLocation && <SetViewOnLocation location={markerLocation} />}
        {markerLocation && (
          <Marker position={markerLocation} icon={customMarkerIcon} />
        )}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        <LocationMarker />
        {src && src.lat && src.lon && destn && destn.lat && destn.lon && <RouteCalculator />}
      </MapContainer>
      {position && (
        <div>
          <p>Latitude: {position.lat}</p>
          <p>Longitude: {position.lng}</p>
          {placeName && <p>Place: {placeName}</p>}
        </div>
      )}
    </div>
  );
};

export default Map;
