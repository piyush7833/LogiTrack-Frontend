/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import { useHttpClient } from "./useHttpClient";
import { addVehicleReducer, deleteVehicleReducer, setVehiclesReducer, updateVehicleReducer } from "@/store/vehicleSlice";

const useVehicle = () => {
  const { isLoading, sendAuthorizedRequest } = useHttpClient();
  const dispatch = useDispatch();

  const addVehicle = async (formData:any) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.VEHICLE + `/create`,
        "POST",
        {type:formData.type, model:formData.model, numberPlate:formData.numberPlate},
        true,
        true,
      );
      dispatch(addVehicleReducer(res.data.data.vehicle));
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };

  const getVehicle = async () => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.VEHICLE + `/get`,
        "GET",
        null,
        true,
        false,
      );
      dispatch(setVehiclesReducer(res.data.data.vehicles));
      return res;
    } catch (error: any) {
      console.log(error);
    }
  };
  const deleteVehicle = async (id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.VEHICLE + `/delete/${id}`,
        "DELETE",
        null,
        true,
        true,
      );
      dispatch(deleteVehicleReducer(id));
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  const updateVehicle = async (formData:any,id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.VEHICLE + `/update/${id}`,
        "PUT",
        {...formData},
        true,
        true,
      );
      console.log(res.data.data.vehicle,"Vehicle")
      dispatch(updateVehicleReducer(res.data.data.vehicle));
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  const getParticularVehicleAnalytics = async (id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.ADMIN + `/get-vehicle/${id}`,
        "GET",
        null,
        true,
        false,
      );
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  const getAllVehicleAnalytics = async () => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.ADMIN + `/get-all-vehicle`,
        "GET",
        null,
        true,
        false,
      );
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  return {
    addVehicle,
    getVehicle,
    deleteVehicle,
    updateVehicle,
    getParticularVehicleAnalytics,
    getAllVehicleAnalytics,
    isLoading,
  };
};

export default useVehicle;
