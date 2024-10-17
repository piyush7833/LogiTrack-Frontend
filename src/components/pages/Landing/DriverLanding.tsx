/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import useCookie from "@/app/hooks/useCookie";
import { SocketContext } from "@/providers/socketProvider";
import BookingModal from "@/components/common/BookingModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useDriver from "@/app/hooks/useDriver";
import showToast from "@/components/common/showToast";
// import { useSelector } from "react-redux";

type propsType = {
  bookingDatac: any;
  setBookingDatac: any;
  isDriver: boolean;
};

const DriverLanding = ({
  setBookingDatac,
  bookingDatac,
  isDriver,
}: propsType) => {
  const { getCookie } = useCookie();
  const { socket, locationSocket } = useContext(SocketContext);
  const router = useRouter();
  const userId = getCookie("driverId");
  const [notificationData, setNotificationData] = useState<any>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const {getParticularDriver}=useDriver();

  useEffect(() => {
    const fetchData=async()=>{
      if(!userId){
      const res=await getParticularDriver(userId);
      console.log(res)
      if(res?.data.data.driver.isAvailable===false){
        showToast("success", "You already have bookings");
        router.push(`/bookings`);
      }
    }
    }
    fetchData();
  }, []);
  if (locationSocket) {
    locationSocket.emit("connection");
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const roundedLatitude = Math.round(latitude * 100) / 100;
        const roundedLongitude = Math.round(longitude * 100) / 100;
        locationSocket.emit("locationUpdate", {
          driverId: userId,
          location: { lat: roundedLatitude, lng: roundedLongitude },
        });
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
  useEffect(() => {
    if (socket && userId) {
      socket.emit("registerDriver", userId);
      const playNotificationSound = () => {
        const audio = new Audio("/audio/ring.mp3");
        audio.play();
      };


      socket.on("newBooking", (data) => {
        playNotificationSound();
        setBookingDatac(data.booking);
        setNotificationData(data.notification);
        setIsNotificationOpen(true);
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
      socket.emit("acceptBooking", {
        bookingId: bookingDatac._id,
        driverId: userId,
      });
      console.log(userId);
      setIsAccepted(true);
      setBookingDatac(bookingDatac);
      setIsNotificationOpen(false);
      router.push(`/bookings/${bookingDatac._id}`);
      console.log("object2")
    }
  };

  const handleReject = () => {
    if (socket && bookingDatac) {
      socket.emit("rejectBooking", {
        bookingId: bookingDatac._id,
        driverId: userId,
      });
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

  if (!isDriver) {
    return null;
  }
  return (
    <>
      {isNotificationOpen && (
        <BookingModal
          notification={notificationData}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={handleClose}
        />
      )}
      {!isNotificationOpen && !isAccepted && (
        <div className="bg-white p-4 z-50 w-1/3 h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">No New Bookings</h2>
            <p className="text-sm mb-4">
              Please wait for new bookings here or see
              <Link href={`bookings`}>
                {" "}
                <span className="text-blue-500">older bookings</span>{" "}
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverLanding;
