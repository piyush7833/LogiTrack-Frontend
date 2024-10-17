"use client";
import useDriver from '@/app/hooks/useDriver';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material'; // Ensure to install Material-UI if you haven't already

type propsType = {
  id: string;
};

const AnalyticsDriver = ({ id }: propsType) => {
  const { getParticularDriverAnalytics } = useDriver();
  const name = useSearchParams().get('name');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getParticularDriverAnalytics(id);
      if (res) {
        setData(res.data.data.driverAnalytics[0]);
        console.log(res.data.data.driverAnalytics[0]);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {data && (
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <Avatar sx={{ bgcolor: '#1976d2' }} className="mr-4" />
              <div className="text-lg font-bold">{name}</div>
            </div>
            <div className="grid grid-cols-1 gap-2">
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
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Available:</span>
                <span className="text-sm">{data?.isAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Running Trip:</span>
                <span className="text-sm">{data?.runningTrip ? `${data.runningTrip.srcName} -> ${data.runningTrip.destnName}` : "None"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
};

export default AnalyticsDriver;
