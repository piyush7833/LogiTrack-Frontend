import { useEffect } from "react";

interface ModalProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const AnimatedModal = ({ message, isVisible, onClose }: ModalProps) => {
  const playNotificationSound = () => {
    const audio = new Audio("/audio/ring.mp3");
    audio.play();
  };
  
  useEffect(() => {
    if (isVisible) {
      playNotificationSound();
      const timer = setTimeout(() => {
      onClose();
      }, 3000); // Close the modal after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return isVisible ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      style={{ zIndex: "10000" }}
    >
      <div
        className="bg-white p-6 rounded-lg text-center shadow-2xl transform transition-transform duration-500 scale-105"
        style={{
          animation: "fade-in 0.5s ease-out, scale-in 0.5s ease-out",
        }}
      >
        <h2 className="text-2xl font-semibold text-gray-800">{message}</h2>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  ) : null;
};

export default AnimatedModal;
