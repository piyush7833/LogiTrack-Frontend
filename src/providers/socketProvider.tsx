"use client"
import React, { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  locationSocket:Socket |null
}

export const SocketContext = createContext<ISocketContext>({ socket: null,locationSocket:null });

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [locationSocket,setLocationSocket]=useState <Socket|null>(null)

  useEffect(() => {
    const newSocket = io("http://localhost:8800");
    setSocket(newSocket);
    const newLocationSocket=io("http://localhost:5000")
    setLocationSocket(newLocationSocket)
    return () => {
      newSocket.disconnect();
      newLocationSocket.disconnect()
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket,locationSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
