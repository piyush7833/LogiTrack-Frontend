"use client"
import ParticularBooking from '@/components/pages/Booking/ParticularBooking/ParticularBooking'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
    const params=useParams()
  return (
    <ParticularBooking id={params.id as string}/>
  )
}

export default Page
