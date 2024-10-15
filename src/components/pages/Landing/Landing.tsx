"use client";
import { useSelector } from "react-redux";
import Hero from "./Hero";
import DriverLanding from "./DriverLanding";

export default function Home() {

  const { role } = useSelector((state: { auth: { isLoggedIn: boolean; role: string; name: string } }) => state.auth);
  return (
    <div className="min-h-screen ">
      <div className="min-h-screen">
        <Hero isDriver={role==="driver"} />
        {role == "driver" && <DriverLanding />}
      </div>
    </div>
  );
}
