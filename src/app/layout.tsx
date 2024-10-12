import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
// import '../styles/globals.css';
import Navbar from "@/components/common/Navbar";
import axios from "axios";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Atlan assignment",
  description: "Atlan intern assignment",
};

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8800",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
             <Navbar />
        {children}
      </body>
    </html>
  );
}
