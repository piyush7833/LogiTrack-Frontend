/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import { useHttpClient } from "./useHttpClient";
import { addDriverReducer, deleteDriverReducer, setDriversReducer, updateDriverReducer } from "@/store/driverSlice";

const useDriver = () => {
  const { isLoading, sendAuthorizedRequest } = useHttpClient();
  const dispatch = useDispatch();

  const addDriver = async (formData:object) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.DRIVER + `/create`,
        "POST",
        {...formData},
        true,
        true,
      );
      dispatch(addDriverReducer(res.data.data.driver));
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  const getDriver = async () => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.DRIVER + `/get`,
        "GET",
        null,
        true,
        false,
      );
      dispatch(setDriversReducer(res.data.data.drivers));
      return res;
    } catch (error: any) {
      console.log(error);
    }
  };
  const deleteDriver = async (id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.DRIVER + `/delete/${id}`,
        "DELETE",
        null,
        true,
        true,
      );
      dispatch(deleteDriverReducer(id));
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  const updateDriver = async (id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.DRIVER + `/delete/${id}`,
        "DELETE",
        null,
        true,
        true,
      );
      dispatch(updateDriverReducer(res.data));
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };
  const getParticularDriver = async (id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.DRIVER + `/delete/${id}`,
        "DELETE",
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
    addDriver,
    getDriver,
    deleteDriver,
    updateDriver,
    getParticularDriver,
    isLoading,
  };
};

export default useDriver;
