import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent layout shift during font load
  preload: true, // Preload fonts to reduce shift
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Prevent layout shift during font load
  preload: true, // Preload fonts to reduce shift
});

export const metadata: Metadata = {
  title: "Real-Time Notification System",
  description: "A modern dashboard for managing real-time notifications",
};

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
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
