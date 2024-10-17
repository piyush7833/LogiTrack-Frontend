/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useBooking from "@/app/hooks/useBooking";
import React from "react";

type propsType = {
  currentStatus: string;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  bookingDatac: any;
  setBookingDatac: any;
  isBookingOpen: boolean;
};

const DriverStepper = ({
  currentStatus,
  setCurrentStatus,
  bookingDatac,
  setBookingDatac,
  isBookingOpen,
}: propsType) => {
  const statusSteps = ["pending", "accepted", "collected", "completed", "cancelled"];

  const {updateBookingStatus}=useBooking();

  return (
    <div className="w-1/3 h-auto">
      {isBookingOpen && 
      <div className="w-full right-0 h-full bg-white p-6 flex flex-col justify-center">
        <div className="">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Booking Status</h2>
          <p className="text-sm mb-6 text-gray-500">
            {bookingDatac?.srcName} &rarr; {bookingDatac?.destnName}
          </p>
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
                      currentStatus === statusSteps[index + 1] ||
                      statusSteps.indexOf(currentStatus) > index
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
          <div className="w-full bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Booking Details</h3>
            <p className="text-sm text-gray-700"><strong>Start Time:</strong> {bookingDatac?.startTime ? new Date(bookingDatac.startTime).toLocaleString() : "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>End Time:</strong> {bookingDatac?.endTime ? new Date(bookingDatac.endTime).toLocaleString() : "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>Estimated Duration:</strong> {bookingDatac?.duration || "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>User Name:</strong> {bookingDatac?.userId?.name || "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>Vehicle Model:</strong> {bookingDatac?.vehicleId?.model || "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>Vehicle Type:</strong> {bookingDatac?.vehicleId?.type || "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>Total Distance:</strong> {bookingDatac?.distance || "N/A"}</p>
            <p className="text-sm text-gray-700"><strong>Online Paid:</strong> {bookingDatac?.paymentId ? "Yes" : "No"}</p>
          </div>
          {/* Action Buttons */}
          <div className="w-full space-y-4 mt-6 space-x-3">
            {currentStatus === "accepted" && (
              <button
                className="w-auto py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-semibold transition-all duration-300 bg-white hover:bg-blue-50"
                onClick={() => {
                  if (bookingDatac) {
                    updateBookingStatus(bookingDatac._id, "collected");
                    setCurrentStatus("collected");
                  }
                }}
              >
                Collected Item
              </button>
            )}
            {currentStatus === "collected" && (
              <button
                className="w-auto py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-semibold transition-all duration-300 bg-white hover:bg-blue-50"
                onClick={() => {
                  if (bookingDatac) {
                    updateBookingStatus(bookingDatac._id, "completed");
                    setCurrentStatus("completed");
                    // setIsBookingOpen(false);
                    setBookingDatac(null);
                  }
                }}
              >
                Dropped Item
              </button>
            )}
            {currentStatus === "accepted" && (
              <button
                className="w-auto py-2 px-4 border border-red-600 text-red-600 rounded-lg font-semibold transition-all duration-300 bg-white hover:bg-red-50"
                onClick={() => {
                  if (bookingDatac) {
                    updateBookingStatus(bookingDatac._id, "cancelled");
                    setCurrentStatus("cancelled");
                    // setIsBookingOpen(false);
                    setBookingDatac(null);
                  }
                }}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default DriverStepper;
