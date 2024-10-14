"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import  usePrice  from "@/app/hooks/usePrice";
import { vehicles } from "../../../../config/constantMaps";
import useLocation from "@/app/hooks/useLocation";
import { formatTime } from "@/utils/utils";
import useBooking from "@/app/hooks/useBooking";

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

interface vehicleData {
  type: string;
  desc: string;
  img: string;
  price: number | null;
  time: string | null;
}

const Hero: React.FC = () => {
  const [locationA, setLocationA] = useState<LatLng | null>(null);
  const [locationB, setLocationB] = useState<LatLng | null>(null);
  const [currentPositionB, setCurrentPositionB] = useState<LatLng | null>(null);
  const [suggestionsA, setSuggestionsA] = useState<Suggestion[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<Suggestion[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [vehicleData, setVehicleData] = useState<vehicleData[]>(vehicles);
  const [inputValueA, setInputValueA] = useState<string>("");
  const [inputValueB, setInputValueB] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);
  const [traffic, setTraffic] = useState<string>("");

  const {getPrices}=usePrice()
  const {getRouteDetails,isRaining}=useLocation()
  const {createBooking}=useBooking()
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

  useEffect(() => {
    if(locationA && locationB){
      
      getRouteDetails(locationA, locationB).then((data) => {
        console.log(data,"data")
        if (data) {
          setDistance(data.distance);
          setTraffic(data.traffic);
            setVehicleData((prevVehicleData) =>
            prevVehicleData.map((vehicle) => ({
              ...vehicle,
              time: formatTime(data.time),
            }))
            );
        }
      });
      
    }
  },[locationA, locationB]);


  const handleSearch = async (query: string, isLocationA: boolean = true) => {
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

  const handleSelectLocation = (location: Suggestion, isLocationA: boolean = true) => {
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

  const handleBlur = (isLocationA: boolean) => {
    if (isLocationA) {
      setSuggestionsA([]);
    } else {
      setSuggestionsB([]);
    }
  };

  const handleGetPrice = () => {
    if (locationA && locationB) {
      isRaining(locationA.lat, locationA.lng).then((res) => {
        getPrices(distance, traffic,res as boolean).then((res) => {
          setVehicleData((prevVehicleData) =>
            prevVehicleData.map((vehicle) => ({
          ...vehicle,
          price: res?.data?.data?.price[vehicle.type] || vehicle.price,
            }))
          );
        });
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8vh)]">
      <div className="md:w-1/3 w-full p-4 bg-gray-100 relative z-20 flex flex-col justify-between">
      <div>
      {["A", "B"].map((loc, index) => (
            <div className="mb-4" key={loc}>
              <input
                type="text"
                placeholder={`Search Location ${loc}`}
                className="p-2 border rounded w-full"
                value={index === 0 ? inputValueA : inputValueB}
                onChange={(e) => handleSearch(e.target.value, index === 0)}
                onBlur={() => handleBlur(index === 0)}
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
                      onMouseDown={() => handleSelectLocation(suggestion, index === 0)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
      <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
     {vehicleData.map((item, index) => (
        <Card key={index} title={item.type} desc={item.desc} price={item.price} time={item.time}  width="100%" onClick={()=>(createBooking(
          {
            vehicleType: item.type,
            distance: distance,
            price: item.price,
            srcName: inputValueA,
            destnName: inputValueB,
            src: { lat: locationA?.lat, lng: locationA?.lng },
            destn: { lat: locationB?.lat, lng: locationB?.lng },
          }
        ))}/>
      ))}
     </div>
      <Button text="Get Price" onClick={()=>{handleGetPrice()}} disabled={locationA==null && locationB==null} />
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

export default Hero;
