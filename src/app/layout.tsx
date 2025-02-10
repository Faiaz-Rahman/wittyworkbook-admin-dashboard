import React from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Providers } from "@/lib/Providers";

const inter = Inter({ subsets: ["latin"] });

import Script from "next/script";

export const metadata: Metadata = {
  title: "Admin | WittyWorkbooks",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${process.env.NEXT_PUBLIC_MEASUREMENT_ID}, {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
