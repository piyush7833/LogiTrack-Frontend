"use client";
import useVehicle from '@/app/hooks/useVehicle';
import React, { useEffect, useState } from 'react'

type propsType={id:string}

const ParticularFleet = ({id}:propsType) => {
  const {getParticularVehicleAnalytics}=useVehicle()
  const [data,setData]=useState<any>(null)
  useEffect(() => {
    const fetchData = async () => {
      const res=await getParticularVehicleAnalytics(id);
      if(res){
        setData(res.data.data.vehicleAnalytics[0])
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
        </div>
      </div>
    )}
    </div>
  )
}

export default ParticularFleet
