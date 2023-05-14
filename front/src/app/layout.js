"use client";
import { Navbar } from "./components/Navbar";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
import { CartContextProvider } from "./context/cartContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Store</title>
      </head>
      <body className={inter.className}>
        <CartContextProvider>
          <AuthProvider>
            {" "}
            <Navbar />
            {children}
          </AuthProvider>
        </CartContextProvider>
      </body>
    </html>
  );
}
