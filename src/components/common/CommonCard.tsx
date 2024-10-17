"use client";
import Image from "next/image";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

type propsType = {
  title: string;
  desc?: string;
  primaryText?: string;
  secondaryText?: string; 
  img?: string;
  price?: number | null;
  time?: string | null;
  driver?: string;
  vehicleType?: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  width?: string;
};

const CommonCard = ({
  title,
  desc,
  img = "/images/default.png",
  price,
  time,
  onClick,
  driver,
  onDelete,
  onEdit,
  vehicleType,
  primaryText,
  secondaryText,
  width,
}: propsType) => {
  return (
    <div className={`relative flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl ${width ? `md:w-[${width}]` : "md:w-80"} h-60`} onClick={() => onClick && onClick()}>
      <div className="flex justify-between p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
        <div className="flex flex-col gap-1">
          {onEdit && (
            <button 
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
            >
              <MdEdit />
            </button>
          )}
          {onDelete && (
            <button 
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
            >
              <MdDelete />
            </button>
          )}
        </div>
      </div>
      <div className="flex h-full">
        <div className="relative w-1/3">
          <Image 
            src={img} 
            alt={title} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-l-lg" 
          />
        </div>
        <div className="flex flex-col justify-between w-2/3 p-4">
          <p className="text-gray-600">{desc}</p>
          <div className="flex justify-between mt-2">
            {(price || time) && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{price ? `₹${price}` : null}</span>
                <span className="text-gray-500">{time}</span>
              </div>
            )}
            {(driver || vehicleType) && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{driver ? `Driver: ${driver}` : null}</span>
                <span className="font-semibold text-gray-800">{vehicleType ? `Type: ${vehicleType}` : null}</span>
              </div>
            )}
            {(primaryText || secondaryText) && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{primaryText}</span>
                <span className="text-gray-500">{secondaryText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonCard;
