/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import showToast from "@/components/common/showToast";
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";


const useBooking = () => {
  const router = useRouter();

  const { isLoading, sendRequest, sendAuthorizedRequest } =
    useHttpClient();

  const createBooking = async (data: any) => {
    try {
      const response = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.BOOKING+"/create",
        "POST",
        {...data},
        true,
        true,
      );
      return response;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      console.log(error);
    }
  }

  const getParticularBooking = async (id: string) => {
    try {
        const response = await sendAuthorizedRequest(
            BACKEND_API_ENDPOINTS_MAP.BOOKING + "/get?id=" + id,
            "GET",
            null,
            true,
            true
        );
        return response;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };

  const getAllBookings = async () => {
    try {
        const response = await sendAuthorizedRequest(
            BACKEND_API_ENDPOINTS_MAP.BOOKING + "/get",
            "GET",
            null,
            true,
            true
        );
        return response;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.BOOKING + "/update",
        "POST",
        {id, status},
        true,
        true
      );
      return response;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  }

  return {
    getParticularBooking,
    getAllBookings,
    updateStatus,
    createBooking,
    isLoading,
  };
};

export default useBooking;
