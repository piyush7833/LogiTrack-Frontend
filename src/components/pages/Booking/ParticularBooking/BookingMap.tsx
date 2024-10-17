/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { SocketContext } from "@/providers/socketProvider";
import AnimatedModal from "@/components/common/AnimatedModal";
import HeroStepper from "../../Landing/HeroStepper";
import DriverStepper from "../../Landing/DriverStepper";
import useCookie from "@/app/hooks/useCookie";
import { useRouter } from "next/navigation";

interface LatLng {
  lat: number;
  lng: number;
}

interface propsType {
  isDriver: boolean;
  bookingDatac: any;
  setBookingDatac: any;
}
const BookingMap = ({ isDriver, bookingDatac, setBookingDatac }: propsType) => {
  const [locationA, setLocationA] = useState<LatLng | null>(null);
  const [locationB, setLocationB] = useState<LatLng | null>(null);
  const [currentPositionB, setCurrentPositionB] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [driverId, setDriverId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(true);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [modalmessage, setModalMessage] = useState("");
  const { getCookie } = useCookie();
  const currentDriverId = getCookie("driverId");
  const { socket, locationSocket } = useContext(SocketContext);
  const router = useRouter();
  // const {createBooking}=useBooking()
  const customMarkerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const truckIcon = new L.Icon({
    iconUrl: "/images/truck.png", // Replace with your truck SVG path
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (bookingDatac && currentPositionB == null) {
      setLocationA({
        lat: bookingDatac.src.coordinates[1],
        lng: bookingDatac.src.coordinates[0],
      });
      setLocationB({
        lat: bookingDatac.destn.coordinates[1],
        lng: bookingDatac.destn.coordinates[0],
      });
      if (bookingDatac.status == "accepted") {
        setLocationB({
          lat: bookingDatac.src.coordinates[1],
          lng: bookingDatac.src.coordinates[0],
        });
      }
      if (bookingDatac.status == "collected") {
        setLocationB({
          lat: bookingDatac.destn.coordinates[1],
          lng: bookingDatac.destn.coordinates[0],
        });
      }
      if (bookingDatac.status == "completed") {
        setLocationB({
          lat: bookingDatac.destn.coordinates[1],
          lng: bookingDatac.destn.coordinates[0],
        });
        setLocationA({
          lat: bookingDatac.src.coordinates[1],
          lng: bookingDatac.src.coordinates[0],
        });
        setCurrentPositionB(null);
      }
      if (
        bookingDatac.status !== "completed" &&
        bookingDatac.status !== "cancelled"
      ) {
        setDriverId(bookingDatac.driverId);
      }
      setCurrentStatus(bookingDatac.status);
    }
  }, [bookingDatac, currentStatus]);

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
      const waypoints = currentPositionB
        ? [
            L.latLng(locationB.lat, locationB.lng),
            L.latLng(currentPositionB.lat, currentPositionB.lng),
          ]
        : [
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
  }, [locationA, locationB, currentPositionB]);

  useEffect(() => {
    if (currentPositionB && mapRef.current) {
      const map = mapRef.current;
      map.flyTo([currentPositionB.lat, currentPositionB.lng], 13, {
        duration: 2,
      });
    }
  }, [currentPositionB]);

  // Follow currentPositionB as it moves
  useEffect(() => {
    if (currentPositionB && mapRef.current) {
      const map = mapRef.current;
      map.panTo([currentPositionB.lat, currentPositionB.lng], {
        animate: true,
        duration: 1,
      });
    }
  }, [currentPositionB]);

  useEffect(() => {
    if (currentPositionB) {
      // Zoom to the location of Marker B
      mapRef.current?.setView([currentPositionB.lat, currentPositionB.lng], 15);
    }
  }, [currentPositionB]);

  // Update driver location every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (locationSocket && driverId && bookingDatac) {
        if (bookingDatac && bookingDatac && bookingDatac._id) {
          locationSocket.emit("updateBookedDriverLocation", {
            driverId,
            bookingId: bookingDatac._id,
            locationB,
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [locationSocket, driverId, bookingDatac?._id]);

  // Listen for bookingCollected event
  useEffect(() => {
    if (socket) {
      socket.on("bookingCollected", ({ booking }) => {
        if (bookingDatac && booking._id === bookingDatac._id) {
          if (!isDriver) {
            setAlertModalOpen(true);
            setModalMessage("Item has been collected");
          }
          setCurrentStatus("collected");
          setLocationB({
            lat: bookingDatac.destn.coordinates[1],
            lng: bookingDatac.destn.coordinates[0],
          });
        }
      });

      // Clean up the socket listener
      return () => {
        socket.off("bookingCollected");
      };
    }
  }, [socket, bookingDatac]);

  if (locationSocket) {
    if (isDriver) {
      locationSocket.emit("connection");
      let lastLatitude: number | null = null;
      let lastLongitude: number | null = null;

      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const roundedLatitude = Math.round(latitude * 100) / 100;
          const roundedLongitude = Math.round(longitude * 100) / 100;

          if (
            roundedLatitude !== lastLatitude ||
            roundedLongitude !== lastLongitude
          ) {
            locationSocket.emit("locationUpdate", {
              driverId: currentDriverId,
              location: { lat: roundedLatitude, lng: roundedLongitude },
            });
            lastLatitude = roundedLatitude;
            lastLongitude = roundedLongitude;
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    }
  }

  // Listen for booking acceptance
  if (socket) {
    socket.on("bookingAccepted", ({ booking, driverName, driverId }) => {
      if (bookingDatac && booking._id === bookingDatac._id) {
        if (!isDriver) {
          setAlertModalOpen(true);
          setModalMessage(`${driverName} has accepted your booking`);
        }

        setBookingDatac(booking);
        setDriverId(driverId);
        setCurrentStatus("accepted");
        setIsBookingOpen(true);
        setLocationB({
          lat: bookingDatac.src.coordinates[1],
          lng: bookingDatac.src.coordinates[0],
        });
      }
    });
    socket.on("bookingNotAccepted", ({ booking }) => {
      if (bookingDatac && booking._id === bookingDatac._id) {
        if (!isDriver) {
          setAlertModalOpen(true);
          setModalMessage("No driver accepted your booking");
        }
        setCurrentStatus("rejected");
        router.push("/bookings");
      }
    });
    socket.on("bookingCancelled", ({ booking }) => {
      if (bookingDatac && booking._id === bookingDatac._id) {
        if (!isDriver) {
          setAlertModalOpen(true);
          setModalMessage("Booking has been cancelled");
        }
        console.log("Booking Cancelled");
        setDriverId("");
        setCurrentStatus("cancelled");
        setBookingDatac(booking);
      }
    });
    socket.on("bookingCompleted", ({ booking }) => {
      if (bookingDatac && booking._id === bookingDatac._id) {
        if (!isDriver) {
          setAlertModalOpen(true);
          setModalMessage("Item has been delivered");
        }
        setBookingDatac(booking);
        setDriverId("");
        setCurrentStatus("completed");
      }
    });
  }

  // Listen for driver location updates for user
  if (locationSocket) {
    locationSocket.on("driverLocationUpdate", ({ location, bookingIds }) => {
      if (bookingIds == bookingDatac?._id) {
        // console.log(location,"location")
        setCurrentPositionB(location);
      }
    });
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8vh)]">
      <AnimatedModal
        message={modalmessage}
        isVisible={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />

      {!isDriver && (
        <HeroStepper
          bookingDatac={bookingDatac}
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          isBookingOpen={isBookingOpen}
          setIsBookingOpen={setIsBookingOpen}
        />
      )}
      {isDriver && (
        <DriverStepper
          bookingDatac={bookingDatac}
          setBookingDatac={setBookingDatac}
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          isBookingOpen={isBookingOpen}
        />
      )}
      <div className="md:w-2/3 w-full h-full">
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
              icon={truckIcon}
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

export default BookingMap;
