"use client";
import { Navbar } from "./components/Navbar";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
import { CartContextProvider } from "./context/cartContext";
import { ProductsContextProvider } from "./context/productsContex";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Store</title>
      </head>
      <body className={inter.className}>
        <ProductsContextProvider>
          <AuthProvider>
            <CartContextProvider>
              {" "}
              <Navbar />
              {children}
            </CartContextProvider>
          </AuthProvider>
        </ProductsContextProvider>
      </body>
    </html>
  );
}
