/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { IoInformationCircle, IoWarning } from "react-icons/io5";
import { PiWarningCircleFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import Spinner from "./Spinner";

const toastBgColor = {
  success: "bg-green-100",
  error: "bg-red-100",
  warning: "bg-yellow-50",
  loading: "bg-white",
  info: "bg-blue-100",
};

const toastTextColor = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  loading: "text-gray-700",
  info: "text-blue-600",
};

const toastIcons = {
  success: <FaCheckCircle size={20} />,
  error: <IoWarning size={22} />,
  warning: <PiWarningCircleFill size={22} />,
  info: <IoInformationCircle size={22} />,
  loading: <Spinner/>,
};

type ToastType = 'success' | 'error' | 'warning' | 'loading' | 'info';

const showToast = (
  type: ToastType,
  message: string,
  promise?: Promise<any>,
  loadingMsg?: any,
  duration?: any
) => {

    // Handle non-promise case as before
    if (duration) toast.dismiss();
    (toast as any)[type](
      <div className={`flex flex-col gap-1 px-8 py-5 -m-2 ${toastTextColor[type]} ${toastBgColor[type]}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div>{toastIcons[type as keyof typeof toastIcons]}</div>
            <div className="text-lg">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
          </div>
          <div
            onClick={() => toast.dismiss()}
            className="cursor-pointer hover:bg-gray-300 text-gray-700 rounded-md"
          >
            <RxCross2 size={20} color="#999999" />
          </div>
        </div>
        <p className="text-sm leading-4">{message}</p>
      </div>,
      {
        icon: false,
        closeButton: false,
        style: {
          padding: 0,
          borderRadius: "5px",
        },
        position: "bottom-right",
        autoClose: duration ? false : 3000,
      }
    );
};

export default showToast;
