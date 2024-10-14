/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import L from "leaflet";
import axios from "axios";
import showToast from "@/components/common/showToast";

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
  const getRouteDetails = async (start:any, end:any) => {
    try {
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [
            [start.lng, start.lat], // Starting point [longitude, latitude]
            [end.lng, end.lat],     // Ending point [longitude, latitude]
          ],
          // Additional options can be specified here, like elevation or profile
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_ORS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = response.data;
      const route = data.routes[0];
      const totalDistance = route.summary.distance; // Distance in meters
      const totalTime = route.summary.duration;     // Duration in seconds
      const segments = route.segments;
      console.log(totalDistance, totalTime, segments);
      // Traffic details can be checked based on segment delays if available
      const totalDelay = segments.reduce((acc, segment) => acc + (segment.delay || 0), 0);
      let trafficInfo
      if (totalDelay < 300) {
        trafficInfo = "traffic-low";
      } else if (totalDelay < 900) {
        trafficInfo = "traffic-moderate";
      } else {
        trafficInfo = "traffic-high";
      }
      return {
        distance:totalDistance,
        time:totalTime,
        traffic:trafficInfo,
      };
    } catch (error) {
      console.error("Error fetching route details:", error);
      showToast("error", "Some error occurred while fetching route details");
    }
  };

   const isRaining = async (lat:any, lon:any) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = response.data;
      return data.weather[0].main === "Rain";
    } catch (error) {
      console.error("Error fetching weather details:", error);
      showToast("error", "Some error occurred while fetching weather details");
    }
  }

  return {
    getSuggestions,
    getRouteDetails,
    isRaining,
    isLoading,
  };
};

export default useLocation;
