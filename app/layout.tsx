import type { Metadata } from "next";
import { Inter, Fira_Sans, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const mplus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

export const metadata: Metadata = {
  title: "BitDown - Torrent",
  description: "Easy download, play to play...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mplus.className} bg-gray-900 min-w-[300px]`}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
