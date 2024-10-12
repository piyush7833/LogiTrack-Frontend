/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import L from "leaflet";

const useLocation = () => {
  const { isLoading, sendRequest } = useHttpClient();

  const getSuggestions = async (query: string) => {
    try {
      const res = await sendRequest(
        BACKEND_API_ENDPOINTS_MAP.LOCATION + `/get?query=${query}`,
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
  const getRoute = async (src: any, destn: any) => {
    try {
    //   console.log(src, destn);
      const res = await sendRequest(
        BACKEND_API_ENDPOINTS_MAP.LOCATION + `/get-route`,
        "POST",
        {
          src: { lat: src.lat, lng: src.lon },
          destn: { lat: destn.lat, lng: destn.lon },
        },
        {},
        true
      );
      console.log(res);
      return res;
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };

  return {
    getSuggestions,
    getRoute,
    isLoading,
  };
};

export default useLocation;
