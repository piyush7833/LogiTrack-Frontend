/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, {  useEffect, useState } from "react";
import Card from "@/components/common/Card";
import { PiPlusCircleBold } from "react-icons/pi";
import DialogBox from "@/components/common/DialogBox";
import useVehicle from "@/app/hooks/useVehicle";
import { useSelector } from "react-redux";
import useDriver from "@/app/hooks/useDriver";
import { useRouter } from "next/navigation";
import { imgMaps } from "../../../../../config/constantMaps";
import CommonCard from "@/components/common/CommonCard";

type VehicleType = {
  _id: string;
  type: string;
  model: string;
  numberPlate: string;
  driver?: any;
};
type DriverType = {
  _id: string;
  name: string;
  licenseNumber: string;
  email: string;
  vehicle?: any;
};
const Fleet = () => {
  const router=useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState<string|false>(false);
  const [editFormValues, setEditFormValues] = useState({});

  const [newVehicle, setNewVehicle] = useState({
    type: "",
    model: "",
    numberPlate: "",
  });
  const { vehicles } = useSelector((state: { vehicle: { vehicles: VehicleType[] } }) => state.vehicle);
  const { drivers } = useSelector((state: { driver: { drivers: DriverType[] } }) => state.driver);
  const {addVehicle,getVehicle,deleteVehicle,updateVehicle}=useVehicle()
  const {getDriver}=useDriver()
  useEffect(() => {
    const fetchData = async () => {
       await getVehicle();
       await getDriver();
    };
    fetchData();
  },[]);
  const handleAddVehicle = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    addVehicle(newVehicle)
    setNewVehicle({ type: "", numberPlate: "", model: ""});
    setIsOpen(false);
  };

  const handleEditChange = (e:React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormValues({
      ...editFormValues,
      [name]: value,
    });
  };
  const handleUpdateVehicle = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    updateVehicle(editFormValues,isEditOpen as string);
    setEditFormValues({});
    setIsEditOpen(false);
  }
  console.log(vehicles,"Vehicles")
  const handleRemoveDriver = () => {
    updateVehicle({driverId:"Remove Driver"},isEditOpen as string);
  }
  return (
    <div className="min-h-screen ">

        <p className="text-lg font-semibold mb-4">Total Vehicles: {vehicles.length}</p>
      <div className="flex w-full flex-wrap gap-4 justify-center px-primaryX py-primaryY">
        {vehicles.length>0 &&  vehicles.map((item:VehicleType, index:any) => (
          <CommonCard key={index} title={item?.model} desc={item?.numberPlate} vehicleType={item?.type} driver={item?.driver?.name || "No driver"}  onDelete={()=>{deleteVehicle((item?._id) as string)}}
          onEdit={()=>{setIsEditOpen(item._id)}} img={imgMaps[item.type as keyof typeof imgMaps]} onClick={()=>{router.push(`/admin/fleet/${item._id}?model=${item.model}&numberPlate=${item.numberPlate}`)}}
          />
        ))}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <PiPlusCircleBold className="h-6 w-6" />
        </button>
      </div>


      {/* Custom Dialog for Editing Vehicle */}
      <DialogBox isOpen={isEditOpen !== false} onClose={() => setIsEditOpen(false)} title="Edit Vehicle">
  <form onSubmit={(e) => handleUpdateVehicle(e)}>
    <div className="mb-4">
      <label className="block mb-1">Type</label>
      <select
        name="type"
        required
        onChange={(e) => handleEditChange(e)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      >
        {["select type", "truck", "mini truck", "big truck"].map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
    <div className="mb-4">
      <label className="block mb-1">Model</label>
      <input
        type="text"
        onChange={(e) => handleEditChange(e)}
        className="w-full border rounded p-2"
      />
    </div>
    <div className="mb-4">
      <label className="block mb-1">Number Plate</label>
      <input
        type="text"
        onChange={(e) => handleEditChange(e)}
        className="w-full border rounded p-2"
      />
    </div>
    <div className="mb-4">
      <label className="block mb-1">Driver</label>
      <select
        name="driverId"
        onChange={(e) => handleEditChange(e)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="">Select Driver</option>
        {drivers
          .filter((driver) => !driver.vehicle)
          .map((driver) => (
            <option key={driver._id} value={driver._id}>
              {driver.name}
            </option>
          ))}
      </select>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => handleRemoveDriver()}
          className="text-red-600 hover:underline"
        >
          Remove Driver
        </button>
      </div>
    </div>
    <div className="flex justify-end">
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Update Vehicle
      </button>
    </div>
  </form>
      </DialogBox>


      {/* Custom Dialog for Adding Vehicle */}
      <DialogBox isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Vehicle">
        <form onSubmit={(e)=>handleAddVehicle(e)}>
          <div className="mb-4">
            <label className="block mb-1">Type</label>
            <select
                  name={"type"}
                  required={true}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                >
                  {["select type","truck","mini truck","big truck"].map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Model</label>
            <input
              type="text"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Number Plate</label>
            <input
              type="text"
              value={newVehicle.numberPlate}
              onChange={(e) => setNewVehicle({ ...newVehicle, numberPlate: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
              onClick={(e)=>(handleAddVehicle(e))}
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
