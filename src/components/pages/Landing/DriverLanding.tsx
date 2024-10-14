// pages/notifications.tsx
import useCookie from "@/app/hooks/useCookie";
import { useEffect, useRef, useState } from "react";

interface NotificationMessage {
  message: NotificationType;
  userId: string;
  type?: string;
}

type NotificationType = {
  srcName: string;
  destnName: string;
  distance: number;
  price: number;
  bookingId: string;
};

const DriverLanding: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const {getCookie}=useCookie();
  const ws = useRef<WebSocket | null>(null);
  const userId = getCookie("driverId"); // Replace with the actual user ID

  console.log(userId,"driverId");
  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket("ws://localhost:8080?userId=" + userId);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const notification: NotificationMessage = JSON.parse(event.data);

      if (notification.type === 'bookingAccepted' && notification.userId === userId) {
        console.log(`Booking ${notification.message.bookingId} accepted successfully`);
        setNotifications([]);
      } else if (notification.userId === userId) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification.message,
        ]);
        // Play audio on new notification
        const audio = new Audio("/audio/ring.mp3");
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Stop sending notifications for a specific booking
  const stopNotifications = (bookingId: string) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({ type: "stop", userId, bookingId }));
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.bookingId !== bookingId)
      );
    }
  };

  // Accept a booking
  const handleAcceptBooking = (bookingId: string) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({ type: "accept", userId, bookingId }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.bookingId}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <h2>New Booking Notification</h2>
            <p>
              <strong>Source:</strong> {notification.srcName}
            </p>
            <p>
              <strong>Destination:</strong> {notification.destnName}
            </p>
            <p>
              <strong>Distance:</strong> {notification.distance} km
            </p>
            <p>
              <strong>Price:</strong> ${notification.price}
            </p>
            <button
              style={{ marginRight: "10px" }}
              onClick={() => handleAcceptBooking(notification.bookingId)}
            >
              Accept
            </button>
            <button
              onClick={() => stopNotifications(notification.bookingId)}
              disabled={!isConnected}
            >
              Reject
            </button>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default DriverLanding;
