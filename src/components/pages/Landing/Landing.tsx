"use client";
import Card from "@/components/common/Card";
import Search from "@/components/common/Search";
import Map from "./Map";
import { useState } from "react";

const data = [
  {
    title: "Heavy Duty Cargo Truck",
    desc: "A reliable truck for transporting heavy cargo across long distances.",
    img: "/images/default.png",
    price: 75000,
    time: "3-5 days for delivery",
  },
  {
    title: "Pickup Truck",
    desc: "Versatile pickup truck suitable for both work and leisure, equipped with a spacious bed.",
    img: "/images/default.png",
    price: 30000,
    time: "2-3 days for delivery",
  },
  {
    title: "Mini Delivery Truck",
    desc: "Compact delivery truck ideal for urban deliveries, with a fuel-efficient engine.",
    img: "/images/default.png",
    price: 20000,
    time: "1-2 days for delivery",
  },
  {
    title: "Tow Truck",
    desc: "A tow truck designed for roadside assistance and vehicle towing, equipped with a hydraulic lift.",
    img: "/images/default.png",
    price: 40000,
    time: "4-6 days for delivery",
  },
  {
    title: "Dump Truck",
    desc: "Heavy-duty dump truck for construction and mining operations, with a large capacity bed.",
    img: "/images/default.png",
    price: 85000,
    time: "5-7 days for delivery",
  },
];


export default function Home() {
  const [src, setSrc] = useState();
  const [destn, setDestn] = useState();
  return (
    <div className="min-h-screen ">
      <div className="min-h-screen">
        <Search onSelect={setSrc} placeholder="Enter pickup location" listName="src"/>
        <Search onSelect={setDestn} placeholder="Enter drop location" listName="destn"/>
        <Map src={src} destn={destn}/>
      </div>
     <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
     {data.map((item, index) => (
        <Card key={index} {...item} />
      ))}
     </div>
    </div>
  );
}
