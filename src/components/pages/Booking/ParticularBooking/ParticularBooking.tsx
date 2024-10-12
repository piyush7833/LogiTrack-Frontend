import React from 'react';
// import useBooking from '@/app/hooks/useBooking';
import Image from 'next/image';

type propsType={
    id:string
}
const ParticularBooking = ({ id }:propsType) => {
    // const {getParticularBooking}=useBooking()
    // const booking =getParticularBooking(id)
    const booking= {
        title: "Prime SUV Ride",
        desc: "A spacious and comfortable SUV ride from Koramangala to Kempegowda International Airport. Ideal for group travel or those with extra luggage.",
        img: "/images/default.png",
        price: 750,
        time: "1 hour 20 mins",
        pickupLocation: "Koramangala, Bangalore",
        dropLocation: "Kempegowda International Airport, Bangalore",
      };
  if (!booking) {
    return <div className="p-6 max-w-3xl mx-auto">Booking details not found.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Booking Details</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Ride Type */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Ride Type</h2>
          <p className="text-gray-700">{booking.title}</p>
        </div>

        {/* Pickup Location */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Pickup Location</h2>
          <p className="text-gray-700">{booking.pickupLocation}</p>
        </div>

        {/* Drop Location */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Drop Location</h2>
          <p className="text-gray-700">{booking.dropLocation}</p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Fare</h2>
          <p className="text-gray-700">₹{booking.price}</p>
        </div>

        {/* Estimated Duration */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Total Time</h2>
          <p className="text-gray-700">{booking.time}</p>
        </div>

        {/* Ride Image */}
        <div className="mb-4 relative h-[20vh] w-full">
            <Image
                src={booking.img}
                alt={booking.title}
                fill
                className="w-full h-48 object-contain rounded-lg"
            />
        </div>

        {/* Additional Information */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Additional Information</h2>
          <p className="text-gray-700">{booking.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default ParticularBooking;
