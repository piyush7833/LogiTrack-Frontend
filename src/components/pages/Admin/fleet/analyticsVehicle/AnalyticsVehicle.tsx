"use client";
import useVehicle from '@/app/hooks/useVehicle';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type propsType={id:string}

const AnalyticsVehicle = ({id}:propsType) => { 
  const {getParticularVehicleAnalytics}=useVehicle()
  const model=useSearchParams().get('model')
  const numberPlate=useSearchParams().get('numberPlate')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <div className="flex items-center mb-4">
          <Image src={'/images/truck.png'} width={50} height={50} className="mr-4" alt='vehicle' />
          <div className="text-lg font-bold">{model}</div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Number Plate:</span>
            <span className="text-sm">Rs {numberPlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Total Earnings:</span>
            <span className="text-sm">Rs {data?.totalEarnings?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Total Trips:</span>
            <span className="text-sm">{data?.totalTrips}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Total Duration:</span>
            <span className="text-sm">{data?.totalDuration} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Total Distance:</span>
            <span className="text-sm">{data?.totalDistance.toFixed(2)} meters</span>
          </div>
        </div>
      </div>
    </div>
    )}
    </div>
  )
}

export default AnalyticsVehicle
