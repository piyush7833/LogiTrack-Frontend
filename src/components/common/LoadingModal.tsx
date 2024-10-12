"use client"
import Image from "next/image";
import React from "react";

import { useEffect, useState } from "react";
import { FaCircleNotch, FaCheckCircle } from "react-icons/fa";

const LoadingModal = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <div className="absolute inset-12 flex justify-center items-center bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg flex flex-col items-center space-y-4 p-16">
        <div className="">
          <Image
            src="/images/flight.gif"
            alt="loading"
            width={100}
            height={100}
          />
        </div>
        <div className="flex space-x-2 items-start">
          {step >= 1 ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaCircleNotch className="animate-spin text-gray-500" />
          )}
          <p className="text-lg text-gray-500">Searching 400+ flights</p>
        </div>
        <div className="flex  space-x-2">
          {step >= 2 ? (
            <FaCheckCircle className="text-green-500" />
          ) : step>=1?(
            <FaCircleNotch className="animate-spin text-gray-500" />
          ):""}
          <p className="text-sm text-gray-500">Attaching company rules</p>
        </div>
        <div className="flex  space-x-2">
          {step >= 3 ? (
            <FaCheckCircle className="text-green-500" />
          ) :step>=2? (
            <FaCircleNotch className="animate-spin text-gray-500" />
          ):""}
          <p className="text-sm text-gray-500">Serving best results</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
