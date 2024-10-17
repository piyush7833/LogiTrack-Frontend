"use client";
import useBooking from "@/app/hooks/useBooking";
import { useRouter } from "next/navigation";
import React from "react";

type propsType = {
  isBookingOpen: boolean;
  setIsBookingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentStatus: string;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookingDatac: any;
};

const HeroStepper = ({
  currentStatus,
  setCurrentStatus,
  bookingDatac,
  isBookingOpen,

}: propsType) => {
  const statusSteps = ["pending","accepted", "collected", "completed", "cancelled"];
  const { updateBookingStatus,handlePayment } = useBooking();
  const Payment = async () => {
    try {
      await handlePayment(bookingDatac.price, bookingDatac._id);
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();
  return (
    <div className="w-1/3 h-full">
      {isBookingOpen && (
        <div className="h-full w-full bg-white  p-6  flex flex-col justify-center">
          <div className="">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Booking Status</h2>
            <p className="text-sm mb-6 text-gray-500">{bookingDatac?.srcName} &rarr; {bookingDatac?.destnName}</p>
            <div className="w-full">
              {statusSteps.map((status, index) => (
                <div key={status} className="flex items-center mb-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStatus === status
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-500"
                    }`}
                  >
                    {currentStatus === status && (
                      <span className="font-bold text-white">&#10003;</span> // Tick mark
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStatus === statusSteps[index + 1] || statusSteps.indexOf(currentStatus) > index
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                  <div
                    className={`ml-2 text-sm font-semibold transition-colors duration-300 ${
                      currentStatus === status ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-50 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Booking Details</h3>
              <p className="text-sm text-gray-700"><strong>End Time:</strong> {bookingDatac?.startTime ? new Date(bookingDatac.startTime).toLocaleString() : "N/A"}</p>
                <p className="text-sm text-gray-700"><strong>End Time:</strong> {bookingDatac?.endTime ? new Date(bookingDatac.endTime).toLocaleString() : "N/A"}</p>
              <p className="text-sm text-gray-700"><strong>Estimated Duration:</strong> {bookingDatac?.duration || "N/A"}</p>
              {/* {!isDriver&&<p className="text-sm text-gray-700"><strong>Driver Name:</strong> {bookingDatac?.driverId?.name || "N/A"}</p>} */}
              <p className="text-sm text-gray-700"><strong>Vehicle Model:</strong> {bookingDatac?.vehicleId?.model || "N/A"}</p>
              <p className="text-sm text-gray-700"><strong>Vehicle Type:</strong> {bookingDatac?.vehicleId?.type || "N/A"}</p>
              <p className="text-sm text-gray-700"><strong>Total Distance:</strong> {bookingDatac?.distance || "N/A"}</p>
            </div>
              <div className="w-full flex gap-2 mt-4 justify-end">
            {(currentStatus === "accepted" || currentStatus==="pending") && (
                <button
                  className="w-auto py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-semibold transition-all duration-300 bg-white hover:bg-blue-50"
                  onClick={() => {
                    if (bookingDatac?._id !== null) {
                      updateBookingStatus(bookingDatac?._id, "cancelled");
                      setCurrentStatus("cancelled");
                    }
                  }}
                >
                  Cancel Booking
                </button>
            )}
              {<button
                className="w-auto py-2 px-4 border border-transparent text-white rounded-lg font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  router.push("/");
                }}
              >
                Book Another
              </button>}
              {(!bookingDatac && bookingDatac?.paymentId) && <button
                className="w-auto py-2 px-4 border border-transparent text-white rounded-lg font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  Payment()
                }}
              >
                {`Pay ${bookingDatac?.price}`}
              </button>}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroStepper;
