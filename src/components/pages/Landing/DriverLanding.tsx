/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import useCookie from "@/app/hooks/useCookie";
import { SocketContext } from "@/providers/socketProvider";
import BookingModal from "@/components/common/BookingModal";
import useBooking from "@/app/hooks/useBooking";

type propsType={
  bookingDatac:any,
  setBookingDatac:any
}

const  DriverLanding= ({setBookingDatac,bookingDatac}:propsType) => {
  const { getCookie } = useCookie();  
  const { socket,locationSocket } = useContext(SocketContext);
  const userId = getCookie("driverId");

  // const [bookingDatac, setBookingDatac] = useState<any>(null);
  const [notificationData, setNotificationData] = useState<any>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("accepted");
  const {updateBookingStatus}=useBooking();

  useEffect(() => {
    if (socket && userId) {
      socket.emit("registerDriver", userId);
      console.log("Driver registered:", userId);

      const playNotificationSound = () => {
        const audio = new Audio("/audio/ring.mp3");
        audio.play();
      };
      if(locationSocket){
        locationSocket.emit("connection")
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const roundedLatitude = Math.round(latitude * 100) / 100;
            const roundedLongitude = Math.round(longitude * 100) / 100;
            locationSocket.emit("locationUpdate", { driverId: userId, location: { lat: roundedLatitude, lng: roundedLongitude } });
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

      socket.on("newBooking", (data) => {
        playNotificationSound();
        setBookingDatac(data.booking);
        setNotificationData(data.notification);
        setIsNotificationOpen(true);
      });

      socket.on("bookingCancelled", ({ booking }) => {
        console.log(`Booking ${booking} has been cancelled.`);
        if (bookingDatac && bookingDatac._id === booking._id) {
          setBookingDatac(null);
          setIsNotificationOpen(false);
          setCurrentStatus("cancelled")
          setIsAccepted(false);
          setBookingDatac(null);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("newBooking");
        socket.off("bookingCancelled");
      }
    };
  }, [socket, userId, bookingDatac]);

  const handleAccept = () => {
    if (socket && bookingDatac) {
      socket.emit("acceptBooking", { bookingId: bookingDatac._id, driverId: userId });
      setIsAccepted(true);
      setBookingDatac(bookingDatac);
      console.log("object",bookingDatac);
      setIsNotificationOpen(false);
    }
  };

  const handleReject = () => {
    if (socket && bookingDatac) {
      socket.emit("rejectBooking", { bookingId: bookingDatac._id, driverId: userId });
      setBookingDatac(null);
      setIsNotificationOpen(false);
      setIsAccepted(false);
    }
  };

  const handleClose = () => {
    setBookingDatac(null);
    setIsNotificationOpen(false);
    setIsAccepted(false);
  };
  const statusSteps = ["accepted", "collected", "completed", "cancelled"];
  return (
    <div className="relative">
    {/* Notification Modal */}
    {isNotificationOpen && (
      <BookingModal
        notification={notificationData}
        onAccept={handleAccept}
        onReject={handleReject}
        onClose={handleClose}
      />
    )}
    {(!isNotificationOpen && !isAccepted) && <div className="fixed top-16 right-0 h-[90vh] bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-1/3">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2">No New Bookings</h2>
        <p className="text-sm mb-4">Please wait for new bookings</p>
      </div>
      </div>
      }
    {isAccepted && (
        <div className="fixed top-16 right-0 h-[90vh] bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-[1000] w-1/3">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">Booking Status</h2>
            <p className="text-sm mb-4">{notificationData?.srcName + " -> " + notificationData?.destnName}</p>
            <div className="w-full">
              {statusSteps.map((status, index) => (
                <div key={status} className="flex items-center mb-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      currentStatus === status ? "bg-green-500 border-green-600" : "border-gray-300"
                    }`}
                  >
                    {currentStatus === status && (
                      <span className="text-white">&#10003;</span> // Tick mark
                    )}
                  </div>
                  <div className={`flex-1 h-1 ${index < statusSteps.length - 1 ? "bg-gray-300" : ""}`} />
                  <div className="ml-2 text-sm font-semibold">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
                </div>
              ))}
            </div>
            <div className="w-full space-y-2 mt-4">
              {currentStatus === "accepted" && (
                <div
                  className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    if(bookingDatac){
                      updateBookingStatus(bookingDatac._id, "collected");
                      setCurrentStatus("collected");
                    }
                     }}
                >
                  <span className="font-semibold">Collected Item</span>
                </div>
              )}
              {currentStatus === "collected" && (
                <div
                  className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    if(bookingDatac){
                      updateBookingStatus(bookingDatac._id, "completed");
                      setCurrentStatus("completed");
                      setIsAccepted(false);
                      setBookingDatac(null);
                    }
                     }}
                >
                  <span className="font-semibold">Dropped Item</span>
                </div>
              )}
              {currentStatus==="accepted" && <div
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  if(bookingDatac){
                    updateBookingStatus(bookingDatac._id, "cancelled");
                    setCurrentStatus("cancelled");
                    setIsAccepted(false);
                    setBookingDatac(null);
                  }
                   }}
              >
                <span className="font-semibold">Cancel Booking</span>
              </div>}
            </div>
          </div>
        </div>
    )}
  </div>
  );
};

export default DriverLanding;
