"use client"
import Image from "next/image";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

type propsType = {
  // id?: string;
  title: string;
  desc?: string;
  primaryText?:string,
  secondaryText?:string, 
  img?: string;
  price?: number | null;
  time?: string | null;
  driver?: string;
  vehicleType?: string;
  onClick?:()=>void
  onDelete?:()=>void
  onEdit?:()=>void
  width?: string;
};
const Card = ({
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
    <div className={`px-primaryX py-primaryY rounded-sm flex gap-2 min-h-hCard w-wCard ${width?`md:w-[${width}]`:"md:w-wmdCard"} border-[1px] relative hover:cursor-pointer hover:bg-slate-100`} onClick={()=>onClick && onClick()}>
      <div className="flex flex-col gap-2 absolute bottom-1 right-2 ">
        {onDelete && <button 
        className="p-1 bg-red-500 text-white rounded-full" 
        onClick={(e) => {
          e.stopPropagation();
          if (onDelete) onDelete();
        }}
      >
       <MdDelete/>
      </button>}
        {onEdit && <button 
        className="p-1 bg-blue-500 text-white rounded-full" 
        onClick={(e) => {
          e.stopPropagation();
          if (onEdit) onEdit();
        }}
      >
       <MdEdit/>
      </button>}
      </div>
      <div className="img h-full w-1/4 relative flex items-center justify-start">
        <Image src={img} alt={title} fill className="object-contain"/>
      </div>
      <div className="details w-3/4 flex gap-1">
        <div className="flex justify-between w-2/3 flex-col">
          <p className="font-semibold">{title}</p>
          <p>{desc}</p>
        </div>
        {(price || time)&&<div className="flex justify-between w-1/3 flex-col">
          <p className="font-semibold">{price ? `₹${price}` : null}</p>
          <p>{time}</p>
        </div>}
        {(driver || vehicleType) &&<div className="flex justify-between w-1/3 flex-col">
          <p className="font-semibold">{driver ? `Driver:- ${driver}` : null}</p>
          <p className="font-semibold">{vehicleType ? `Type:- ${vehicleType}` : null}</p>
        </div>}
        {(primaryText|| secondaryText) &&<div className="flex justify-between w-1/3 flex-col">
          <p className="font-semibold">{primaryText ? primaryText : null}</p>
          <p className="">{secondaryText ? secondaryText : null}</p>
        </div>}

        
      </div>
    </div>
  );
};

export default Card;
