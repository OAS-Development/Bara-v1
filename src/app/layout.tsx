import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bara - Personal Productivity Suite",
  description: "Your comprehensive personal productivity companion",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bara"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {children}
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}