import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { CRMStoreProvider } from "@/lib/crm-store";
import { Toaster } from "@/components/ui/toaster";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus CRM System",
  description: "A clean CRM system for managing customers, leads, and support",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefin.className} antialiased`}>
        <AuthProvider>
          <CRMStoreProvider>
            {children}
            <Toaster />
          </CRMStoreProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
