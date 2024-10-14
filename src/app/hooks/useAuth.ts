/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import showToast from "@/components/common/showToast";
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";
import { useDispatch } from "react-redux";
import { loginSuccess, logout, setUser } from "@/store/authSlice";
const useAuth = () => {
  const router = useRouter();

  const { isLoading, sendRequest, sendAuthorizedRequest } = useHttpClient();
  const dispatch = useDispatch();
  const handleAuth = async (
    operation: string,
    formData: {
      name?: string;
      username?: string;
      phone?: string;
      email: string;
      password: string;
      role?: string;
      licenseNumber?: string;
      secretKey?: string;
    }
  ) => {
    try {
      if (operation === "login") {
        const data = {
          email: formData.email,
          password: formData.password,
        };
        const res = await sendRequest(
          BACKEND_API_ENDPOINTS_MAP.AUTH+"/login",
          "POST",
          data,
          {},
          true,
          true
        );
        if (res?.status === 202) {
          showToast("warning", res.data.message);
          return;
        }
        dispatch(loginSuccess(res.data));
        router.push("/")
        return res;
      } else if (operation === "signup") {
        const data = {
          name: formData.name ? formData.name : null,
          username: formData.username ? formData.username : null,
          phone: formData.phone ? formData.phone : null,
          email: formData.email,
          password: formData.password,
          role: formData.role ? formData.role : null,
          licenseNumber: formData.licenseNumber ? formData.licenseNumber : null,
          secretKey: formData.secretKey ? formData.secretKey : null,
        };
        const res = await sendRequest(
          BACKEND_API_ENDPOINTS_MAP.AUTH+"/signup",
          "POST",
          data,
          {},
          true
        );
        showToast("success", res?.data.message);
        // console.log(res);
        return res;
      } else {
        showToast("error", "Invalid operation");
        // console.log("Invalid operation");
      }
    } catch (error: any) {
      // showToast("error", "Some error occurred");
      console.log(error);
    }
  };

  const handleLogout=async()=>{
    dispatch(logout());
    router.push("/auth?mode=login");
  }

  const handleGetOwnProfile = async () => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.AUTH+"/me",
        "GET",
        {},
        true
      );
      dispatch(setUser(res.data.data.user));
      return res;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      console.log(error);
    }
  }

  const handleGetParticularProfile = async (id:string) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.AUTH+"/get/"+id,
        "GET",
        {},
        true
      );
      return res;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      console.log(error);
    }
  }
  const handleUpdateProfile = async (formData:any) => {
    try {
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.AUTH+"/update",
        "PUT",
        formData,
        true
      );
      dispatch(setUser(res.data.data.user));
      return res;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      console.log(error);
    }
  }


  // const handleForgotPassword = async (email: string) => {
  //   try {
  //     console.log("Forgot password email: ", email);

  //     const data = {
  //       email: email,
  //     };
  //     const res = await sendRequest(
  //       BACKEND_API_ENDPOINTS_MAP.EMAIL_FORGOT_PASSWORD,
  //       "POST",
  //       data,
  //       {},
  //       true
  //     );
  //     console.log(res);
  //     showToast("success", res?.data.detail);
  //     return res;
  //   } catch (error: any) {
  //     showToast("error", "Some error occurred");
  //     console.log(error);
  //   }
  // };

  // const handleResetPassword = async (password: string) => {
  //   try {
  //     const data = {
  //       password: password,
  //     };
  //     const res = await sendAuthorizedRequest(
  //       BACKEND_API_ENDPOINTS_MAP.EMAIL_RESET_PASSWORD,
  //       "POST",
  //       data,
  //       true
  //     );
  //     // console.log(res);
  //     showToast("success", res?.data.detail);

  //     // Get the previous URL from browser history (if available)

  //     return res;
  //   } catch (error: any) {
  //     showToast("error", "Some error occurred");
  //     router.push("/auth");
  //     console.log(error);
  //   }
  // };

  // const handleResendVerificationMail = async (email: string) => {
  //   try {
  //     const data = {
  //       email: email,
  //     };
  //     const res = await sendAuthorizedRequest(
  //       BACKEND_API_ENDPOINTS_MAP.EMAIL_RESEND_VERIFICATION,
  //       "POST",
  //       data,
  //       true
  //     );
  //     console.log(res);
  //     showToast("success", res?.data.detail);
  //     return res;
  //   } catch (error: any) {
  //     showToast("error", "Some error occurred");
  //     console.log(error);
  //   }
  // };

  return {
    handleAuth,
    handleUpdateProfile,
    handleGetOwnProfile,
    handleGetParticularProfile,
    // handleForgotPassword,
    // handleResetPassword,
    // handleResendVerificationMail,
    handleLogout,
    isLoading,
  };
};

export default useAuth;
