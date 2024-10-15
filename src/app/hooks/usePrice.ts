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

  const getPrices = async (distances:number,traffic:string,isRaining:boolean) => {
    try {
      console.log("object")
        const res =await axiosInstance.get("/get?distance="+distances+"&traffic="+traffic+"&isRaining="+isRaining)
        return res;
    } catch (error: any) {
      showToast("error", "Some error occurred while fetching price");
      console.log(error);
    }
  };



  return {
    getPrices,
  };
};

export default usePrice;
