"use client";
import useDriver from '@/app/hooks/useDriver'
import React, { useEffect, useState } from 'react'

type propsType={id:string}

const ParticularDriver = ({id}:propsType) => {
  const {getParticularDriverAnalytics}=useDriver()
  const [data,setData]=useState<any>(null)
  useEffect(() => {
    const fetchData = async () => {
      const res=await getParticularDriverAnalytics(id);
      if(res){
        setData(res.data.data.driverAnalytics[0])
      }
   };
   fetchData();
  }
  , [])

  return (
    <div>
    {data && (
      <div className="flex flex-col items-center justify-center min-h-[90vh]">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <div className="text-lg font-bold mb-4">Driver Analytics</div>
          <div className="text-sm mb-2">ID: {data._id}</div>
          <div className="text-sm mb-2">Total Earnings: Rs {data?.totalEarnings?.toFixed(2)}</div>
          <div className="text-sm mb-2">Total Trips: {data?.totalTrips}</div>
          <div className="text-sm mb-2">Total Duration: {data?.totalDuration} hours</div>
          <div className="text-sm mb-2">Total Distance: {data?.totalDistance.toFixed(2)} meters</div>
          <div className="text-sm mb-2">Available: {data?.isAvailable ? "Yes" : "No"}</div>
          <div className="text-sm mb-2">Running Trip: {data?.runningTrip ? data?.runningTrip?.srcName + '->' + data?.runningTrip?.destnName : "None"}</div>
        </div>
      </div>
    )}
    </div>
  )
}

export default ParticularDriver
