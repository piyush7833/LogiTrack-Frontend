"use client"

import React, { useEffect } from 'react';
import useBooking from '@/app/hooks/useBooking';
import BookingMap from './BookingMap';
import { useSelector } from 'react-redux';

type propsType={
    id:string
}
const ParticularBooking = ({ id }:propsType) => {
  const { role } = useSelector((state: { auth: { isLoggedIn: boolean; role: string; name: string } }) => state.auth);
  console.log(role)
    const {getParticularBooking}=useBooking()
    const [booking, setBooking] = React.useState<any>(null);
    useEffect(() => {
      const fetchBooking = async () => {
        const res = await getParticularBooking(id);
        if (res && res.data && res.data.data) {
          setBooking(res.data.data.booking);
        }
      };
      fetchBooking();
    }, [])

  if (!booking) {
    return <div className="p-6 max-w-3xl mx-auto">Booking details not found.</div>;
  }

  return (
    <BookingMap bookingDatac={booking} setBookingDatac={setBooking} isDriver={role==="driver"}/>
  );
};

export default ParticularBooking;
