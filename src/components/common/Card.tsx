"use client"
import Image from "next/image";
import React from "react";
import { MdDelete } from "react-icons/md";

type propsType = {
  id?: string;
  title: string;
  desc?: string;
  img?: string;
  price?: number;
  time?: string;
  driver?: string;
  onClick?:()=>void
  onDelete?:()=>void
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
  id
}: propsType) => {
  return (
    <div className="px-primaryX py-primaryY rounded-sm flex gap-2 min-h-hCard w-wCard md:w-wmdCard border-[1px] relative" onClick={()=>onClick && onClick()}>
        {onDelete && <button 
        className="absolute bottom-2 right-2 p-1 bg-red-500 text-white rounded-full" 
        onClick={(e) => {
          e.stopPropagation();
          if (onDelete) onDelete();
        }}
      >
       <MdDelete/>
      </button>}
      <div className="img h-full w-1/4 relative flex items-center justify-start">
        <Image src={img} alt={title} fill className="object-contain"/>
      </div>
      <div className="details w-3/4 flex gap-1">
        <div className="flex justify-between w-2/3 flex-col">
          <p className="font-semibold">{title}</p>
          <p>{desc}</p>
        </div>
        <div className="flex justify-between w-1/3 flex-col">
          <p className="font-semibold">{price ? `₹${price}` : null}</p>
          <p>{time}</p>
        </div>
        <div className="flex justify-between w-1/3 flex-col">
          <p className="font-semibold">{driver ? `Driver ${driver}` : null}</p>
          <p>{time}</p>
        </div>

        
      </div>
    </div>
  );
};

export default Card;
