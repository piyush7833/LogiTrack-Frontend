"use client"
import React, { useState } from "react";
import Card from "@/components/common/Card";
import { PiPlusCircleBold } from "react-icons/pi";
import DialogBox from "@/components/common/DialogBox";

const Fleet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    title: "",
    desc: "",
    img: "",
    driver: "",
  });

  const data = [
    {
      title: "Heavy Duty Cargo Truck",
      desc: "A reliable truck for transporting heavy cargo across long distances.",
      img: "/images/default.png",
      driver: "Shivendra",
    },
    {
      title: "Pickup Truck",
      desc: "Versatile pickup truck suitable for both work and leisure, equipped with a spacious bed.",
      img: "/images/default.png",
      driver: "Shivendra",
    },
    {
      title: "Mini Delivery Truck",
      desc: "Compact delivery truck ideal for urban deliveries, with a fuel-efficient engine.",
      img: "/images/default.png",
      driver: "Shivendra",
    },
    {
      title: "Tow Truck",
      desc: "A tow truck designed for roadside assistance and vehicle towing, equipped with a hydraulic lift.",
      img: "/images/default.png",
      driver: "Shivendra",
    },
    {
      title: "Dump Truck",
      desc: "Heavy-duty dump truck for construction and mining operations, with a large capacity bed.",
      img: "/images/default.png",
      driver: "Shivendra",
    },
  ];

  const handleAddVehicle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add the new vehicle to the fleet (You can implement your own logic to store this data)
    console.log("New Vehicle:", newVehicle);
    setNewVehicle({ title: "", desc: "", img: "", driver: "" });
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen ">
      <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
        {data.map((item, index) => (
          <Card key={index} {...item} onDelete={()=>{console.log("delete")}} />
        ))}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <PiPlusCircleBold className="h-6 w-6" />
        </button>
      </div>

      {/* Custom Dialog for Adding Vehicle */}
      <DialogBox isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Vehicle">
        <form onSubmit={(e)=>handleAddVehicle(e)}>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={newVehicle.title}
              onChange={(e) => setNewVehicle({ ...newVehicle, title: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              value={newVehicle.desc}
              onChange={(e) => setNewVehicle({ ...newVehicle, desc: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Image URL</label>
            <input
              type="text"
              value={newVehicle.img}
              onChange={(e) => setNewVehicle({ ...newVehicle, img: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Driver Name</label>
            <input
              type="text"
              value={newVehicle.driver}
              onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </DialogBox>
    </div>
  );
};

export default Fleet;
