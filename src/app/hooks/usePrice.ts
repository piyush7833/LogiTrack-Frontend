import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";


const usePrice = () => {

  const { isLoading, sendRequest } =
    useHttpClient();


  const getPrices = async (distances:number,traffic:string,isRaining:boolean) => {
    try {
        const res = await sendRequest(
            BACKEND_API_ENDPOINTS_MAP.PRICE+"/get?distance="+distances+"&traffic="+traffic+"&isRaining="+isRaining,
            "GET",
            null,
            {},
            true
          );
          return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };



  return {
    getPrices,
    isLoading,
  };
};

export default usePrice;
