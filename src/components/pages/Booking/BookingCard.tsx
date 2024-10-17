import { FaClock, FaRupeeSign, FaRoute, FaCalendar } from 'react-icons/fa';

interface Booking {
  srcName: string;
  destnName: string;
  duration: string;
  price: number;
  status: string;
  onClick: () => void;
  startAt: string;
  endAt: string;
}

const BookingCard = ({ srcName, destnName, duration, price, status, onClick ,startAt,endAt}: Booking) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      case 'collected':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div
      onClick={() => onClick()}
      className="cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">
          {srcName} <span className="text-blue-500">→</span> {destnName}
        </h4>
        <FaRoute className="text-gray-500" />
      </div>
      <div className="mb-4">
        <p className="text-gray-600 flex items-center">
          <FaClock className="mr-2" /> {duration}
        </p>
        <p className="text-gray-600 flex items-center">
          <FaCalendar className="mr-2 space-x-2" /> 
          {startAt ? new Date(startAt).toLocaleDateString() : 'Not started'} 
          <span className="text-blue-500"> → </span> 
          {endAt ? new Date(endAt).toLocaleDateString() : 'Not ended'}
        </p>
        <p className="text-gray-600 flex items-center mt-2">
          <FaRupeeSign className="mr-2" /> {price.toLocaleString('en-IN')} 
        </p>
      </div>
      <p className={`font-medium ${getStatusColor()}`}>
        {status}
      </p>
    </div>
  );
};

export default BookingCard;
