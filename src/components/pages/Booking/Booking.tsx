"use client"
import useBooking from '@/app/hooks/useBooking';
import Card from '@/components/common/Card';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const Booking = () => {
  const router=useRouter()
  const [data, setData] = useState([])
  const {getAllBookings} = useBooking()
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getAllBookings();
      if (res && res.data) {
        setData(res.data.data.bookings);
      }
    };
    fetchBookings();
  }, [])
  
  return (
   <div className="flex">
    <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
     {data.map((item:any, index) => (
        <Card key={index} title={item.srcName + "-> "+ item.destnName} time={item.duration} price={item.price} desc={item.status}    onClick={()=>router.push(`/bookings/${item._id}`)}/>
      ))}
     </div>
   </div>
  )
}

export default Booking
