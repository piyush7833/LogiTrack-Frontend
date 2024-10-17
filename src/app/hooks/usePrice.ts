/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import axios from "axios";
import showToast from "@/components/common/showToast";


const usePrice = () => {

  const axiosInstance=axios.create({
    baseURL:process.env.NEXT_PUBLIC_PRICE_API_URL+'/api'+BACKEND_API_ENDPOINTS_MAP.PRICE,
    headers:{
      "Content-Type":"application/json"
    }
  })

  const getPrices = async (distances:number,traffic:string,isRaining:boolean,src:any) => {
    try {
      console.log(src.lat,src.lng)
        const res =await axiosInstance.get("/get?distance="+distances+"&traffic="+traffic+"&isRaining="+isRaining+"&lat="+src.lat+"&lng="+src.lng);
        return res;
    } catch (error: any) {
      
      showToast("error", error.response.data.message);
      console.log(error);
    }
  };


  return {
    getPrices,
  };
};

export default usePrice;
