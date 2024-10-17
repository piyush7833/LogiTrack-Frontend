/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import Button from "@/components/common/Button";
import usePrice from "@/app/hooks/usePrice";
import { vehicles } from "../../../../config/constantMaps";
import useLocation from "@/app/hooks/useLocation";
import { formatTime } from "@/utils/utils";
import { SocketContext } from "@/providers/socketProvider";
import Search from "./Search";
import Vehicles from "./Vehicles";
import DriverCard from "./DriverCard";
import AnimatedModal from "@/components/common/AnimatedModal";
import { useRouter } from "next/navigation";
import DriverLanding from "./DriverLanding";
import useCookie from "@/app/hooks/useCookie";

interface LatLng {
  lat: number;
  lng: number;
}

interface vehicleData {
  type: string;
  desc: string;
  img: string;
  price: number | null;
  time: string | null;
}
interface propsType {
  isDriver: boolean;
  bookingDatac:any,
  setBookingDatac:any
}
const Hero = ({ isDriver,bookingDatac,setBookingDatac }: propsType) => {
  const [locationA, setLocationA] = useState<LatLng | null>(null);
  const [locationB, setLocationB] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [vehicleData, setVehicleData] = useState<vehicleData[]>(vehicles);
  const [inputValueA, setInputValueA] = useState<string>("");
  const [inputValueB, setInputValueB] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);
  const [traffic, setTraffic] = useState<string>("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [alertModalOpen,setAlertModalOpen]=useState(false)
  const [modalmessage,setModalMessage]=useState("")

  
  const { getPrices } = usePrice();
  const { getRouteDetails, isRaining } = useLocation();
  const {getCookie}=useCookie()
  const router=useRouter()
  const { socket } = useContext(SocketContext);
  const currentDriverId=getCookie("driverId")
  const customMarkerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && locationA && locationB) {
      const map = mapRef.current;
      const waypoints =  [
            L.latLng(locationA.lat, locationA.lng),
            L.latLng(locationB.lat, locationB.lng),
          ];

      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          try {
            if (map != null) {
              map.removeLayer(layer);
            }
          } catch (error) {
            console.error("Error removing layer:", error);
          }
        }
      });

      const routingControl = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        createMarker: () => null,
      }).addTo(map);

      routingControl.on("routesfound", (e: L.Routing.RoutingResultEvent) => {
        if (e.routes[0].coordinates) {
          const bounds = L.latLngBounds(e.routes[0].coordinates);
          map.fitBounds(bounds);

          const coords = e.routes[0].coordinates.map((coord) => ({
            lat: coord.lat,
            lng: coord.lng,
          }));
          setRouteCoordinates(coords);
        }
      });

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [locationA, locationB]);




  useEffect(() => {
    if (locationA && locationB) {
      getRouteDetails(locationA, locationB).then((data) => {
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
  }, [locationA, locationB]);




  const handleGetPrice = () => {
    if (locationA && locationB) {
      isRaining(locationA.lat, locationA.lng).then((res) => {
        getPrices(distance, traffic,res as boolean,locationA).then((res) => {
          setVehicleData((prevVehicleData) =>
            prevVehicleData.map((vehicle) => ({
              ...vehicle,
              price: res?.data?.data?.price[vehicle.type] || vehicle.price,
            }))
          );
        });
      });
    }
  };

  // Listen for booking acceptance
  if (socket) {
    socket.on("bookingAccepted", ({ booking, driverName }) => {
      console.log(booking,"booking")
      console.log(bookingDatac,"bookingDatac")
      if (bookingDatac && booking._id === bookingDatac._id) {
        if(!isDriver){
          setAlertModalOpen(true)
          setModalMessage( `${driverName} has accepted your booking`)
          router.push(`/bookings/${bookingDatac._id}`)
        }
        if(isDriver && bookingDatac.driverId===currentDriverId){
          console.log(booking, currentDriverId)
          router.push(`/bookings/${bookingDatac._id}`)
        }
        console.log("object1")
      }
    });
    socket.on("bookingNotAccepted", ({ booking }) => {
      if (bookingDatac && booking._id === bookingDatac._id) {
        if(!isDriver){
          setAlertModalOpen(true)
          setModalMessage("No driver accepted your booking")
        }
        setBookingDatac(null);
        setIsBookingOpen(false);
        setDrivers([]);
      }
    });
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8vh)]">
      <AnimatedModal
        message={modalmessage}
        isVisible={alertModalOpen}
        onClose={()=>setAlertModalOpen(false)}
      />
      {isDriver && <DriverLanding
          bookingDatac={bookingDatac}
          setBookingDatac={setBookingDatac}
          isDriver={isDriver}
        />}
      {!isDriver && !isBookingOpen && (
        <div className="md:w-1/3 w-full p-4 bg-gray-100 relative z-20 flex flex-col justify-between">
          <Search
            inputValueA={inputValueA}
            inputValueB={inputValueB}
            setInputValueA={setInputValueA}
            setInputValueB={setInputValueB}
            setLocationA={setLocationA}
            setLocationB={setLocationB}
            mapRef={mapRef}
          />
          {drivers.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center">Nearby Drivers</h2>
              <h2 className="text-base font-semibold text-gray-800 text-center">Someone will pick your booking request soon</h2>
              {drivers.length>0 && drivers.map((driver:any, index) => (
                <DriverCard
                  key={index}
                  driverName={driver.user.name}
                  distance={`${driver.distance} km`}
                />
              ))}
            </div>
          )}
          {drivers.length===0 &&  !isDriver && <Vehicles
            locationA={locationA}
            locationB={locationB}
            distance={distance}
            bookingDatac={bookingDatac}
            inputValueA={inputValueA}
            inputValueB={inputValueB}
            vehicleData={vehicleData}
            setBookingData={setBookingDatac}
            setDrivers={setDrivers}
            isDriver={isDriver}
          />}

          {(
            <Button
              text="Get Price"
              onClick={() => {
                handleGetPrice();
              }}
              disabled={locationA == null || locationB == null || distance == 0}
            />
          )}
        </div>
      )}
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
          {locationA && (
            <Marker
              position={[locationA.lat, locationA.lng]}
              icon={customMarkerIcon}
            />
          )}
          {locationB && (
            <Marker
              position={[locationB.lat, locationB.lng]}
              icon={customMarkerIcon}
            />
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
