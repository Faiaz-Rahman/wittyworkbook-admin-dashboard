import React from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Providers } from "@/lib/Providers";

const inter = Inter({ subsets: ["latin"] });

import Script from "next/script";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Admin | WittyWorkbooks",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        {/* google analytics */}
        <meta name="google-adsense-account" content="ca-pub-3961895386687040" />
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

        {/* Google adsense */}
        {/* <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.CA_PUBLISHER_ID}`}
          crossOrigin="anonymous"
        ></Script> */}
      </Head>
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
