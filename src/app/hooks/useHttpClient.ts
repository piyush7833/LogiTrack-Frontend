import axios from "axios";
import { useState, useCallback, useRef, useEffect } from "react";
import showToast from "@/components/common/showToast";
import useCookie from "./useCookie";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL+'/api';
// axios.defaults.withCredentials = true;

export const useHttpClient = () => {

  const [isLoading, setIsLoading] = useState(false);
  const { getCookie } = useCookie();
//   const [error, setError] = useState(false);

//   const activeHttpRequests = useRef<AbortController[]>([]);

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
    //   activeHttpRequests.current.push(httpAbortCtrl);

      console.log("sendRequest: ", url, method, data, headers);

      try {
        const responseData = await axios({
          url,
          method,
          data,
          headers,
          signal: httpAbortCtrl.signal,
        });

        // activeHttpRequests.current = activeHttpRequests.current.filter(
        //   (reqCtrl) => reqCtrl !== httpAbortCtrl
        // );
        
        if (showSuccessToast) showToast("success", responseData.data.detail,undefined,undefined, true );

        console.log(responseData);
        return responseData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        //    setError(error.message);
        if (showErrorToast) showToast("error", error.response.data.detail,undefined,undefined, true );
        console.log(error, "error from useHs");
        // return error;
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const sendAuthorizedRequest = useCallback(
    async (
      url: string,
      method = "GET",
      data: object | null = null,
      showErrorToast = false,
      showSuccessToast = false
    ) => {
      return sendRequest(
        url,
        method,
        data,
        {
          authorization: getCookie("access_token")
            ? `Bearer ${getCookie("access_token")}`
            : undefined,
        },
        showErrorToast,
        showSuccessToast
      );
    },
    [sendRequest]
  );
 
//   useEffect(() => {
//     return () => {
//     //   activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
//     };
//   }, []);

  return { isLoading, sendRequest, sendAuthorizedRequest };
};
