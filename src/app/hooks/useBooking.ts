/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import showToast from "@/components/common/showToast";
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";


const useEmailAuth = () => {
  const router = useRouter();

  const { isLoading, sendRequest, sendAuthorizedRequest } =
    useHttpClient();


  const getParticularBooking = async (id: string) => {
    try {
        
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };



  return {
    getParticularBooking,
    isLoading,
  };
};

export default useEmailAuth;
