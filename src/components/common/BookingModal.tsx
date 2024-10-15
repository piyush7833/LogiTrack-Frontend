import React from "react";

interface BookingModalProps {
  notification: any;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({  onAccept, onReject, onClose,notification }) => {
  return (
    <div className="fixed bottom-4 transform right-0 z-50 bg-white p-6 shadow-lg rounded-lg w-96">
      <div className="modal-content">
        <h2 className="text-xl font-semibold mb-4">New Booking Available</h2>
        {notification && Object.entries(notification).map(([key, value]) => (
            <p key={key} className="text-gray-700 mb-4">
                {key}: {value as string}
            </p>
        ))}
        <div className="flex gap-4 mt-4">
          <button
            onClick={onAccept}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 underline hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
