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
};

const toastTextColor = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  loading: "text-gray-700",
};

const toastIcons = {
  success: <FaCheckCircle size={20} />,
  error: <IoWarning size={22} />,
  warning: <PiWarningCircleFill size={22} />,
  info: <IoInformationCircle size={22} />,
  loading: <Spinner/>,
};

const showToast = (
  type: string,
  message: string,
  promise?: Promise<any>,
  loadingMsg?: any,
  duration?: any
) => {
  toast.dismiss(); // to dismiss the previous toast if no time or no autoclose
  if (promise) {
    // Show loading indicator
    const loadingId = toast.loading(
      <div
        className={`flex flex-col gap-1 px-8 py-5 -m-2 ${toastTextColor[type]} ${toastBgColor[type]}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div>{toastIcons.loading}</div>
            <div className="text-lg">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
          </div>
          <div onClick={() => toast.dismiss()} className="cursor-pointer">
            <RxCross2 size={20} color="#999999" />
          </div>
        </div>
        <p className="text-sm leading-4">{loadingMsg || "Loading"}</p>
      </div>,
      {
        icon: false,
        closeButton: false,
        style: {
          padding: 0,
          borderRadius: "5px",
        },
        position: "bottom-right",
        autoClose: false, // Do not auto-close until the promise resolves or rejects
      }
    );

    promise
      .then((result) => {
        // FOR SHOWING NEW TOAST
        toast.dismiss(loadingId);

        toast.success(
          <div className={`flex flex-col gap-1 px-8 py-5 -m-2 ${toastTextColor.success} ${toastBgColor.success}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div>{toastIcons.success}</div>
                <div className="text-lg">Success</div>
              </div>
              <div onClick={() => toast.dismiss()} className="cursor-pointer">
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
            autoClose: 3000,
          }
        );
      })
      .catch((error) => {
        toast.dismiss(loadingId); //already handled in useHTTPclient
      });
  } else {
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
  }
};

export default showToast;
