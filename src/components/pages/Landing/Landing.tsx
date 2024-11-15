"use client";
import { useSelector } from "react-redux";
import Hero from "./Hero";
import { useState } from "react";
import { useRouter } from "next/navigation";

type propsType = {
  bookingDetails?: string;
};
export default function Landing({ bookingDetails }: propsType) {
  const [bookingDatac, setBookingDatac] = useState(bookingDetails || null);
  const router=useRouter()
  const { role } = useSelector(
    (state: { auth: { isLoggedIn: boolean; role: string; name: string } }) =>
      state.auth
  );
  if(role==="admin"){
    router.push('/admin/fleet')
  }
  return (
    <div className="min-h-screen ">
      <div className="min-h-screen">
        <Hero
          isDriver={role === "driver"}
          bookingDatac={bookingDatac}
          setBookingDatac={setBookingDatac}
        />
      </div>
    </div>
  );
}
