"use client"
import Card from '@/components/common/Card';
import { useRouter } from 'next/navigation';
import React from 'react'

const data = [
    {
      id: "1",
      title: "Sedan Ride",
      desc: "Comfortable sedan ride from Indira Nagar to MG Road. Ideal for city travel.",
      img: "/images/default.png",
      price: 250,
      time: "25 mins",
    },
    {
      id: "2",
      title: "Mini Ride",
      desc: "Economical mini car ride from Koramangala to Whitefield.",
      img: "/images/default.png",
      price: 150,
      time: "35 mins",
    },
    {
      id: "3",
      title: "Prime SUV Ride",
      desc: "Spacious SUV ride from Electronic City to Kempegowda International Airport.",
      img: "/images/default.png",
      price: 500,
      time: "1 hour 15 mins",
    },
    {
      id: "4",
      title: "Auto Ride",
      desc: "Quick auto-rickshaw ride from Jayanagar to Lalbagh Botanical Garden.",
      img: "/images/default.png",
      price: 100,
      time: "15 mins",
    },
    {
      id: "5",
      title: "Bike Ride",
      desc: "Fast bike ride from HSR Layout to Silk Board Junction.",
      img: "/images/default.png",
      price: 50,
      time: "10 mins",
    },
  ];
const Booking = () => {
      const router=useRouter()
  return (
   <div className="flex">
    <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
     {data.map((item, index) => (
        <Card key={index} {...item}  onClick={()=>router.push(`/bookings/${item.id}`)}/>
      ))}
     </div>
   </div>
  )
}

export default Booking
