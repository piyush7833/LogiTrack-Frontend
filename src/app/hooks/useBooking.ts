/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import axios from "axios";
import showToast from "@/components/common/showToast";



declare global {
  interface Window {
    Razorpay: any;
  }
}

const useBooking = () => {

  const { isLoading, sendAuthorizedRequest } =
    useHttpClient();

    const createBooking = async (
      data
    : any) => {
      try {
        console.log(data)
        const response = await sendAuthorizedRequest(
          BACKEND_API_ENDPOINTS_MAP.BOOKING,
          "POST",
          {
            ...data
          },
          true,
          true
        );
       return response
        
      } catch (error) {
        console.log(error)
      }
    };


    const handlePayment = async (bookingPrice:any,bookingId:any) => {
      const {
        data: { key },
      } = await axios.get("/getkey");
      const { data } = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.PAYMENT + "/checkout/",
        "POST",
        {
          amount: bookingPrice,
        },
        true,
        true
      );
      const options = {
        key: key,
        amount: data.order.amount,
        currency: "INR",
        name: "Atlan-Assignment",
        description: "Order Transaction",
        image: {},
        order_id: data.order.id,
        handler: async function (response:any) {
          try {
              await sendAuthorizedRequest(
              BACKEND_API_ENDPOINTS_MAP.PAYMENT + "/verification/",
              "POST",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: bookingPrice,
                bookingId
              },
              true,
              true
            );
            showToast("success", "Payment Successful");
          } catch (error) {
            console.log(error,"error");
            showToast("error", "Some error occurred");
          }
        },
        theme: {
          color: "#202020",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    };  

    
  const getParticularBooking = async (id: string) => {
    try {
        const response = await sendAuthorizedRequest(
            BACKEND_API_ENDPOINTS_MAP.BOOKING + "/get/" + id,
            "GET",
            null,
            true,
            false
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
            BACKEND_API_ENDPOINTS_MAP.BOOKING + "/get-all",
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

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const response = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.BOOKING + "/update/" + id,
        "PUT",
        {status},
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
    updateBookingStatus,
    createBooking,
    handlePayment,
    isLoading,
  };
};

export default useBooking;
