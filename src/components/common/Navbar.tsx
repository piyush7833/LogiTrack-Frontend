"use client";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loadUserFromCookies } from "@/store/authSlice";
import useAuth from "@/app/hooks/useAuth";

const Navbar = () => {
  const { isLoggedIn, role, name } = useSelector((state: { auth: { isLoggedIn: boolean; role: string; name: string } }) => state.auth);
  const {handleLogout} = useAuth();
  const dispatch = useDispatch();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const commonLinks = [
    { name: "Profile", path: "/profile" },
  ];
  const NoAdminLinks=[{ name: "Home", path: "/" },{ name: "Bookings", path: "/bookings" },]
  const adminLinks = [
    { name: "Fleet", path: "/admin/fleet" },
    { name: "Drivers", path: "/admin/driver" },
  ];

  useEffect(() => {
    dispatch(loadUserFromCookies());
  }, [dispatch]);
  const [links, setLinks] = useState(commonLinks);

  useEffect(() => {
    if (role === "admin") {
      setLinks([...commonLinks, ...adminLinks]);
    }else{
      setLinks([ ...NoAdminLinks,...commonLinks]);
    }
  }, [role]);

  return (
    <div className="flex justify-between px-primaryX py-primaryY border-[1px] items-center z-10 w-full">
      <div className="logo">
       <Link href={'/'}>
       <h1 className="font-semibold">Atlan - Assignment</h1>
       </Link> 
      </div>
      <div className="links hidden md:flex gap-4">
        {links.map((link, index) => (
          <Link key={index} href={link.path}>
            <p className="hover:text-blue-700"> {link.name}</p>
          </Link>
        ))}
      </div>
      {isLoggedIn ? (
        <div className="btns hidden md:flex gap-4 items-center">
          <Link href={"/profile"}>
          <p className="text-sm">{name}</p>
          </Link>
          <Button
            text="Logout"
            cls="secondary"
            onClick={() => {
              handleLogout();
            }}
          />
        </div>
      ) : (
        <div className="btns hidden md:flex gap-4">
          <Button
            text="Login"
            cls="secondary"
            onClick={() => {
              router.push("/auth?mode=login");
            }}
          />
          <Button
            text="Signup"
            onClick={() => {
              router.push("/auth?mode=signup");
            }}
          />
        </div>
      )}


      <div className="md:hidden">
        <button
          className="mobile-menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      
      {showMobileMenu && (
        <div className="mobile-menu absolute top-0 h-full left-0 w-full bg-white flex flex-col items-center gap-4 py-4 z-50">
          <button
            className="top-0 right-0 absolute p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}>
              X
            </button>
          {links.map((link, index) => (
            <Link key={index} href={link.path}>
              <p className="hover:text-blue-700"> {link.name}</p>
            </Link>
          ))}
          <Button
            text="Login"
            cls="secondary"
            onClick={() => {
              router.push("/auth?mode=login");
            }}
          />
          <Button
            text="Signup"
            onClick={() => {
              router.push("/auth?mode=signup");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
