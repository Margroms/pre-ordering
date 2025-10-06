"use client";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { InvoiceProvider } from "@/context/InvoiceContext";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";
import { usePathname } from "next/navigation";

// Move metadata to a separate file since we're using "use client"
// export const metadata: Metadata = {
//   title: "Harvey's Preorder",
//   description: "Preorder now!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Harvey's Preorder system</title>
        <meta name="description" content="Preorder now!" />
      </head>
      <body
        className={`font-garet antialiased bg-[url('/bg.svg')] bg-cover bg-center bg-no-repeat`}
      >
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <InvoiceProvider>
                <LayoutContent>{children}</LayoutContent>
                <ToastProvider />
              </InvoiceProvider>
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <Navbar />}
      {children}
    </>
  );
}
