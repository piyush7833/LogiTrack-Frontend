"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import usePrice from "@/app/hooks/usePrice";
import {
  BACKEND_API_ENDPOINTS_MAP,
  vehicles,
} from "../../../../config/constantMaps";
import useLocation from "@/app/hooks/useLocation";
import { formatTime } from "@/utils/utils";
import { SocketContext } from "@/providers/socketProvider";
import { useHttpClient } from "@/app/hooks/useHttpClient";
import axios from "axios";
import showToast from "@/components/common/showToast";
// import useBooking from "@/app/hooks/useBooking";

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
interface propsType{
isDriver:boolean
}
const Hero = ({isDriver}:propsType) => {
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
  const [bookingId, setBookingId] = useState("");
  const [bookingPrice,setBookingPrice]=useState<number | null>(null)
  const [isPayemntButton, setIsPayementButton] = useState(false);
  const [driverId,setDriverId]=useState("")
  const { sendAuthorizedRequest } = useHttpClient();
  const { getPrices } = usePrice();
  const { getRouteDetails, isRaining } = useLocation();
  const { socket,locationSocket } = useContext(SocketContext);
  const [tempLocation, setTempLocation] = useState<LatLng | null>(null);
  // const {createBooking}=useBooking()
  const customMarkerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && locationA && locationB) {
      const map = mapRef.current;
      console.log(currentPositionB,"currentPositionB")
      console.log(locationB,"locationB")
      console.log(locationA,"locationA")
      // Create a new routing control with updated waypoints
      const waypoints = currentPositionB
        ? [
            L.latLng(locationB.lat, locationB.lng),
            L.latLng(currentPositionB.lat, currentPositionB.lng),
          ]
        : [
            L.latLng(locationA.lat, locationA.lng),
            L.latLng(locationB.lat, locationB.lng),
          ];
      
      // Remove any existing routing control
      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
            try {
            map.removeLayer(layer);
            } catch (error) {
            console.error("Error removing layer:", error);
            }
        }
      });
  
      // Create a new routing control
      const routingControl = L.Routing.control({
        waypoints,
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
      });
  
      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [locationA, locationB, currentPositionB]);
  
  


  useEffect(() => {
    if (currentPositionB) {
      // Zoom to the location of Marker B
      mapRef.current?.setView([currentPositionB.lat, currentPositionB.lng], 15);
    }
  }, [currentPositionB]);

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


  useEffect(() => {
    const interval = setInterval(() => {
      if (locationSocket && driverId && bookingId) {
      locationSocket.emit("updateBookedDriverLocation", { driverId, bookingId });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [locationSocket, driverId, bookingId]);

  // Listen for bookingCollected event
useEffect(() => {
  if (socket) {
    socket.on("bookingCollected", ({ booking }) => {
      if (booking._id === bookingId) {
        alert(`Item has been picked up.`);
          setLocationB({ lat:booking.destn.coordinates[1], lng:booking.destn.coordinates[0] });
          console.log(booking.destn.coordinates[0],booking.destn.coordinates[1],"booking")
      }
    });

    // Clean up the socket listener
    return () => {
      socket.off("bookingCollected");
    };
  }
}, [socket, bookingId]);

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

  const handleSelectLocation = (
    location: Suggestion,
    isLocationA: boolean = true
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
        getPrices(distance, traffic, res as boolean).then((res) => {
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

  const createBooking = async ({
    src,
    destn,
    price,
    vehicleType,
    distance,
    srcName,
    destnName,
    duration,
  }: any) => {
    try {
      const response = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.BOOKING,
        "POST",
        {
          src,
          destn,
          distance,
          srcName,
          destnName,
          price,
          vehicleType,
          duration
        },
        true,
        true
      );
      setBookingId(response.data.booking._id);
      console.log(response.data.price,"price")
      setBookingPrice(response.data.booking.price)
      console.log(price,"price")
      
    } catch (error) {
      console.log(error)
    }
  };
  const handlePayment = async () => {
    const {
      data: { key },
    } = await axios.get("/getkey");
    const { data } = await sendAuthorizedRequest(
      BACKEND_API_ENDPOINTS_MAP.PAYMENT + "/checkout/",
      "POST",
      {
        amount: bookingPrice,
      },
      true,
      true
    );
    const options = {
      key: key,
      amount: data.order.amount,
      currency: "INR",
      name: "Atlan-Assignment",
      description: "Order Transaction",
      image: {},
      order_id: data.order.id,
      handler: async function (response:any) {
        try {
            await sendAuthorizedRequest(
            BACKEND_API_ENDPOINTS_MAP.PAYMENT + "/verification/",
            "POST",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: bookingPrice,
              bookingId
            },
            true,
            true
          );
          showToast("success", "Payment Successful");
          setBookingId("")
          setBookingPrice(null)
        } catch (error) {
          console.log(error,"error");
          showToast("error", "Some error occurred");
        }
      },
      theme: {
        color: "#202020",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  // Listen for booking acceptance
  if (socket) {
    socket.on("bookingAccepted", ({ booking,driverName,driverId }) => {
      if (booking._id === bookingId) {
        alert(`Driver ${driverName} accepted your booking!`);
        setDriverId(driverId)
        setLocationB(locationA)
      }
    });
    socket.on("bookingNotAccepted", ({ booking }) => {
      if (booking._id === bookingId) {
        setBookingId("");
        setBookingPrice(null)
        alert(`No driver accepted your booking.`);
      }
    });
    socket.on("bookingCancelled", ({ booking }) => {
      if (booking._id === bookingId) {
        setBookingId("");
        setBookingPrice(null)
        setDriverId("")
        alert(`Booking has been cancelled.`);
      }
    }
    );
    socket.on("bookingCompleted", ({ booking }) => {
      if (booking._id === bookingId) {
        setIsPayementButton(true);
        setDriverId("")
        alert(`Item has been delivered.`);
  
      }
    }
    );
  }

  if(locationSocket){
    locationSocket.on("driverLocationUpdate",({location,bookingIds})=>{
     if(bookingIds==bookingId){
      // console.log(location,"location")
      setCurrentPositionB(location)

     }
    })
  }



  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8vh)]">
      {!isDriver && <div className="md:w-1/3 w-full p-4 bg-gray-100 relative z-20 flex flex-col justify-between">
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
                  {(index === 0 ? suggestionsA : suggestionsB).map(
                    (suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onMouseDown={() =>
                          handleSelectLocation(suggestion, index === 0)
                        }
                      >
                        {suggestion.display_name}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
          {vehicleData.map((item, index) => (
            <Card
              key={index}
              title={item.type}
              desc={item.desc}
              price={item.price}
              time={item.time}
              width="100%"
              onClick={() =>
              {
                if(locationA && locationB && item.price && bookingId==""){

                  createBooking({
                    vehicleType: item.type,
                    distance: distance,
                    price: item.price,
                    srcName: inputValueA,
                    destnName: inputValueB,
                    src: { lat: locationA?.lat, lng: locationA?.lng },
                    destn: { lat: locationB?.lat, lng: locationB?.lng },
                    duration: item.time
                  })
                }

              }
              }
            />
          ))}
        </div>
        {!isPayemntButton && <Button
          text="Get Price"
          onClick={() => {
            handleGetPrice();
          }}
          disabled={locationA == null && locationB == null}
        />}
{        isPayemntButton && <Button
          text={`Pay ${bookingPrice}`}
          onClick={() => {
            handlePayment();
          }}
        />}
      </div>}
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
          {locationA && !currentPositionB && (
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
          {currentPositionB && (
            <Marker
              position={[currentPositionB.lat, currentPositionB.lng]}
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
