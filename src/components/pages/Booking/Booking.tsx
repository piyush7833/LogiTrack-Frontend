/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import useBooking from '@/app/hooks/useBooking';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import BookingCard from './BookingCard';


const Booking = () => {
  const router=useRouter()
  const [data, setData] = useState([])
  const {getAllBookings} = useBooking()
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getAllBookings();
      if (res && res.data && res.data.data) {
        setData(res.data.data.bookings);
      }
    };
    fetchBookings();
  }, [])
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
     {data.map((item:any, index) => (
        <BookingCard key={index} srcName={item.srcName} destnName={item.destnName} duration={item.duration} price={item.price} status={item.status} startAt={item.startTime} endAt={item.endTime}    onClick={()=>router.push(`/bookings/${item._id}`)}/>
      ))}
     </div>
  )
}

export default Booking
