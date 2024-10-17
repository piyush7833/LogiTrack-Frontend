interface DriverProps {
    driverName: string;
    distance: string;
  }
  
  const DriverCard = ({ driverName, distance }: DriverProps) => {
    return (
      <div className="flex items-center p-6 bg-blue-50 rounded-lg shadow-lg border border-blue-200">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          {/* SVG representing a human profile */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-10 h-10 text-blue-500"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-blue-800">{driverName}</h3>
          <p className="text-sm text-blue-600">Distance: {distance}</p>
        </div>
      </div>
    );
  };
  
  export default DriverCard;
  