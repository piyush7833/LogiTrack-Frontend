// components/DialogBox.js

import React from "react";
type propsType={
    isOpen:boolean,
    onClose:()=>void,
    title:string,
    children:React.ReactNode
}
const DialogBox = ({ isOpen, onClose, title, children }:propsType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center ">
      <div className="bg-white rounded-lg shadow-lg p-6 mx-4 w-full md:w-1/2">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
