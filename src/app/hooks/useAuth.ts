/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import showToast from "@/components/common/showToast";
import { useHttpClient } from "./useHttpClient";
import { BACKEND_API_ENDPOINTS_MAP } from "../../../config/constantMaps";


const useEmailAuth = () => {
  const router = useRouter();

  const { isLoading, sendRequest, sendAuthorizedRequest } =
    useHttpClient();


  const handleEmailAuth = async (
    operation: string,
    formData: { username: string; email: string; password: string }
  ) => {
    try {
      // console.log(formData);
      if (operation === "login") {
        // console.log("Login operation");
        const data = {
          email: formData.email,
          password: formData.password,
        };
        const res = await sendRequest(
          BACKEND_API_ENDPOINTS_MAP.EMAIL_LOGIN,
          "POST",
          data,
          {},
          true
        );
        if (res?.status === 202) {
          showToast("warning", res.data.detail);
          return;
        }

        // dispatch(user());
        // console.log(res);
        return res;
        // router.push(`/verify/${res?.data.access_token}`);
      } else if (operation === "signup") {
        // console.log("Signup operation");
        const data = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        const res = await sendRequest(
          BACKEND_API_ENDPOINTS_MAP.EMAIL_SIGNUP,
          "POST",
          data,
          {},
          true
        );
        showToast("success", res?.data.detail);
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

  const handleForgotPassword = async (email: string) => {
    try {
      console.log("Forgot password email: ", email);

      const data = {
        email: email,
      };
      const res = await sendRequest(
        BACKEND_API_ENDPOINTS_MAP.EMAIL_FORGOT_PASSWORD,
        "POST",
        data,
        {},
        true
      );
      console.log(res);
      showToast("success", res?.data.detail);
      return res;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      console.log(error);
    }
  };

  const handleResetPassword = async (password: string) => {
    try {
      const data = {
        password: password,
      };
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.EMAIL_RESET_PASSWORD,
        "POST",
        data,
        true
      );
      // console.log(res);
      showToast("success", res?.data.detail);

      // Get the previous URL from browser history (if available)

      return res;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      router.push("/auth");
      console.log(error);
    }
  };

  const handleResendVerificationMail = async (email: string) => {
    try {
      const data = {
        email: email,
      };
      const res = await sendAuthorizedRequest(
        BACKEND_API_ENDPOINTS_MAP.EMAIL_RESEND_VERIFICATION,
        "POST",
        data,
        true
      );
      console.log(res);
      showToast("success", res?.data.detail);
      return res;
    } catch (error: any) {
      showToast("error", "Some error occurred");
      console.log(error);
    }
  };


  return {
    handleEmailAuth,
    handleForgotPassword,
    handleResetPassword,
    handleResendVerificationMail,
    isLoading,
  };
};

export default useEmailAuth;
