/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useCallback, useRef, useEffect } from "react";
import showToast from "@/components/common/showToast";
import useCookie from "./useCookie";
// import { useSelector } from "react-redux";
// import { get } from "http";
// import { useSelector } from "react-redux";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL+'/api';
// axios.defaults.withCredentials = true;

export const useHttpClient = () => {

  const [isLoading, setIsLoading] = useState(false);
  const { getCookie } = useCookie();
    
//   const [error, setError] = useState(false);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method = "GET",
      data: object | null = null,
      headers: object = {},
      showErrorToast = false,
      showSuccessToast = false
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      console.log("sendRequest: ", url, method, data, headers);

      try {
        const responseData = await axios({
          url,
          method,
          data,
          headers,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        
        if (showSuccessToast) showToast("success", responseData.data.message,undefined,undefined, true );

        console.log(responseData);
        return responseData;
      } catch (error:any) {
        //    setError(error.message);
        
        if (showErrorToast) showToast("error", error.response.data.message,undefined,undefined, true );
        console.log(error, "error from useHs");
        // return error;
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // const {token} = useSelector((state:any)=>state.auth);
  

  const sendAuthorizedRequest = useCallback(
    async (
      url: string,
      method = "GET",
      data: object | null = null,
      showErrorToast = false,
      showSuccessToast = false
    ) => {
      // console.log(getCookie("token"));
      return sendRequest(
        url,
        method,
        data,
        {
          Authorization: getCookie("token")
            ? `Bearer ${getCookie("token")}`
            : undefined,
        },
        showErrorToast,
        showSuccessToast
      );
    },
    [sendRequest]
  );
 
  useEffect(() => {
    return () => {
    //   activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, sendRequest, sendAuthorizedRequest };
};
